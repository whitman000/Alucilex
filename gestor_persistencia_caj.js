'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { adquirir, renovar, liberar, tieneControl, obtenerInstanciaId, obtenerToken } = require('./control_exclusividad_caj');
const { empaquetar, restaurar } = require('./respaldo_sesiones_caj');
const {
    guardarRespaldo, obtenerRespaldo, obtenerEstadoRespaldo,
    marcarUltimoRespaldo, revocarRespaldos, habilitarNuevaVinculacion
} = require('./storage_sesiones_caj');
const sesiones = new Map();
const INTERVALO_MS = 20000;
const MAX_SIN_CONFIRMACION_MS = 60000;
const respaldosEnCurso = new Set();
function habilitado() { return process.env.ALUCILEX_WHATSAPP_PERSISTENCIA === '1'; }
function clave() {
    const hex = process.env.ALUCILEX_SESIONES_KEY;
    if (!/^[a-fA-F0-9]{64}$/.test(hex || '')) throw new Error('ALUCILEX_SESIONES_KEY invalida');
    return Buffer.from(hex, 'hex');
}
function hashArchivos(folder) {
    const resultado = [];
    const visitar = (dir, prefijo) => {
        for (const e of fs.readdirSync(dir, { withFileTypes: true }).sort((a,b) => a.name.localeCompare(b.name))) {
            if (e.isSymbolicLink()) throw new Error('Enlace simbolico no permitido');
            const relativo = prefijo ? `${prefijo}/${e.name}` : e.name;
            const ruta = path.join(dir, e.name);
            if (e.isDirectory()) visitar(ruta, relativo);
            else if (e.isFile()) resultado.push([relativo, crypto.createHash('sha256').update(fs.readFileSync(ruta)).digest('hex')]);
            else throw new Error('Tipo de archivo no valido');
            if (resultado.length > 20000) throw new Error('Exceso de archivos');
        }
    };
    visitar(folder, '');
    return JSON.stringify(resultado);
}
async function iniciar(sessionId, folder, detener) {
    if (!habilitado()) return true;
    if (sesiones.has(sessionId)) return tieneControl(sessionId);
    if (!await adquirir(sessionId)) return false;
    const estado = {
        perdido: false,
        ocupado: false,
        temporizador: null,
        vigilancia: null,
        ultimaConfirmacion: Date.now(),
        detener
    };
    sesiones.set(sessionId, estado);
    try {
        const manifiesto = await obtenerEstadoRespaldo(sessionId);
        if (!fs.existsSync(path.join(folder, 'creds.json')) && manifiesto?.revocado !== true && manifiesto?.version) {
            if (fs.existsSync(folder)) throw new Error('Carpeta de sesion incompleta: restauracion detenida');
            const paquete = await obtenerRespaldo(sessionId, manifiesto.version);
            restaurar(paquete, folder, clave());
        }
        if (!await renovar(sessionId)) {
            throw new Error('Lease vencido durante la restauracion');
        }

        estado.ultimaConfirmacion = Date.now();

        estado.vigilancia = setInterval(() => {
            if (
                !estado.perdido &&
                Date.now() - estado.ultimaConfirmacion >=
                    MAX_SIN_CONFIRMACION_MS
            ) {
                estado.perdido = true;
                clearInterval(estado.temporizador);
                clearInterval(estado.vigilancia);

                Promise.resolve(detener(
                    new Error('Firestore sin confirmacion; conexion detenida')
                )).catch(error => {
                    console.error('[CAJ LEASE]', error.message);
                });
            }
        }, 5000);

        estado.temporizador = setInterval(async () => {
            if (estado.ocupado || estado.perdido) return;
            estado.ocupado = true;
            try {
                if (!await renovar(sessionId)) throw new Error('Lease perdido o vencido');
                if (!estado.perdido) {
                    estado.ultimaConfirmacion = Date.now();
                }
            } catch (e) {
                estado.perdido = true;
                clearInterval(estado.temporizador);
                clearInterval(estado.vigilancia);
                try { await detener(e); } catch (error) { console.error('[CAJ LEASE] Detencion fallida:', error.message); }
            } finally { estado.ocupado = false; }
        }, INTERVALO_MS);
        return true;
    } catch (error) {
        estado.perdido = true;
        clearInterval(estado.temporizador);
        clearInterval(estado.vigilancia);
        sesiones.delete(sessionId);
        await liberar(sessionId).catch(() => {});
        throw error;
    }
}
function autorizado(sessionId) {
    if (!habilitado()) return true;

    const estado = sesiones.get(sessionId);

    return Boolean(
        estado &&
        !estado.perdido &&
        tieneControl(sessionId) &&
        Date.now() - estado.ultimaConfirmacion <
            MAX_SIN_CONFIRMACION_MS
    );
}
async function detener(sessionId) {
    if (!habilitado()) return;
    const estado = sesiones.get(sessionId);
    if (!estado) return;
    estado.perdido = true;
    clearInterval(estado.temporizador);
    clearInterval(estado.vigilancia);
    sesiones.delete(sessionId);
    await liberar(sessionId);
}

async function respaldar(sessionId, folder) {
    if (!habilitado() || !autorizado(sessionId)) return false;
    if (respaldosEnCurso.has(sessionId)) return false;

    respaldosEnCurso.add(sessionId);

    try {
        const firmaAntes = hashArchivos(folder);

        await new Promise(resolve => setTimeout(resolve, 400));

        if (firmaAntes !== hashArchivos(folder)) {
            throw new Error('Archivos activos; respaldo aplazado');
        }

        const paquete = empaquetar(folder, clave());

        if (firmaAntes !== hashArchivos(folder)) {
            throw new Error('Archivos modificados durante empaquetado');
        }

        if (!autorizado(sessionId) || !await renovar(sessionId)) {
            throw new Error('Exclusividad perdida antes del respaldo');
        }

        const resultado = await guardarRespaldo(sessionId, paquete);

        if (firmaAntes !== hashArchivos(folder)) {
            throw new Error('Archivos modificados durante subida');
        }

        if (!autorizado(sessionId) || !await renovar(sessionId)) {
            throw new Error('Exclusividad perdida durante subida');
        }

        await marcarUltimoRespaldo(
            sessionId,
            resultado.version,
            obtenerInstanciaId(),
            obtenerToken(sessionId)
        );

        return true;

    } finally {
        respaldosEnCurso.delete(sessionId);
    }
}
async function revocar(sessionId) { if (habilitado()) await revocarRespaldos(sessionId); }
async function nuevaVinculacion(sessionId) { if (habilitado()) await habilitarNuevaVinculacion(sessionId); }
module.exports = { habilitado, iniciar, autorizado, detener, respaldar, revocar, nuevaVinculacion };
