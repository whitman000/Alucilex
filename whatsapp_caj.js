
'use strict';

const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    downloadMediaMessage
} = require('@whiskeysockets/baileys');

const qrcode = require('qrcode');
const pino = require('pino');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const {
    crearControlConversaciones,
    ETIQUETAS_CAJ
} = require('./control_conversaciones_caj');

const {
    crearRepositorioWhatsAppFirebase,
    obtenerAsesorActivoCAJ,
    normalizarTelefono
} = require('./firebase_caj');

const {
    analizarMensajeWhatsAppCAJ
} = require('./motor_caj');
const {
    transcribirAudioCAJ
} = require('./transcribir_audio_caj');

// ============================================================
// ADMINISTRACION INDEPENDIENTE DE SESIONES
// ============================================================

const sesiones = new Map();
const estados = new Map();
const controles = new Map();

const iniciosPendientes = new Map();
const reconexionesPendientes = new Map();
const desconexionesPendientes = new Map();
const sesionesDetenidas = new Set();
const generaciones = new Map();
const conflictosConsecutivos = new Map();

const idsEnviadosPorBot = new Set();
const envioBotReciente = new Map();
const ultimosMensajesCliente = new Map();

const MAX_CONFLICTOS = 5;
const DEMORA_NORMAL = 10000;
const DEMORA_CONFLICTO = 30000;

const authDir = path.join(__dirname, 'auth_caj');

if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
}

// ============================================================
// IDENTIFICACION Y CONTROL DE CONEXIONES
// ============================================================

function generacionActual(sessionId) {
    return generaciones.get(sessionId) || 0;
}

function incrementarGeneracion(sessionId) {
    const siguiente = generacionActual(sessionId) + 1;
    generaciones.set(sessionId, siguiente);
    return siguiente;
}

function cancelarReconexiones(sessionId) {
    const temporizador = reconexionesPendientes.get(sessionId);

    if (temporizador) {
        clearTimeout(temporizador);
    }

    reconexionesPendientes.delete(sessionId);
}

function registrarIdMensajeBot(id) {
    if (!id) return;

    idsEnviadosPorBot.add(String(id));

    if (idsEnviadosPorBot.size > 3000) {
        idsEnviadosPorBot.delete(
            idsEnviadosPorBot.values().next().value
        );
    }
}

function formatearJid(numeroOJid) {
    const valor = String(numeroOJid || '').trim();

    if (valor.endsWith('@s.whatsapp.net')) {
        return valor;
    }

    const numero = normalizarTelefono(valor);

    return numero ? `${numero}@s.whatsapp.net` : '';
}

// ============================================================
// ETIQUETAS DE WHATSAPP BUSINESS
// ============================================================

function rutaEtiquetasSesion(sessionId) {
    return path.join(
        authDir,
        `etiquetas_${sessionId}.json`
    );
}

function cargarEtiquetasGuardadas(sessionId) {
    try {
        const archivo = rutaEtiquetasSesion(sessionId);

        if (fs.existsSync(archivo)) {
            return JSON.parse(
                fs.readFileSync(archivo, 'utf8')
            );
        }
    } catch (error) {
        console.warn(
            '[CAJ] Error leyendo etiquetas:',
            error.message
        );
    }

    return [];
}

function guardarEtiquetasSesion(sessionId, listaEtiquetas) {
    try {
        const archivo = rutaEtiquetasSesion(sessionId);

        fs.writeFileSync(
            archivo,
            JSON.stringify(listaEtiquetas, null, 2),
            'utf8'
        );
    } catch (error) {
        console.warn(
            '[CAJ] Error guardando etiquetas:',
            error.message
        );
    }
}

// ============================================================
// EXTRACCION DE MENSAJES
// ============================================================

function extraerTextoMensaje(msg) {
    if (!msg || !msg.message) {
        return {
            texto: '',
            tipo: 'desconocido'
        };
    }

    const m =
        msg.message?.ephemeralMessage?.message ||
        msg.message?.viewOnceMessage?.message ||
        msg.message?.viewOnceMessageV2?.message ||
        msg.message;

    if (
        typeof m.conversation === 'string' &&
        m.conversation.trim()
    ) {
        return {
            texto: m.conversation.trim(),
            tipo: 'texto'
        };
    }

    if (
        typeof m.extendedTextMessage?.text === 'string' &&
        m.extendedTextMessage.text.trim()
    ) {
        return {
            texto: m.extendedTextMessage.text.trim(),
            tipo: 'texto'
        };
    }

    if (
        typeof m.imageMessage?.caption === 'string' &&
        m.imageMessage.caption.trim()
    ) {
        return {
            texto: m.imageMessage.caption.trim(),
            tipo: 'texto'
        };
    }

    if (
        typeof m.documentMessage?.caption === 'string' &&
        m.documentMessage.caption.trim()
    ) {
        return {
            texto: m.documentMessage.caption.trim(),
            tipo: 'texto'
        };
    }

    if (
        m.imageMessage ||
        m.documentMessage ||
        m.audioMessage ||
        m.videoMessage
    ) {
        return {
            texto: '',
            tipo: 'multimedia'
        };
    }

    return {
        texto: '',
        tipo: 'desconocido'
    };
}

// ============================================================
// CONTROL DE CONVERSACIONES Y FIREBASE
// ============================================================

function obtenerOCrearControl(sessionId) {
    if (controles.has(sessionId)) {
        return controles.get(sessionId);
    }

    const repo = crearRepositorioWhatsAppFirebase({
        sessionId,

        obtenerAsesor: async () => {
            const sock = sesiones.get(sessionId);

            const telefono = sock?.user?.id
                ? normalizarTelefono(
                    sock.user.id.split(':')[0]
                )
                : '';

            return obtenerAsesorActivoCAJ(
                sessionId,
                telefono
            );
        }
    });

    const control = crearControlConversaciones({
        repo,

        analizar: analizarMensajeWhatsAppCAJ,

        enviar: async (jid, respuesta, idSalida) => {
            const sock = sesiones.get(sessionId);

            if (
                !sock ||
                estados.get(sessionId)?.estado !== 'conectado'
            ) {
                throw new Error(
                    `Sesion ${sessionId} no conectada`
                );
            }

            registrarIdMensajeBot(idSalida);

            envioBotReciente.set(
                jid,
                Date.now()
            );

            const enviado = await sock.sendMessage(
                jid,
                { text: respuesta }
            );

            const idReal = enviado?.key?.id;

            if (idReal) {
                registrarIdMensajeBot(idReal);
                control.registrarIdPropio(idReal);
            }

            return idReal || idSalida;
        }
    });

    const guardadas = cargarEtiquetasGuardadas(sessionId);

    if (guardadas.length > 0) {
        control.cargarNombres(guardadas);
    }

    controles.set(sessionId, control);

    return control;
}

// ============================================================
// INICIO PROTEGIDO DE SESIONES BAILEYS
// ============================================================

async function iniciarSesion(
    sessionId = 'coordinador_carlos',
    automatico = false
) {
    if (desconexionesPendientes.has(sessionId)) {
        throw new Error(
            `Sesion ${sessionId} en proceso de desvinculacion`
        );
    }

    if (automatico && sesionesDetenidas.has(sessionId)) {
        return null;
    }

    if (!automatico) {
        sesionesDetenidas.delete(sessionId);
        conflictosConsecutivos.delete(sessionId);
    }

    const existente = sesiones.get(sessionId);

    if (existente) {
        return existente;
    }

    const pendiente = iniciosPendientes.get(sessionId);

    if (pendiente) {
        return pendiente;
    }

    cancelarReconexiones(sessionId);

    const generacion = generacionActual(sessionId);

    const inicio = crearSesionBaileys(
        sessionId,
        generacion
    );

    iniciosPendientes.set(
        sessionId,
        inicio
    );

    try {
        return await inicio;
    } finally {
        if (iniciosPendientes.get(sessionId) === inicio) {
            iniciosPendientes.delete(sessionId);
        }
    }
}

async function crearSesionBaileys(sessionId, generacion) {
    const folder = path.join(authDir, sessionId);

    const {
        state,
        saveCreds
    } = await useMultiFileAuthState(folder);

    if (
        sesionesDetenidas.has(sessionId) ||
        generacionActual(sessionId) !== generacion
    ) {
        console.log(
            `[CAJ BAILEYS] Inicio cancelado: ${sessionId}`
        );

        return null;
    }

    const control = obtenerOCrearControl(sessionId);

    estados.set(sessionId, {
        estado: 'iniciando',
        qr: null
    });

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        logger: pino({ level: 'silent' }),
        syncFullHistory: false
    });

    function vigente() {
        return (
            sesiones.get(sessionId) === sock &&
            generacionActual(sessionId) === generacion &&
            !sesionesDetenidas.has(sessionId)
        );
    }

    // ========================================================
    // GUARDADO DE CREDENCIALES
    // ========================================================

    sock.ev.on('creds.update', async () => {
        if (!vigente()) return;

        try {
            await saveCreds();
        } catch (error) {
            console.error(
                '[CAJ BAILEYS] Error guardando credenciales:',
                error.message
            );
        }
    });

    // ========================================================
    // EVENTOS DE CONEXION
    // ========================================================

    sock.ev.on('connection.update', async (update) => {
        const {
            connection,
            lastDisconnect,
            qr
        } = update;

        if (!vigente()) return;

        if (qr) {
            try {
                const qrDataUrl = await qrcode.toDataURL(qr);

                if (vigente()) {
                    estados.set(sessionId, {
                        estado: 'qr_listo',
                        qr: qrDataUrl
                    });
                }
            } catch (error) {
                console.error(
                    '[CAJ BAILEYS] Error generando QR:',
                    error.message
                );
            }
        }

        if (connection === 'close') {
            if (!vigente()) return;

            const codigo =
                lastDisconnect?.error?.output?.statusCode;

            const motivo =
                lastDisconnect?.error?.message ||
                'Motivo desconocido';

            console.error(
                `[CAJ BAILEYS] Conexion cerrada: ${sessionId}`
            );

            console.error(
                '[CAJ BAILEYS] Codigo:',
                codigo
            );

            console.error(
                '[CAJ BAILEYS] Motivo:',
                motivo
            );

            control.conectar(false);

            sesiones.delete(sessionId);

            incrementarGeneracion(sessionId);

            if (codigo === DisconnectReason.loggedOut) {
                sesionesDetenidas.add(sessionId);

                cancelarReconexiones(sessionId);

                estados.set(sessionId, {
                    estado: 'desconectado',
                    qr: null
                });

                return;
            }

            const conflictos = codigo === 440
                ? (conflictosConsecutivos.get(sessionId) || 0) + 1
                : 0;

            conflictosConsecutivos.set(
                sessionId,
                conflictos
            );

            if (conflictos >= MAX_CONFLICTOS) {
                sesionesDetenidas.add(sessionId);

                cancelarReconexiones(sessionId);

                estados.set(sessionId, {
                    estado: 'conflicto',
                    qr: null
                });

                console.error(
                    `[CAJ BAILEYS] Sesion ${sessionId} suspendida tras ${conflictos} conflictos 440`
                );

                return;
            }

            estados.set(sessionId, {
                estado: 'reconectando',
                qr: null
            });

            cancelarReconexiones(sessionId);

            const generacionReconexion =
                generacionActual(sessionId);

            const demora = codigo === 440
                ? DEMORA_CONFLICTO * conflictos
                : DEMORA_NORMAL;

            const temporizador = setTimeout(() => {
                if (
                    reconexionesPendientes.get(sessionId) !==
                    temporizador
                ) {
                    return;
                }

                reconexionesPendientes.delete(sessionId);

                if (
                    sesionesDetenidas.has(sessionId) ||
                    sesiones.has(sessionId) ||
                    generacionActual(sessionId) !==
                        generacionReconexion
                ) {
                    return;
                }

                iniciarSesion(sessionId, true).catch(error => {
                    console.error(
                        `[CAJ BAILEYS] Error reconectando ${sessionId}:`,
                        error.message
                    );
                });
            }, demora);

            reconexionesPendientes.set(
                sessionId,
                temporizador
            );
        }

        if (connection === 'open') {
            if (!vigente()) return;

            control.conectar(true);

            estados.set(sessionId, {
                estado: 'conectado',
                qr: null
            });

            console.log(
                `WhatsApp conectado exitosamente para sesion: ${sessionId}`
            );

            setTimeout(() => {
                if (vigente()) {
                    conflictosConsecutivos.delete(sessionId);
                }
            }, 60000);
        }
    });

    // ========================================================
    // DEFINICIONES DE ETIQUETAS WHATSAPP BUSINESS
    // ========================================================

    sock.ev.on('labels.edit', (payload) => {
        if (!vigente()) return;

        const lista = Array.isArray(payload)
            ? payload
            : [payload];

        for (const item of lista) {
            if (item && item.id !== undefined) {
                control.editarEtiqueta(item);

                console.log(
                    `[CAJ ETIQUETA] ${item.id}: ${item.name}`
                );
            }
        }

        guardarEtiquetasSesion(
            sessionId,
            control.obtenerEtiquetas()
        );
    });

    // ========================================================
    // ASOCIACION DE ETIQUETAS A CLIENTES
    // ========================================================

    sock.ev.on('labels.association', async (payload) => {
        if (!vigente()) return;

        const eventos = Array.isArray(payload)
            ? payload
            : [payload];

        for (const evento of eventos) {
            if (!vigente()) return;

            const association = evento?.association;

            if (
                !association ||
                association.type !== 'label_jid'
            ) {
                continue;
            }

            const chatId = association.chatId;
            const labelId = String(association.labelId);
            const tipoAccion = evento.type;

            const conocidas = control.obtenerEtiquetas();

            if (
                tipoAccion === 'add' &&
                !conocidas.some(
                    etiqueta => String(etiqueta.id) === labelId
                )
            ) {
                control.editarEtiqueta({
                    id: labelId,
                    name: ETIQUETAS_CAJ.RECEPCION_IA
                });

                guardarEtiquetasSesion(
                    sessionId,
                    control.obtenerEtiquetas()
                );
            }

            await control.asociarEtiqueta({
                type: tipoAccion,
                association
            });

            if (!vigente()) return;

            console.log(
                `[CAJ ETIQUETA] Chat: ${chatId} | IA: ${control.permitido(chatId)}`
            );

            if (
                tipoAccion === 'add' &&
                control.permitido(chatId)
            ) {
                const pendiente =
                    ultimosMensajesCliente.get(chatId);

                if (pendiente) {
                    ultimosMensajesCliente.delete(chatId);

                    await control.recibir(pendiente).catch(
                        error => console.error(
                            '[CAJ] Error procesando mensaje pendiente:',
                            error.message
                        )
                    );
                } else {
                    await control.recibir({
                        jid: chatId,
                        id: `init_${labelId}_${Date.now()}`,
                        delAsesor: false,
                        texto: '[INICIO_ATENCION_CAJ]',
                        tipo: 'texto'
                    }).catch(
                        error => console.error(
                            '[CAJ] Error iniciando recepcion:',
                            error.message
                        )
                    );
                }
            }
        }
    });

    // ========================================================
    // RECEPCION DE MENSAJES DE CLIENTES Y ASESORES
    // ========================================================

    sock.ev.on('messages.upsert', async (evento) => {
        if (!vigente()) return;

        const mensajes = Array.isArray(evento?.messages)
            ? evento.messages
            : [];

        for (const msg of mensajes) {
            if (!vigente()) return;

            if (!msg || !msg.message || !msg.key) {
                continue;
            }

            const senderJid = msg.key.remoteJid || '';

            if (
                !senderJid ||
                senderJid === 'status@broadcast' ||
                senderJid.includes('@g.us')
            ) {
                continue;
            }

            const msgId =
                msg.key.id ||
                crypto.randomUUID();

            const fromMe = Boolean(msg.key.fromMe);

            let {
                texto: textoEntrante,
                tipo
            } = extraerTextoMensaje(msg);

            // ====================================================
            // TRANSCRIPCION DE AUDIOS DE CLIENTES CAJ
            // ====================================================

            const contenidoMensaje =
                msg.message?.ephemeralMessage?.message ||
                msg.message?.viewOnceMessage?.message ||
                msg.message?.viewOnceMessageV2?.message ||
                msg.message;

            const esAudio =
                Boolean(contenidoMensaje?.audioMessage);

            if (esAudio && !fromMe && control.permitido(senderJid)) {
                try {
                    console.log(
                        `[CAJ AUDIO] Audio recibido de cliente: ${senderJid}`
                    );

                    const audioBuffer = await downloadMediaMessage(
                        msg,
                        'buffer',
                        {},
                        {
                            logger: pino({ level: 'silent' }),
                            reuploadRequest: sock.updateMediaMessage.bind(sock)
                        }
                    );

                    if (!vigente()) return;

                    if (audioBuffer.length > 15 * 1024 * 1024) {
                        throw new Error(
                            'Audio superior al limite permitido de 15 MB'
                        );
                    }

                    const mime =
                        contenidoMensaje.audioMessage.mimetype || '';

                    let formato = 'ogg';

                    if (mime.includes('mpeg')) {
                        formato = 'mp3';
                    } else if (mime.includes('mp4')) {
                        formato = 'm4a';
                    } else if (mime.includes('wav')) {
                        formato = 'wav';
                    } else if (mime.includes('webm')) {
                        formato = 'webm';
                    }

                    const transcripcion = await transcribirAudioCAJ(
                        audioBuffer,
                        formato
                    );

                    if (!vigente()) return;

                    textoEntrante =
                        `[TRANSCRIPCION DE AUDIO WHATSAPP]\n${transcripcion}`;

                    tipo = 'texto';

                    console.log(
                        `[CAJ AUDIO] Transcripcion completada para ${senderJid}`
                    );

                } catch (error) {
                    console.error(
                        `[CAJ AUDIO] Error procesando audio de ${senderJid}:`,
                        error.response?.data?.error?.message ||
                        error.message
                    );

                    // Se mantiene como multimedia sin transcribir.
                    // El controlador la marcara pendiente de revision.
                    textoEntrante = '';
                    tipo = 'multimedia';
                }
            }

            const timestampBot =
                envioBotReciente.get(senderJid) || 0;

            const tieneEncabezadoBot =
                textoEntrante.startsWith('🏛️ *') ||
                textoEntrante.startsWith(
                    '🤖 Sistema AlucineLex'
                );

            const esMensajeDelBot =
                idsEnviadosPorBot.has(msgId) ||
                (fromMe && tieneEncabezadoBot) ||
                (
                    fromMe &&
                    Date.now() - timestampBot < 2500 &&
                    tieneEncabezadoBot
                );

            if (esMensajeDelBot) {
                control.registrarIdPropio(msgId);
                continue;
            }

            const delAsesor = fromMe;

            const numeroRemitente =
                normalizarTelefono(senderJid);

            console.log(
                `[CAJ WHATSAPP] Mensaje recibido de ${delAsesor ? 'ASESOR' : 'CLIENTE'}: ${numeroRemitente}`
            );

            const mensajeNormalizado = {
                jid: senderJid,
                id: msgId,
                delAsesor,
                texto: textoEntrante,
                tipo
            };

            if (!delAsesor && textoEntrante) {
                ultimosMensajesCliente.set(
                    senderJid,
                    mensajeNormalizado
                );
            }

            try {
                const resultado = await control.recibir(
                    mensajeNormalizado
                );

                if (resultado?.respondido) {
                    ultimosMensajesCliente.delete(senderJid);

                    console.log(
                        `[CAJ IA] Respuesta enviada a ${numeroRemitente}`
                    );
                } else if (resultado?.silencioso) {
                    console.log(
                        `[CAJ IA] Analisis silencioso para ${numeroRemitente}`
                    );
                } else if (resultado?.ignorado) {
                    console.log(
                        `[CAJ IA] Chat pendiente de etiqueta: ${numeroRemitente}`
                    );
                }
            } catch (error) {
                console.error(
                    `[CAJ IA] Error procesando mensaje ${numeroRemitente}:`,
                    error.message
                );
            }
        }
    });

    // ========================================================
    // REGISTRO DE LA SESION
    // ========================================================

    if (
        sesionesDetenidas.has(sessionId) ||
        generacionActual(sessionId) !== generacion
    ) {
        try {
            sock.ws?.close();
        } catch (error) {
            console.warn(
                '[CAJ BAILEYS] Error cerrando socket cancelado:',
                error.message
            );
        }

        return null;
    }

    sesiones.set(sessionId, sock);

    return sock;
}

// ============================================================
// CONSULTAR ESTADO DE SESION
// ============================================================

function obtenerEstadoSesion(
    sessionId = 'coordinador_carlos'
) {
    return estados.get(sessionId) || {
        estado: 'no_iniciado',
        qr: null
    };
}

// ============================================================
// DESVINCULACION VOLUNTARIA
// ============================================================

async function desconectarSesion(
    sessionId = 'coordinador_carlos'
) {
    const desconexionExistente =
        desconexionesPendientes.get(sessionId);

    if (desconexionExistente) {
        return desconexionExistente;
    }

    sesionesDetenidas.add(sessionId);
    incrementarGeneracion(sessionId);
    cancelarReconexiones(sessionId);

    const sock = sesiones.get(sessionId);
    sesiones.delete(sessionId);

    const control = controles.get(sessionId);

    if (control) {
        control.conectar(false);
    }

    estados.set(sessionId, {
        estado: 'desconectado',
        qr: null
    });

    if (!sock) {
        return false;
    }

    const operacion = (async () => {
        await sock.logout();

        const folder = path.join(authDir, sessionId);

        if (fs.existsSync(folder)) {
            fs.rmSync(folder, {
                recursive: true,
                force: true
            });
        }

        conflictosConsecutivos.delete(sessionId);

        console.log(
            `[CAJ BAILEYS] Sesion desvinculada voluntariamente: ${sessionId}`
        );

        return true;
    })();

    desconexionesPendientes.set(
        sessionId,
        operacion
    );

    try {
        return await operacion;
    } finally {
        if (
            desconexionesPendientes.get(sessionId) ===
            operacion
        ) {
            desconexionesPendientes.delete(sessionId);
        }
    }
}

// ============================================================
// ENVIO MANUAL DE MENSAJES DESDE EL DASHBOARD
// ============================================================

async function enviarMensaje(
    sessionId = 'coordinador_carlos',
    numero,
    texto
) {
    const sock = sesiones.get(sessionId);

    if (
        !sock ||
        estados.get(sessionId)?.estado !== 'conectado'
    ) {
        throw new Error(
            'Sesion de WhatsApp no conectada'
        );
    }

    const jid = formatearJid(numero);

    if (!jid) {
        throw new Error(
            'Numero de WhatsApp invalido'
        );
    }

    const enviado = await sock.sendMessage(
        jid,
        { text: texto }
    );

    const control = obtenerOCrearControl(sessionId);

    if (control && control.permitido(jid)) {
        await control.recibir({
            jid,
            id: enviado?.key?.id ||
                `asesor_web_${Date.now()}`,
            delAsesor: true,
            texto,
            tipo: 'texto'
        }).catch(error => {
            console.error(
                '[CAJ] Error registrando mensaje manual:',
                error.message
            );
        });
    }

    return enviado;
}

// ============================================================
// ACTIVACION Y REACTIVACION DE IA POR CLIENTE
// ============================================================

async function activarIAEnChat(
    sessionId = 'coordinador_carlos',
    numero,
    activar = true,
    dispararSaludo = false
) {
    const control = obtenerOCrearControl(sessionId);

    const jid = formatearJid(numero);

    if (!jid) {
        throw new Error(
            'Numero de telefono no valido'
        );
    }

    await control.asignarEnLista(
        jid,
        activar
    );

    if (
        activar &&
        dispararSaludo &&
        control.permitido(jid)
    ) {
        const pendiente =
            ultimosMensajesCliente.get(jid);

        if (pendiente) {
            ultimosMensajesCliente.delete(jid);

            await control.recibir(pendiente);
        } else {
            await control.recibir({
                jid,
                id: `lista_caj_${Date.now()}`,
                delAsesor: false,
                texto: '[INICIO_ATENCION_CAJ]',
                tipo: 'texto'
            });
        }
    }

    return control.estadoChat(jid);
}

// ============================================================
// EXPORTACIONES UTILIZADAS POR SERVER.JS
// ============================================================

module.exports = {
    iniciarSesion,
    obtenerEstadoSesion,
    desconectarSesion,
    enviarMensaje,
    activarIAEnChat,
    obtenerOCrearControl
};
