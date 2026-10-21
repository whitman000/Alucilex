'use strict';
const crypto = require('crypto');
const { db } = require('./firebase_caj');
const COLECCION = 'control_sesiones_whatsapp_caj';
const DURACION_MS = 90000;
const instanciaId = crypto.randomUUID();
const tokens = new Map();
function validarSesion(id) {
    if (typeof id !== 'string' || !/^[a-zA-Z0-9_-]{1,128}$/.test(id)) {
        throw new Error('Identificador de sesion invalido');
    }
    return id;
}
function referencia(id) {
    if (!db) throw new Error('Firestore no disponible');
    return db.collection(COLECCION).doc(validarSesion(id));
}
function tiempoServidor(snapshot) {
    const tiempo = snapshot.readTime;
    if (!tiempo || typeof tiempo.toMillis !== 'function') {
        throw new Error('No se pudo confirmar la hora de Firestore');
    }
    return tiempo.toMillis();
}
async function adquirir(id) {
    const ref = referencia(id);
    if (tokens.has(id)) return renovar(id);
    const token = crypto.randomUUID();
    const adquirido = await db.runTransaction(async tx => {
        const snap = await tx.get(ref);
        const ahora = tiempoServidor(snap);
        const actual = snap.exists ? snap.data() : null;
        if (actual && Number(actual.venceEn) > ahora) return false;
        tx.set(ref, { instanciaId, token, actualizadoEn: ahora, venceEn: ahora + DURACION_MS });
        return true;
    });
    if (adquirido) tokens.set(id, token);
    return adquirido;
}
async function renovar(id) {
    const ref = referencia(id), token = tokens.get(id);
    if (!token) return false;
    const ok = await db.runTransaction(async tx => {
        const snap = await tx.get(ref);
        if (!snap.exists) return false;
        const actual = snap.data(), ahora = tiempoServidor(snap);
        if (actual.instanciaId !== instanciaId || actual.token !== token || Number(actual.venceEn) <= ahora) return false;
        tx.update(ref, { actualizadoEn: ahora, venceEn: ahora + DURACION_MS });
        return true;
    });
    if (!ok) tokens.delete(id);
    return ok;
}
async function liberar(id) {
    const ref = referencia(id), token = tokens.get(id);
    tokens.delete(id);
    if (!token) return false;
    return db.runTransaction(async tx => {
        const snap = await tx.get(ref);
        if (!snap.exists) return false;
        const actual = snap.data();
        if (actual.instanciaId !== instanciaId || actual.token !== token) return false;
        tx.delete(ref);
        return true;
    });
}
function tieneControl(id) { return tokens.has(id); }
function obtenerToken(id) { return tokens.get(id) || null; }
function obtenerInstanciaId() { return instanciaId; }
module.exports = { adquirir, renovar, liberar, obtenerInstanciaId, tieneControl, obtenerToken };
