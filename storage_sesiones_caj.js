'use strict';

const crypto = require('crypto');
const { storageBucket, db } = require('./firebase_caj');

const BASE = 'alucilex/sesiones_cifradas';

function validarSesion(sessionId) {
    if (
        typeof sessionId !== 'string' ||
        !/^[a-zA-Z0-9_-]{1,128}$/.test(sessionId)
    ) {
        throw new Error('Identificador de sesion invalido');
    }
    return sessionId;
}

function obtenerBucket() {
    if (!storageBucket) {
        throw new Error('Firebase Storage no disponible');
    }
    return storageBucket;
}

function validarPaquete(paquete) {
    if (
        !paquete ||
        paquete.version !== 1 ||
        paquete.algoritmo !== 'aes-256-gcm' ||
        !['iv', 'tag', 'datos'].every(
            campo => typeof paquete[campo] === 'string'
        )
    ) {
        throw new Error('Paquete cifrado invalido');
    }
}

async function guardarRespaldo(sessionId, paquete) {
    validarSesion(sessionId);
    validarPaquete(paquete);

    const version = crypto.randomUUID();
    const ruta = `${BASE}/${sessionId}/${version}.json`;

    const archivo = obtenerBucket().file(ruta);

    const contenido = JSON.stringify({
        formato: 1,
        sessionId,
        version,
        paquete
    });

    await archivo.save(contenido, {
        resumable: false,
        contentType: 'application/json',
        preconditionOpts: {
            ifGenerationMatch: 0
        }
    });

    return { sessionId, version };
}

async function obtenerRespaldo(sessionId, version) {
    validarSesion(sessionId);

    if (
        typeof version !== 'string' ||
        !/^[0-9a-f-]{36}$/i.test(version)
    ) {
        throw new Error('Version invalida');
    }

    const ruta = `${BASE}/${sessionId}/${version}.json`;
    const archivo = obtenerBucket().file(ruta);

    const [contenido] = await archivo.download();

    const respaldo = JSON.parse(contenido.toString('utf8'));

    if (
        respaldo.formato !== 1 ||
        respaldo.sessionId !== sessionId ||
        respaldo.version !== version
    ) {
        throw new Error('Respaldo no corresponde a la sesion');
    }

    validarPaquete(respaldo.paquete);

    return respaldo.paquete;
}

async function listarRespaldos(sessionId) {
    validarSesion(sessionId);

    const [archivos] = await obtenerBucket().getFiles({
        prefix: `${BASE}/${sessionId}/`
    });

    return archivos
        .map(archivo => archivo.name.split('/').pop())
        .filter(nombre =>
            /^[0-9a-f-]{36}\.json$/i.test(nombre)
        )
        .map(nombre => nombre.slice(0, -5));
}

function referenciaManifiesto(sessionId) {
    validarSesion(sessionId);
    if (!db) throw new Error('Firestore no disponible');
    return db.collection('estado_respaldos_whatsapp_caj').doc(sessionId);
}
async function obtenerEstadoRespaldo(sessionId) {
    const doc = await referenciaManifiesto(sessionId).get();
    return doc.exists ? doc.data() : null;
}
async function marcarUltimoRespaldo(sessionId, version, instanciaId, token) {
    validarSesion(sessionId);
    if (!/^[0-9a-f-]{36}$/i.test(version)) throw new Error('Version invalida');
    if (!instanciaId || !token) throw new Error('Propiedad de sesion requerida');
    const refEstado = referenciaManifiesto(sessionId);
    const refLease = db.collection('control_sesiones_whatsapp_caj').doc(sessionId);
    return db.runTransaction(async tx => {
        const lease = await tx.get(refLease);
        const estado = await tx.get(refEstado);
        const autorizado = lease.exists && lease.data().instanciaId === instanciaId &&
            lease.data().token === token && Number(lease.data().venceEn) > lease.readTime.toMillis();
        if (!autorizado) throw new Error('Sesion sin exclusividad; respaldo no publicado');
        if (estado.exists && estado.data().revocado === true) throw new Error('Respaldo revocado');
        tx.set(refEstado, { version, revocado: false, actualizadoEn: new Date() }, { merge: true });
    });
}
async function revocarRespaldos(sessionId) {
    const ref = referenciaManifiesto(sessionId);
    await ref.set({ revocado: true, version: null, actualizadoEn: new Date() }, { merge: true });
}
async function habilitarNuevaVinculacion(sessionId) {
    const ref = referenciaManifiesto(sessionId);
    await ref.set({ revocado: false, version: null, actualizadoEn: new Date() }, { merge: true });
}
module.exports = {
    guardarRespaldo,
    obtenerRespaldo,
    listarRespaldos,
    obtenerEstadoRespaldo,
    marcarUltimoRespaldo,
    revocarRespaldos,
    habilitarNuevaVinculacion
};
