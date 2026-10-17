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
    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        
        // Ignorar si el mensaje lo enviamos nosotros mismos o si no trae texto
        if (!msg.message || msg.key.fromMe) return;

        const senderJid = msg.key.remoteJid;
        
        // Ignorar mensajes de grupos, la IA solo responde en chats privados
        if (senderJid.includes('@g.us')) return;

        const numeroRemitente = senderJid.split('@')[0];
        const textoEntrante = msg.message.conversation || msg.message.extendedTextMessage?.text || '';

        if (!textoEntrante) return;

        console.log(`[CAJ RECEPCIÓN] Mensaje recibido de ${numeroRemitente}: ${textoEntrante}`);

        // TODO: Fase 2 - Conectar aquí con Firebase para verificar si el número está en la lista de "usuarios CAJ".
        // Si está en la lista, pasar el texto a la IA. Si no está, ignorar.

        // Por ahora, respondemos con un eco para comprobar que el oído funciona perfectamente:
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