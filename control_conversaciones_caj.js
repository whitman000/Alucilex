
'use strict';

// Motor de control independiente de WhatsApp y Firebase, para gestionar etiquetas CAJ,
// el relevo humano automático (delAsesor) y la extracción silenciosa de datos.
const crypto = require('crypto');
const {
    siguientePreguntaPersonal,
    siguientePreguntaJuridica
} = require('./entrevista_caj');

const ETIQUETAS_CAJ = Object.freeze({
    RECEPCION_IA: 'CAJ - Recepción IA',
    USUARIO: 'Usuario CAJ',
    DERIVADO: 'CAJ - Derivado a Postulante',
    URGENTE: 'CAJ - Audiencia Inminente',
    ATENDIDO: 'CAJ - Atendido',
    CAJ_IA: 'Caj ia'
});

const normalizar = valor => String(valor || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

const nombresPermitidos = () => {
    const configuradas = (
        process.env.ALUCILEXETIQUETASCAJ ||
        process.env.CAJ_ETIQUETAS_HABILITADAS ||
        `${ETIQUETAS_CAJ.USUARIO}|${ETIQUETAS_CAJ.RECEPCION_IA}`
    ).split('|');

    // Mantiene las etiquetas configuradas y autoriza la etiqueta real Caj ia.
    return [...new Set([
        ...configuradas.map(normalizar),
        normalizar(ETIQUETAS_CAJ.CAJ_IA)
    ])];
};

function evaluarAccesoPorEtiquetas(etiquetas = []) {
    const permitidas = nombresPermitidos();

    const permitirIA = etiquetas.some(e =>
        permitidas.includes(
            normalizar(typeof e === 'string' ? e : e.name)
        )
    );

    return {
        permitirIA,
        motivo: permitirIA
            ? 'etiqueta_habilitada'
            : 'sin_etiqueta_habilitada'
    };
}

const clave = (...partes) =>
    crypto.createHash('sha256')
        .update(JSON.stringify(partes))
        .digest('hex');

function crearControlConversaciones({
    repo,
    analizar,
    enviar,
    generarId = () => crypto.randomUUID(),
    error = console.error
}) {
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

        const nombres = [...c.etiquetas].map(
            id => etiquetas.get(id) || ''
        );

        return evaluarAccesoPorEtiquetas(nombres).permitirIA;
    }

    function encolar(jid, tarea) {
        const c = chat(jid);
        const pendiente = c.cola.then(tarea);

        c.cola = pendiente.catch(e =>
            error('No se completó la atención CAJ:', e.message)
        );

        return pendiente;
    }

    function editarEtiqueta(etiqueta) {
        if (
            !etiqueta ||
            etiqueta.id === undefined ||
            etiqueta.id === null
        ) {
            return;
        }

        const id = String(etiqueta.id);

        if (etiqueta.deleted) {
            etiquetas.delete(id);
        } else if (typeof etiqueta.name === 'string') {
            etiquetas.set(id, etiqueta.name);
        }

        // Invalida respuestas en curso ante un cambio de etiqueta.
        for (const c of chats.values()) {
            if (c.etiquetas.has(id)) {
                c.revision++;
            }
        }
    }

    function asociarEtiqueta(evento) {
        const a = evento && evento.association;

        if (!a || a.type !== 'label_jid') {
            return Promise.resolve();
        }

        const c = chat(a.chatId);
        const id = String(a.labelId);

        c.revision++;

        if (evento.type === 'remove') {
            c.etiquetas.delete(id);
        } else if (evento.type === 'add') {
            c.etiquetas.add(id);

            // CAJ_RESPETAR_PAUSA_EXPLICITA_V1
            // Una etiqueta autoriza el chat, pero no reactiva la IA.
        }

        return Promise.resolve();
    }

    function asignarEnLista(jid, habilitado = true) {
        const c = chat(jid);

        c.enListaAsesor = Boolean(habilitado);
        c.revision++;

        // Habilitar el chat no revoca una pausa del asesor.
        // Solo la orden CONTINUAR IA puede hacerlo.
        return Promise.resolve();
    }

    // CAJ_PAUSA_MANUAL_EXPLICITA_V1
    // Pausa interna sin enviar mensajes al cliente.
    function pausarManual(jid) {
        if (!permitido(jid)) {
            return Promise.reject(
                new Error('Chat CAJ no autorizado')
            );
        }

        const c = chat(jid);
        c.pausado = true;
        c.revision++;

        return encolar(jid, async () => {
            await repo.pausar(jid, true);
            return { pausado: true };
        });
    }

    function reactivar(jid) {
        if (!permitido(jid)) {
            return Promise.reject(
                new Error(
                    'La conversación no tiene una etiqueta CAJ reconocida en esta conexión.'
                )
            );
        }

        const c = chat(jid);
        const revision = ++c.revision;

        return encolar(jid, async () => {
            if (
                c.revision !== revision ||
                !permitido(jid)
            ) {
                throw new Error(
                    'La conversación cambió; revisa antes de reactivar.'
                );
            }

            await repo.pausar(jid, false);

            if (c.revision === revision) {
                c.pausado = false;
            }
        });
    }

    function registrarIdPropio(idMensaje) {
        if (!idMensaje) return;

        propios.add(String(idMensaje));

        if (propios.size > 2000) {
            propios.delete(
                propios.values().next().value
            );
        }
    }

    async function recibir(mensaje) {
        const {
            jid,
            id,
            delAsesor,
            texto = '',
            tipo = 'texto'
        } = mensaje || {};

        if (!jid || !id || !permitido(jid)) {
            return { ignorado: true };
        }

        if (propios.has(id)) {
            return { propio: true };
        }

        const c = chat(jid);
        const pausaPrevia = c.pausado;

        // Si el asesor interviene, cancela respuestas en curso.
        if (delAsesor) {
            c.pausado = true;
            c.revision++;
        }

        const revisionEntrada = c.revision;

        if (
            delAsesor &&
            await repo.esPropio(jid, id)
        ) {
            if (c.revision === revisionEntrada) {
                c.pausado = pausaPrevia;
            }

            return { propio: true };
        }

        return encolar(jid, async () => {
            if (delAsesor) {
                await repo.pausar(jid, true);
            }

            if (!permitido(jid)) {
                return { ignorado: true };
            }

            const previo = await repo.estado(jid);

            c.pausado =
                c.pausado ||
                previo.pausado === true;

            const nuevo = await repo.registrar(mensaje);

            if (!nuevo) {
                return { duplicado: true };
            }

            if (
                tipo !== 'texto' ||
                !texto.trim() ||
                texto.length > 30000
            ) {
                await repo.marcar(jid, id, {
                    estado: 'pendiente_revision',
                    motivo: tipo !== 'texto'
                        ? 'multimedia_etapa_posterior'
                        : 'texto_no_procesable'
                });

                return { pendiente: true };
            }

            try {
                const contexto = await repo.contexto(jid);

                if (!permitido(jid)) {
                    return { ignorado: true };
                }

                // La IA también analiza silenciosamente
                // los mensajes cuando interviene el asesor.
                console.log("[DIAG OPENROUTER] INICIO", {
                    jid,
                    mensajeId: id,
                    silencioso: c.pausado || delAsesor,
                    caracteres: texto.length
                });
                const resultado = await analizar({
                    ...mensaje,
                    contexto,
                    silencioso: c.pausado || delAsesor
                });

                if (!permitido(jid)) {
                    await repo.marcar(jid, id, {
                        estado: 'pendiente_revision',
                        motivo: 'etiqueta_retirada'
                    });

                    return { ignorado: true };
                }

                console.log("[DIAG OPENROUTER] RESULTADO", {
                    jid,
                    mensajeId: id,
                    datosExtraidos: Object.keys(
                        resultado?.datos_extraidos || {}
                    ).filter(k => {
                        const valor = resultado.datos_extraidos[k];
                        return valor !== null &&
                            valor !== undefined &&
                            valor !== "" &&
                            (!Array.isArray(valor) || valor.length > 0);
                    }),
                    tieneRespuesta: Boolean(resultado?.respuesta_humana)
                });

                console.log("[DIAG FIREBASE] INICIO", {
                    jid,
                    mensajeId: id
                });
                await repo.incorporar(
                    mensaje,
                    resultado
                );

                const actual = await repo.estado(jid);

                // CAJ_CONTROL_PREGUNTAS_V1
                // Consulta el siguiente campo sin alterar todavía
                // la respuesta generada por OpenRouter.
                const siguienteCampoCAJ = siguientePreguntaPersonal(
                    actual.fichaActual || {},
                    {
                        camposResueltos:
                            actual.entrevista?.camposResueltos || []
                    }
                );

                // CAJ_PREGUNTA_JURIDICA_DETERMINISTA_V1
                const siguienteCampoJuridicoCAJ =
                    siguienteCampoCAJ
                        ? null
                        : siguientePreguntaJuridica(
                            actual.fichaActual || {},
                            actual.entrevista || {}
                        );

                const campoElegidoCAJ =
                    siguienteCampoCAJ || siguienteCampoJuridicoCAJ;

                if (
                    delAsesor ||
                    c.pausado ||
                    actual.pausado ||
                    c.revision !== revisionEntrada ||
                    !permitido(jid)
                ) {
                    return { silencioso: true };
                }

                // CAJ_RESPUESTA_CIERRE_CONTROLADA_V1
                // El cierre confirmado tiene prioridad sobre otra pregunta.
                const respuestaGenerada =
                    typeof resultado.respuesta_humana === 'string'
                        ? resultado.respuesta_humana.trim()
                        : '';

                // CAJ_ACTIVAR_PREGUNTAS_DETERMINISTAS_V1
                // Se conserva la respuesta original para cuando no
                // existan preguntas personales pendientes.
                const respuestaOriginal =
                    actual.entrevista?.finalizada === true
                        ? 'Gracias por proporcionar sus antecedentes. Su entrevista ha finalizado y la información quedó registrada para revisión del asesor jurídico. Si necesita agregar algo más, puede escribir nuevamente.'
                        : respuestaGenerada;

                // Conservar el encabezado institucional existente.
                const coincidenciaEncabezado = respuestaGenerada.match(
                    /^[\s\S]*?━━━━━━━━━━━━━━━━━━━━━━\s*/
                );

                const encabezadoCAJ = coincidenciaEncabezado
                    ? coincidenciaEncabezado[0]
                    : [
                        `🏛️ *${contexto.centroNombre || 'CAJ'}*`,
                        `⚖️ *Asesor Jurídico a cargo:* ${contexto.asesorNombre || 'Asesor jurídico'}`,
                        '━━━━━━━━━━━━━━━━━━━━━━',
                        ''
                    ].join('\n') + '\n';

                // La pregunta pendiente tiene prioridad sobre
                // cualquier cierre anticipado generado por la IA.
                // CAJ_CIERRE_DETERMINISTA_V1
                // JavaScript decide cuándo preguntar y cuándo cerrar.
                const preguntaCierreCAJ =
                    '¿Tiene algún antecedente adicional que desee agregar a su consulta?';

                let respuesta;

                // CAJ_ACLARACION_CONTEXTUAL_V1
                // Solo aceptar aclaraciones del campo que se
                // pregunto efectivamente al cliente.
                const interpretacionCAJ =
                    resultado?.interpretacion_respuesta;

                const preguntaAclaracionCAJ =
                    campoElegidoCAJ &&
                    contexto.entrevista?.campoActual ===
                        campoElegidoCAJ.campo &&
                    interpretacionCAJ?.campo ===
                        campoElegidoCAJ.campo &&
                    interpretacionCAJ?.estado ===
                        'requiere_aclaracion' &&
                    typeof interpretacionCAJ.aclaracion ===
                        'string' &&
                    interpretacionCAJ.aclaracion.trim()
                        ? interpretacionCAJ.aclaracion.trim()
                        : null;

                if (campoElegidoCAJ) {
                    // Mantener pendiente el mismo campo hasta
                    // obtener una respuesta suficiente.
                    respuesta = encabezadoCAJ + (
                        preguntaAclaracionCAJ ||
                        campoElegidoCAJ.pregunta
                    );
                } else if (actual.entrevista?.finalizada === true) {
                    // El cliente confirmó expresamente el término.
                    respuesta = respuestaOriginal;
                } else {
                    // Todos los campos aplicables están resueltos.
                    // Solicitar confirmación expresa.
                    respuesta = encabezadoCAJ + preguntaCierreCAJ;
                }

                if (!respuesta) {
                    return { silencioso: true };
                }

                const idSalida = generarId();

                registrarIdPropio(idSalida);

                await repo.reservarSalida(
                    jid,
                    idSalida
                );

                // Verificación final antes de responder.
                if (
                    c.pausado ||
                    c.revision !== revisionEntrada ||
                    !permitido(jid)
                ) {
                    return { silencioso: true };
                }

                const idRealTransporte = await enviar(
                    jid,
                    respuesta,
                    idSalida
                );

                if (
                    typeof idRealTransporte === 'string' &&
                    idRealTransporte
                ) {
                    registrarIdPropio(idRealTransporte);
                }

                await repo.marcarSalida(
                    jid,
                    idSalida,
                    respuesta
                );

                // CAJ_CAMPO_ENVIADO_V1
                // Registrar únicamente preguntas que coincidan
                // con el campo determinado por el controlador.
                if (
                    campoElegidoCAJ &&
                    (
                        respuesta.includes(campoElegidoCAJ.pregunta) ||
                        Boolean(preguntaAclaracionCAJ)
                    ) &&
                    typeof repo.registrarCampoPreguntado === 'function'
                ) {
                    await repo.registrarCampoPreguntado(
                        jid,
                        campoElegidoCAJ.campo
                    );
                }

                return { respondido: true };
            } catch (e) {
                await repo.marcar(jid, id, {
                    estado: 'pendiente_revision',
                    motivo: 'fallo_procesamiento'
                });

                throw e;
            }
        });
    }


    return {
        recibir,
        editarEtiqueta,
        asociarEtiqueta,
        asignarEnLista,
        pausarManual,
        reactivar,
        registrarIdPropio,

        // Obtener el expediente asociado al chat de WhatsApp.
        async obtenerExpedienteParaDocumento(jid) {
            if (!repo || typeof repo.obtenerExpedienteParaDocumento !== 'function') {
                throw new Error(
                    'El repositorio CAJ no permite obtener el expediente'
                );
            }

            if (!permitido(jid)) {
                throw new Error(
                    'Chat sin etiqueta CAJ autorizada'
                );
            }

            return repo.obtenerExpedienteParaDocumento(jid);
        },

        // Registrar los antecedentes del archivo en el expediente.
        async registrarDocumento(jid, documento) {
            if (!repo || typeof repo.registrarDocumento !== 'function') {
                throw new Error(
                    'El repositorio CAJ no permite registrar documentos'
                );
            }

            if (!permitido(jid)) {
                throw new Error(
                    'Chat sin etiqueta CAJ autorizada'
                );
            }

            return repo.registrarDocumento(jid, documento);
        },


        conectar(valor) {
            conectado = Boolean(valor);

            if (!valor) {
                for (const c of chats.values()) {
                    c.revision++;
                }
            }
        },

        cargarNombres(lista = []) {
            for (const e of lista) {
                editarEtiqueta(e);
            }
        },

        obtenerEtiquetas() {
            return Array.from(etiquetas.entries()).map(
                ([id, name]) => ({ id, name })
            );
        },

        estadoChat(jid) {
            const c = chat(jid);

            return {
                jid,
                permitido: permitido(jid),
                pausado: c.pausado,
                enListaAsesor: c.enListaAsesor,
                etiquetasIds: [...c.etiquetas],
                etiquetasNombres: [...c.etiquetas].map(
                    id => etiquetas.get(id) || id
                )
            };
        },

        permitido
    };
}

module.exports = {
    crearControlConversaciones,
    evaluarAccesoPorEtiquetas,
    ETIQUETAS_CAJ,
    clave
};
