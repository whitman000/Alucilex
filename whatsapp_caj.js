const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode');
const pino = require('pino');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const { crearControlConversaciones, ETIQUETAS_CAJ } = require('./control_conversaciones_caj');
const { crearRepositorioWhatsAppFirebase, obtenerAsesorActivoCAJ, normalizarTelefono } = require('./firebase_caj');
const { analizarMensajeWhatsAppCAJ } = require('./motor_caj');

const sesiones = new Map();
const estados = new Map();
const controles = new Map();
const idsEnviadosPorBot = new Set();
const envioBotReciente = new Map();
const ultimosMensajesCliente = new Map();

const authDir = path.join(__dirname, 'auth_caj');

if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
}

function rutaEtiquetasSesion(sessionId) {
    return path.join(authDir, `etiquetas_${sessionId}.json`);
}

function cargarEtiquetasGuardadas(sessionId) {
    try {
        const archivo = rutaEtiquetasSesion(sessionId);
        if (fs.existsSync(archivo)) {
            return JSON.parse(fs.readFileSync(archivo, 'utf8'));
        }
    } catch (e) {
        console.warn(`⚠️ No se pudieron leer etiquetas locales de ${sessionId}:`, e.message);
    }
    return [];
}

function guardarEtiquetasSesion(sessionId, listaEtiquetas) {
    try {
        const archivo = rutaEtiquetasSesion(sessionId);
        fs.writeFileSync(archivo, JSON.stringify(listaEtiquetas, null, 2), 'utf8');
    } catch (e) {
        console.warn(`⚠️ No se pudieron guardar etiquetas locales de ${sessionId}:`, e.message);
    }
}

function registrarIdMensajeBot(id) {
    if (!id) return;
    idsEnviadosPorBot.add(String(id));
    if (idsEnviadosPorBot.size > 3000) {
        idsEnviadosPorBot.delete(idsEnviadosPorBot.values().next().value);
    }
}

function formatearJid(numeroOJid) {
    const str = String(numeroOJid || '').trim();
    if (str.endsWith('@s.whatsapp.net')) return str;
    const limpio = normalizarTelefono(str);
    return limpio ? `${limpio}@s.whatsapp.net` : '';
}

function extraerTextoMensaje(msg) {
    if (!msg || !msg.message) return { texto: '', tipo: 'desconocido' };
    const m = msg.message?.ephemeralMessage?.message
        || msg.message?.viewOnceMessage?.message
        || msg.message?.viewOnceMessageV2?.message
        || msg.message;

    if (typeof m.conversation === 'string' && m.conversation.trim()) {
        return { texto: m.conversation.trim(), tipo: 'texto' };
    }
    if (typeof m.extendedTextMessage?.text === 'string' && m.extendedTextMessage.text.trim()) {
        return { texto: m.extendedTextMessage.text.trim(), tipo: 'texto' };
    }
    if (typeof m.imageMessage?.caption === 'string' && m.imageMessage.caption.trim()) {
        return { texto: m.imageMessage.caption.trim(), tipo: 'texto' };
    }
    if (typeof m.documentMessage?.caption === 'string' && m.documentMessage.caption.trim()) {
        return { texto: m.documentMessage.caption.trim(), tipo: 'texto' };
    }
    if (m.imageMessage || m.documentMessage || m.audioMessage || m.videoMessage) {
        return { texto: '', tipo: 'multimedia' };
    }
    return { texto: '', tipo: 'desconocido' };
}

function obtenerOCrearControl(sessionId) {
    if (controles.has(sessionId)) return controles.get(sessionId);

    const repo = crearRepositorioWhatsAppFirebase({
        sessionId,
        obtenerAsesor: async () => {
            const sock = sesiones.get(sessionId);
            const fonoSesion = sock?.user?.id ? normalizarTelefono(sock.user.id.split(':')[0]) : '';
            return obtenerAsesorActivoCAJ(sessionId, fonoSesion);
        }
    });

    const control = crearControlConversaciones({
        repo,
        analizar: analizarMensajeWhatsAppCAJ,
        enviar: async (jid, respuesta, idSalida) => {
            const sock = sesiones.get(sessionId);
            if (!sock) throw new Error(`Sesión de WhatsApp '${sessionId}' no conectada`);

            registrarIdMensajeBot(idSalida);
            envioBotReciente.set(jid, Date.now());

            const enviado = await sock.sendMessage(jid, { text: respuesta });
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

async function iniciarSesion(sessionId = 'coordinador_carlos') {
    const folder = path.join(authDir, sessionId);
    const { state, saveCreds } = await useMultiFileAuthState(folder);
    const control = obtenerOCrearControl(sessionId);

    estados.set(sessionId, { estado: 'iniciando', qr: null });

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        logger: pino({ level: 'silent' }),
        syncFullHistory: false
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            try {
                const qrDataUrl = await qrcode.toDataURL(qr);
                estados.set(sessionId, { estado: 'qr_listo', qr: qrDataUrl });
            } catch (error) {
                console.error(`Error generando QR para ${sessionId}:`, error);
            }
        }

         if (connection === 'close') {
            const codigoDesconexion = lastDisconnect?.error?.output?.statusCode;
            const motivoDesconexion = lastDisconnect?.error?.message || 'Motivo no informado';

            console.error('[CAJ BAILEYS] CONEXION CERRADA');
            console.error('[CAJ BAILEYS] Sesion:', sessionId);
            console.error('[CAJ BAILEYS] Codigo:', codigoDesconexion);
            console.error('[CAJ BAILEYS] Motivo:', motivoDesconexion);

            control.conectar(false);
            const shouldReconnect = (codigoDesconexion !== DisconnectReason.loggedOut);

            if (shouldReconnect) {
                estados.set(sessionId, { estado: 'reconectando', qr: null });
                iniciarSesion(sessionId);
            } else {
                estados.set(sessionId, { estado: 'desconectado', qr: null });
                sesiones.delete(sessionId);
                if (fs.existsSync(folder)) {
                    fs.rmSync(folder, { recursive: true, force: true });
                }
            }
        } else if (connection === 'open') {
            control.conectar(true);
            estados.set(sessionId, { estado: 'conectado', qr: null });
            console.log(`✅ WhatsApp conectado exitosamente para sesión: ${sessionId}`);
        }
    });

    // === 1. SINCRONIZACIÓN DE DEFINICIONES DE ETIQUETAS (WhatsApp Business) ===
    sock.ev.on('labels.edit', (payload) => {
        const lista = Array.isArray(payload) ? payload : [payload];
        for (const item of lista) {
            if (item && item.id !== undefined) {
                console.log(`🏷️ [CAJ ETIQUETA DEFINIDA] ID: ${item.id} -> "${item.name}" (eliminada: ${Boolean(item.deleted)})`);
                control.editarEtiqueta(item);
            }
        }
        guardarEtiquetasSesion(sessionId, control.obtenerEtiquetas());
    });

    // === 2. ASOCIACIÓN DE ETIQUETAS EN EL TELÉFONO DEL ASESOR ===
    // En el momento en que el asesor etiqueta el chat en su teléfono, la IA toma el control.
    sock.ev.on('labels.association', async (payload) => {
        const eventos = Array.isArray(payload) ? payload : [payload];
        for (const ev of eventos) {
            const assoc = ev?.association;
            const tipoAccion = ev?.type;
            if (!assoc || assoc.type !== 'label_jid') continue;

            const chatId = assoc.chatId;
            const labelId = String(assoc.labelId);

            // Si WhatsApp Business no envió previamente labels.edit para este ID en esta sesión,
            // lo registramos por defecto como etiqueta habilitada CAJ al momento de agregarla.
            const conocidas = control.obtenerEtiquetas();
            if (tipoAccion === 'add' && !conocidas.some(e => String(e.id) === labelId)) {
                control.editarEtiqueta({ id: labelId, name: ETIQUETAS_CAJ.RECEPCION_IA });
                guardarEtiquetasSesion(sessionId, control.obtenerEtiquetas());
            }

            await control.asociarEtiqueta({ type: tipoAccion, association: assoc });
            console.log(`🏷️ [CAJ ETIQUETA EN CHAT] Acción: ${tipoAccion} | Chat: ${chatId} | Etiqueta: ${labelId} | IA Permitida: ${control.permitido(chatId)}`);

            // Si el asesor acaba de etiquetar el chat y la IA quedó habilitada, toma el control de inmediato:
            if (tipoAccion === 'add' && control.permitido(chatId)) {
                const pendiente = ultimosMensajesCliente.get(chatId);
                if (pendiente) {
                    ultimosMensajesCliente.delete(chatId);
                    await control.recibir(pendiente).catch(err => console.error('Error al procesar mensaje pendiente tras etiquetar:', err.message));
                } else {
                    await control.recibir({
                        jid: chatId,
                        id: `init_${labelId}_${Date.now()}`,
                        delAsesor: false,
                        texto: '[INICIO_ATENCION_CAJ]',
                        tipo: 'texto'
                    }).catch(err => console.error('Error al iniciar recepción IA tras etiquetar:', err.message));
                }
            }
        }
    });

    // === 3. OÍDO DEL SISTEMA: RECEPCIÓN DE MENSAJES (CLIENTE + RELEVO DEL ASESOR) ===
    sock.ev.on('messages.upsert', async (m) => {
        const listaMensajes = Array.isArray(m?.messages) ? m.messages : [];

        for (const msg of listaMensajes) {
            if (!msg || !msg.message || !msg.key) continue;

            const senderJid = msg.key.remoteJid || '';
            // Ignorar estados y grupos; la atención CAJ opera solo en chats individuales
            if (!senderJid || senderJid === 'status@broadcast' || senderJid.includes('@g.us')) continue;

            const msgId = msg.key.id || crypto.randomUUID();
            const fromMe = Boolean(msg.key.fromMe);
            const { texto: textoEntrante, tipo } = extraerTextoMensaje(msg);

            // Distinguir si un mensaje con fromMe=true fue emitido automáticamente por nuestro bot IA
            // o si fue escrito manualmente por el asesor jurídico desde su teléfono.
            const timestampBot = envioBotReciente.get(senderJid) || 0;
            const tieneEncabezadoBot = textoEntrante.startsWith('🏛️ *') || textoEntrante.startsWith('🤖 Sistema AlucineLex');
            const esMensajeDelBot = idsEnviadosPorBot.has(msgId)
                || (fromMe && tieneEncabezadoBot)
                || (fromMe && (Date.now() - timestampBot < 2500) && tieneEncabezadoBot);

            if (esMensajeDelBot) {
                control.registrarIdPropio(msgId);
                continue;
            }

            const delAsesor = fromMe;
            const numeroRemitente = normalizarTelefono(senderJid);

            console.log(`\n📩 [CAJ WHATSAPP] Mensaje de ${delAsesor ? 'ASESOR' : 'CLIENTE'} (${numeroRemitente}): "${textoEntrante.slice(0, 120)}"`);

            const mensajeNormalizado = {
                jid: senderJid,
                id: msgId,
                delAsesor,
                texto: textoEntrante,
                tipo
            };

            // Si escribe el cliente antes de que el asesor etiquete el chat, guardamos su último mensaje
            // para que en el instante en que el asesor le ponga la etiqueta en el teléfono, la IA le responda.
            if (!delAsesor && textoEntrante) {
                ultimosMensajesCliente.set(senderJid, mensajeNormalizado);
            }

            try {
                const resultado = await control.recibir(mensajeNormalizado);
                if (resultado?.respondido) {
                    ultimosMensajesCliente.delete(senderJid);
                    console.log(`🤖 [CAJ IA] Respuesta enviada a ${numeroRemitente}`);
                } else if (resultado?.silencioso) {
                    console.log(`🕵️ [CAJ IA SILENCIOSA] Información procesada y guardada en Firebase para ${numeroRemitente} (control en manos del asesor).`);
                } else if (resultado?.ignorado) {
                    console.log(`⏸️ [CAJ EN ESPERA] Chat ${numeroRemitente} aún no está etiquetado en la lista CAJ del asesor.`);
                }
            } catch (error) {
                console.error(`❌ Error procesando mensaje de ${numeroRemitente}:`, error.message);
            }
        }
    });

    sesiones.set(sessionId, sock);
    return sock;
}

function obtenerEstadoSesion(sessionId = 'coordinador_carlos') {
    return estados.get(sessionId) || { estado: 'no_iniciado', qr: null };
}

async function desconectarSesion(sessionId = 'coordinador_carlos') {
    const sock = sesiones.get(sessionId);
    const control = controles.get(sessionId);
    if (control) control.conectar(false);

    if (sock) {
        await sock.logout();
        sesiones.delete(sessionId);
        estados.set(sessionId, { estado: 'desconectado', qr: null });
        const folder = path.join(authDir, sessionId);
        if (fs.existsSync(folder)) {
            fs.rmSync(folder, { recursive: true, force: true });
        }
        return true;
    }
    return false;
}

/**
 * Envío manual desde el Dashboard CAJ (actúa como intervención del asesor jurídico,
 * pausando respuestas automáticas de la IA y registrando el mensaje en Firebase).
 */
async function enviarMensaje(sessionId = 'coordinador_carlos', numero, texto) {
    const sock = sesiones.get(sessionId);
    if (!sock) {
        throw new Error('Sesión no conectada');
    }

    const jid = formatearJid(numero);
    if (!jid) throw new Error('Número de WhatsApp inválido');

    const enviado = await sock.sendMessage(jid, { text: texto });
    const control = obtenerOCrearControl(sessionId);
    if (control && control.permitido(jid)) {
        await control.recibir({
            jid,
            id: enviado?.key?.id || `asesor_web_${Date.now()}`,
            delAsesor: true,
            texto,
            tipo: 'texto'
        }).catch(() => {});
    }
    return enviado;
}

/**
 * Permite al asesor incluir o reactivar un número en la lista de atención IA
 * (tanto desde el Dashboard como por etiqueta)
 */
async function activarIAEnChat(sessionId = 'coordinador_carlos', numero, activar = true, dispararSaludo = false) {
    const control = obtenerOCrearControl(sessionId);
    const jid = formatearJid(numero);
    if (!jid) throw new Error('Número de teléfono no válido');

    await control.asignarEnLista(jid, activar);
    if (activar && dispararSaludo && control.permitido(jid)) {
        const pendiente = ultimosMensajesCliente.get(jid);
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

module.exports = {
    iniciarSesion,
    obtenerEstadoSesion,
    desconectarSesion,
    enviarMensaje,
    activarIAEnChat,
    obtenerOCrearControl
};