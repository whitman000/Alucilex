const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode');
const pino = require('pino');
const fs = require('fs');
const path = require('path');

const sesiones = new Map();
const estados = new Map();
const authDir = path.join(__dirname, 'auth_caj');

if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
}

async function iniciarSesion(sessionId) {
    const folder = path.join(authDir, sessionId);
    const { state, saveCreds } = await useMultiFileAuthState(folder);

    estados.set(sessionId, { estado: 'iniciando', qr: null });

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        logger: pino({ level: 'silent' })
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            try {
                // Generamos el QR en Base64 para mandarlo al modal de caj_dashboard.html
                const qrDataUrl = await qrcode.toDataURL(qr);
                estados.set(sessionId, { estado: 'qr_listo', qr: qrDataUrl });
            } catch (error) {
                console.error(`Error generando QR para ${sessionId}:`, error);
            }
        }

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut);
            
            if (shouldReconnect) {
                estados.set(sessionId, { estado: 'reconectando', qr: null });
                iniciarSesion(sessionId); // Reconexión automática
            } else {
                estados.set(sessionId, { estado: 'desconectado', qr: null });
                sesiones.delete(sessionId);
                if (fs.existsSync(folder)) {
                    fs.rmSync(folder, { recursive: true, force: true });
                }
            }
        } else if (connection === 'open') {
            estados.set(sessionId, { estado: 'conectado', qr: null });
            console.log(`WhatsApp conectado exitosamente para sesión: ${sessionId}`);
        }
    });

    // === NUEVO BLOQUE: OÍDO DEL SISTEMA (RECEPCIÓN DE MENSAJES) ===
    // === NUEVO BLOQUE: OÍDO DEL SISTEMA (RECEPCIÓN DE MENSAJES MEJORADO) ===
    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        
        // Ignorar si el mensaje lo enviamos nosotros mismos o si no trae contenido
        if (!msg.message || msg.key.fromMe) return;

        const senderJid = msg.key.remoteJid;
        
        // Ignorar mensajes de grupos, la IA solo responde en chats privados
        if (senderJid.includes('@g.us')) return;

        const numeroRemitente = senderJid.split('@')[0];
        
        // Extracción a prueba de fallos (cubre normales, respuestas y temporales)
        const msgContent = msg.message?.ephemeralMessage?.message || msg.message;
        const textoEntrante = msgContent?.conversation || msgContent?.extendedTextMessage?.text || '';

        // Imprimir en consola el esqueleto del mensaje para diagnóstico
        console.log(`\n[CAJ DEBUG] Mensaje detectado de ${numeroRemitente}. Estructura:`, Object.keys(msg.message));

        if (!textoEntrante) {
            console.log(`[CAJ DEBUG] El mensaje fue ignorado porque no contenía texto legible (imagen, audio, etc).`);
            return;
        }

        console.log(`[CAJ RECEPCIÓN] Texto limpio extraído: "${textoEntrante}"`);

        // Respondemos con un eco para comprobar que el oído funciona perfectamente:
        try {
            await sock.sendMessage(senderJid, { text: `🤖 Sistema AlucineLex: Acabo de leer tu mensaje ("${textoEntrante}"). Soy el motor escuchando. En la próxima fase validaré si estás en la lista CAJ para activar la Inteligencia Artificial.` });
        } catch (error) {
            console.error('Error respondiendo al mensaje:', error);
        }
    });
    
    // ==============================================================

    sesiones.set(sessionId, sock);
    return sock;
}

function obtenerEstadoSesion(sessionId) {
    return estados.get(sessionId) || { estado: 'no_iniciado', qr: null };
}

async function desconectarSesion(sessionId) {
    const sock = sesiones.get(sessionId);
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

async function enviarMensaje(sessionId, numero, texto) {
    const sock = sesiones.get(sessionId);
    if (!sock) {
        throw new Error('Sesión no conectada');
    }
    
    let numFormateado = numero.toString().replace(/[^0-9]/g, '');
    if (numFormateado.length === 9) {
        numFormateado = '56' + numFormateado;
    }
    const jid = `${numFormateado}@s.whatsapp.net`;
    await sock.sendMessage(jid, { text: texto });
}

module.exports = {
    iniciarSesion,
    obtenerEstadoSesion,
    desconectarSesion,
    enviarMensaje
};