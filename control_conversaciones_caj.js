'use strict';

// Motor de control independiente de WhatsApp y Firebase, para probar el relevo humano.
const crypto = require('crypto');
const ETIQUETAS_CAJ = Object.freeze({
    RECEPCION_IA: 'CAJ - Recepción IA',
    USUARIO: 'Usuario CAJ',
    DERIVADO: 'CAJ - Derivado a Postulante',
    URGENTE: 'CAJ - Audiencia Inminente',
    ATENDIDO: 'CAJ - Atendido'
});
const normalizar = valor => String(valor || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
const nombresPermitidos = () => (process.env.CAJ_ETIQUETAS_HABILITADAS || `${ETIQUETAS_CAJ.USUARIO}|${ETIQUETAS_CAJ.RECEPCION_IA}`).split('|').map(normalizar);
function evaluarAccesoPorEtiquetas(etiquetas = []) {
    const permitirIA = etiquetas.some(e => nombresPermitidos().includes(normalizar(typeof e === 'string' ? e : e.name)));
    return { permitirIA, motivo: permitirIA ? 'etiqueta_habilitada' : 'sin_etiqueta_habilitada' };
}
const clave = (...partes) => crypto.createHash('sha256').update(JSON.stringify(partes)).digest('hex');

function crearControlConversaciones({ repo, analizar, enviar, generarId = () => crypto.randomUUID(), error = console.error }) {
    const etiquetas = new Map();
    const chats = new Map();
    const propios = new Set();
    let conectado = false;
    function chat(jid) {
        if (!chats.has(jid)) chats.set(jid, { etiquetas: new Set(), pausado: false, revision: 0, cola: Promise.resolve() });
        return chats.get(jid);
    }
    function permitido(jid) {
        return conectado && evaluarAccesoPorEtiquetas([...chat(jid).etiquetas].map(id => etiquetas.get(id) || '')).permitirIA;
    }
    function encolar(jid, tarea) {
        const c = chat(jid);
        const pendiente = c.cola.then(tarea);
        c.cola = pendiente.catch(e => error('No se completó la atención CAJ:', e.message));
        return pendiente;
    }
    function editarEtiqueta(etiqueta) {
        const id = String(etiqueta.id);
        if (etiqueta.deleted) etiquetas.delete(id);
        else if (typeof etiqueta.name === 'string') etiquetas.set(id, etiqueta.name);
        // Invalida respuestas en curso ante cualquier cambio de nombre o eliminación.
        for (const c of chats.values()) if (c.etiquetas.has(id)) c.revision++;
    }
    function asociarEtiqueta(evento) {
        const a = evento.association;
        if (!a || a.type !== 'label_jid') return Promise.resolve();
        const c = chat(a.chatId);
        const id = String(a.labelId);
        c.revision++;
        if (evento.type === 'remove') c.etiquetas.delete(id);
        else if (evento.type === 'add') c.etiquetas.add(id);
        return Promise.resolve();
    }
    function reactivar(jid) {
        if (!permitido(jid)) return Promise.reject(new Error('La conversación no tiene una etiqueta CAJ reconocida en esta conexión.'));
        const c = chat(jid);
        const revision = ++c.revision;
        return encolar(jid, async () => {
            if (c.revision !== revision || !permitido(jid)) throw new Error('La conversación cambió; revisa antes de reactivar.');
            await repo.pausar(jid, false);
            if (c.revision === revision) c.pausado = false;
        });
    }
    async function recibir(mensaje) {
        const { jid, id, delAsesor, texto = '', tipo = 'texto' } = mensaje;
        if (!jid || !id || !permitido(jid)) return { ignorado: true };
        if (propios.has(id)) return { propio: true };
        const c = chat(jid);
        const pausaPrevia = c.pausado;
        // Se ejecuta ANTES de esperar la cola: cancela una respuesta que la IA esté generando.
        if (delAsesor) { c.pausado = true; c.revision++; }
        const revisionEntrada = c.revision;
        if (delAsesor && await repo.esPropio(jid, id)) {
            if (c.revision === revisionEntrada) c.pausado = pausaPrevia;
            return { propio: true };
        }
        return encolar(jid, async () => {
            if (delAsesor) await repo.pausar(jid, true);
            if (!permitido(jid)) return { ignorado: true };
            const previo = await repo.estado(jid);
            c.pausado = c.pausado || previo.pausado === true;
            const nuevo = await repo.registrar(mensaje);
            if (!nuevo) return { duplicado: true };
            if (tipo !== 'texto' || !texto.trim() || texto.length > 30000) {
                await repo.marcar(jid, id, { estado: 'pendiente_revision', motivo: tipo !== 'texto' ? 'multimedia_etapa_posterior' : 'texto_no_procesable' });
                return { pendiente: true };
            }
            try {
                const contexto = await repo.contexto(jid);
                if (!permitido(jid)) return { ignorado: true };
                const resultado = await analizar({ ...mensaje, contexto, silencioso: c.pausado || delAsesor });
                if (!permitido(jid)) {
                    await repo.marcar(jid, id, { estado: 'pendiente_revision', motivo: 'etiqueta_retirada' });
                    return { ignorado: true };
                }
                await repo.incorporar(mensaje, resultado);
                const actual = await repo.estado(jid);
                if (delAsesor || c.pausado || actual.pausado || c.revision !== revisionEntrada || !permitido(jid)) return { silencioso: true };
                const respuesta = typeof resultado.respuesta_humana === 'string' ? resultado.respuesta_humana.trim() : '';
                if (!respuesta) return { silencioso: true };
                const idSalida = generarId();
                propios.add(idSalida);
                if (propios.size > 2000) propios.delete(propios.values().next().value);
                await repo.reservarSalida(jid, idSalida);
                // Última comprobación, inmediatamente antes de entregar el mensaje al transporte.
                if (c.pausado || c.revision !== revisionEntrada || !permitido(jid)) return { silencioso: true };
                await enviar(jid, respuesta, idSalida);
                await repo.marcarSalida(jid, idSalida);
                return { respondido: true };
            } catch (e) {
                await repo.marcar(jid, id, { estado: 'pendiente_revision', motivo: 'fallo_procesamiento' });
                throw e;
            }
        });
    }
    return {
        recibir, editarEtiqueta, asociarEtiqueta, reactivar,
        conectar(valor) { conectado = valor; if (!valor) for (const c of chats.values()) c.revision++; },
        // Asociaciones nunca se restauran de una caché antigua: esperar eventos actuales de WhatsApp.
        cargarNombres(lista) { for (const e of lista) editarEtiqueta(e); },
        permitido
    };
}

module.exports = { crearControlConversaciones, evaluarAccesoPorEtiquetas, ETIQUETAS_CAJ, clave };
