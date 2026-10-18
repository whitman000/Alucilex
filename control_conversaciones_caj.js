'use strict';

// Motor de control independiente de WhatsApp y Firebase, para gestionar etiquetas CAJ,
// el relevo humano automático (delAsesor) y la extracción silenciosa de datos.
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
        if (!chats.has(jid)) {
            chats.set(jid, {
                etiquetas: new Set(),
                enListaAsesor: false,
                pausado: false,
                revision: 0,
                cola: Promise.resolve()
            });
        }
        return chats.get(jid);
    }

    function permitido(jid) {
        if (!conectado) return false;
        const c = chat(jid);
        if (c.enListaAsesor) return true;
        const nombres = [...c.etiquetas].map(id => etiquetas.get(id) || '');
        return evaluarAccesoPorEtiquetas(nombres).permitirIA;
    }

    function encolar(jid, tarea) {
        const c = chat(jid);
        const pendiente = c.cola.then(tarea);
        c.cola = pendiente.catch(e => error('No se completó la atención CAJ:', e.message));
        return pendiente;
    }

    function editarEtiqueta(etiqueta) {
        if (!etiqueta || etiqueta.id === undefined || etiqueta.id === null) return;
        const id = String(etiqueta.id);
        if (etiqueta.deleted) etiquetas.delete(id);
        else if (typeof etiqueta.name === 'string') etiquetas.set(id, etiqueta.name);
        // Invalida respuestas en curso ante cualquier cambio de nombre o eliminación.
        for (const c of chats.values()) if (c.etiquetas.has(id)) c.revision++;
    }

    function asociarEtiqueta(evento) {
        const a = evento && evento.association;
        if (!a || a.type !== 'label_jid') return Promise.resolve();
        const c = chat(a.chatId);
        const id = String(a.labelId);
        c.revision++;
        if (evento.type === 'remove') {
            c.etiquetas.delete(id);
        } else if (evento.type === 'add') {
            c.etiquetas.add(id);
            // Si el asesor vuelve a etiquetar el chat, la IA retoma el control automáticamente.
            if (c.pausado) {
                c.pausado = false;
                if (repo && typeof repo.pausar === 'function') {
                    return Promise.resolve(repo.pausar(a.chatId, false)).catch(() => {});
                }
            }
        }
        return Promise.resolve();
    }

    // Permite que el asesor habilite o deshabilite un chat directamente en su lista CAJ
    function asignarEnLista(jid, habilitado = true) {
        const c = chat(jid);
        c.enListaAsesor = Boolean(habilitado);
        c.revision++;
        if (habilitado && c.pausado) {
            c.pausado = false;
            if (repo && typeof repo.pausar === 'function') {
                return Promise.resolve(repo.pausar(jid, false)).catch(() => {});
            }
        }
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

    function registrarIdPropio(idMensaje) {
        if (!idMensaje) return;
        propios.add(String(idMensaje));
        if (propios.size > 2000) propios.delete(propios.values().next().value);
    }

    async function recibir(mensaje) {
        const { jid, id, delAsesor, texto = '', tipo = 'texto' } = mensaje || {};
        if (!jid || !id || !permitido(jid)) return { ignorado: true };
        if (propios.has(id)) return { propio: true };
        const c = chat(jid);
        const pausaPrevia = c.pausado;
        // Se ejecuta ANTES de esperar la cola: si el asesor jurídico escribe, cancela respuestas en curso y pausa la IA.
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
                // La IA analiza SIEMPRE el mensaje (incluso cuando escribe el asesor o está pausada: silencioso = true)
                // para seguir alimentando la ficha y los hechos en Firebase.
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
                registrarIdPropio(idSalida);
                await repo.reservarSalida(jid, idSalida);
                // Última comprobación, inmediatamente antes de entregar el mensaje al transporte.
                if (c.pausado || c.revision !== revisionEntrada || !permitido(jid)) return { silencioso: true };
                const idRealTransporte = await enviar(jid, respuesta, idSalida);
                if (typeof idRealTransporte === 'string' && idRealTransporte) {
                    registrarIdPropio(idRealTransporte);
                }
                await repo.marcarSalida(jid, idSalida, respuesta);
                return { respondido: true };
            } catch (e) {
                await repo.marcar(jid, id, { estado: 'pendiente_revision', motivo: 'fallo_procesamiento' });
                throw e;
            }
        });
    }

    return {
        recibir,
        editarEtiqueta,
        asociarEtiqueta,
        asignarEnLista,
        reactivar,
        registrarIdPropio,
        conectar(valor) {
            conectado = Boolean(valor);
            if (!valor) for (const c of chats.values()) c.revision++;
        },
        cargarNombres(lista = []) {
            for (const e of lista) editarEtiqueta(e);
        },
        obtenerEtiquetas() {
            return Array.from(etiquetas.entries()).map(([id, name]) => ({ id, name }));
        },
        estadoChat(jid) {
            const c = chat(jid);
            return {
                jid,
                permitido: permitido(jid),
                pausado: c.pausado,
                enListaAsesor: c.enListaAsesor,
                etiquetasIds: [...c.etiquetas],
                etiquetasNombres: [...c.etiquetas].map(id => etiquetas.get(id) || id)
            };
        },
        permitido
    };
}

module.exports = { crearControlConversaciones, evaluarAccesoPorEtiquetas, ETIQUETAS_CAJ, clave };