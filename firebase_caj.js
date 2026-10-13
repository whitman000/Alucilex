// firebase_caj.js - Conexión Modular a Firebase Firestore para CAJ
require('dotenv').config();
const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const path = require('path');
const fs = require('fs');

let credencialFirebase = null;

// 1. Prioridad: Secret File de Render en la nube
if (fs.existsSync('/etc/secrets/serviceAccountKey.json')) {
    console.log("🔑 Usando Secret File de Render (/etc/secrets/serviceAccountKey.json)");
    credencialFirebase = require('/etc/secrets/serviceAccountKey.json');
} 
// 2. Archivo local de desarrollo en tu computador
else {
    const localPath = path.resolve(__dirname, 'serviceAccountKey.json');
    if (fs.existsSync(localPath)) {
        console.log("🔑 Usando archivo local serviceAccountKey.json");
        credencialFirebase = require(localPath);
    }
}

if (getApps().length === 0) {
    initializeApp({
        credential: cert(credencialFirebase)
    });
    console.log("🔥 Firebase inicializado con éxito");
}

const db = getFirestore();
const coleccionCasos = db.collection('casos_caj');
const coleccionPostulantes = db.collection('postulantes_caj');

// ==========================================
// GESTIÓN DE CASOS Y EXPEDIENTES
// ==========================================

async function guardarCaso(datos) {
    try {
        const nombreFinal = datos.usuario_nombre || datos.nombre || (datos.usuario && datos.usuario.nombre) || 'Usuario WhatsApp';
        const contraparteFinal = datos.contraparte_nombre || datos.contraparte || (datos.contraparte && datos.contraparte.nombre) || 'Por determinar';
        const materiaFinal = datos.materia || (datos.datos_causa && datos.datos_causa.materia) || 'Laboral';
        const tribunalFinal = datos.tribunal || (datos.datos_causa && datos.datos_causa.tribunal) || 'Por determinar';
        const relatoFinal = datos.relato_hechos || (Array.isArray(datos.hechos) ? datos.hechos.join('. ') : datos.hechos) || '';

        const registro = {
            canal: datos.canal || 'web',
            usuario_nombre: nombreFinal,
            usuario: { nombre: nombreFinal, rut: datos.usuario_rut || datos.rut || '' },
            contraparte_nombre: contraparteFinal,
            contraparte: { nombre: contraparteFinal },
            materia: materiaFinal,
            datos_causa: { materia: materiaFinal, tribunal: tribunalFinal },
            tribunal: tribunalFinal,
            hechos: Array.isArray(datos.hechos) ? datos.hechos : [relatoFinal],
            relato_hechos: relatoFinal,
            postulante_nombre: datos.postulante_nombre || 'Postulante en turno',
            postulante_id: datos.postulante_id || 'sin_asignar',
            documentos_probatorios: datos.documentos_probatorios || [],
            fecha_ingreso: new Date()
        };

        const docRef = await coleccionCasos.add(registro);
        return { id: docRef.id, ...registro };
    } catch (error) {
        console.error("Error al guardar caso:", error);
        throw error;
    }
}

async function obtenerCaso(id) {
    try {
        const doc = await coleccionCasos.doc(id).get();
        if (!doc.exists) return null;
        return { id: doc.id, ...doc.data() };
    } catch (error) {
        console.error("Error al obtener caso:", error);
        return null;
    }
}

async function listarCasos() {
    try {
        const snapshot = await coleccionCasos.get();
        const casos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        casos.sort((a, b) => {
            const obtenerSegundos = (c) => {
                const f = c.fecha_ingreso || c.creadoEn || c.actualizadoEn;
                if (!f) return 0;
                if (f._seconds) return f._seconds;
                if (f instanceof Date) return Math.floor(f.getTime() / 1000);
                if (typeof f === 'string') return Math.floor(new Date(f).getTime() / 1000);
                return 0;
            };
            return obtenerSegundos(b) - obtenerSegundos(a);
        });

        return casos;
    } catch (error) {
        console.error("Error al listar casos:", error);
        return [];
    }
}

async function actualizarCaso(id, datos) {
    try {
        await coleccionCasos.doc(id).update({
            ...datos,
            actualizadoEn: new Date()
        });
        return { id, ...datos };
    } catch (error) {
        console.error("Error al actualizar caso:", error);
        throw error;
    }
}

// ==========================================
// GESTIÓN DE POSTULANTES / ASISTENTES JURÍDICOS
// ==========================================

async function guardarPostulante(datos) {
    try {
        const docRef = await coleccionPostulantes.add({
            nombre: datos.nombre,
            telefono: (datos.telefono || '').replace(/\s+/g, ''),
            email: datos.email || '',
            centro_caj: datos.centro_caj || 'CAJ Puente Alto',
            materia_asignada: datos.materia_asignada || 'General',
            activo: datos.activo !== undefined ? datos.activo : true,
            fecha_registro: new Date()
        });
        console.log(`👤 Postulante registrado con éxito ID: ${docRef.id}`);
        return { id: docRef.id, ...datos };
    } catch (error) {
        console.error("Error al registrar postulante:", error);
        throw error;
    }
}

async function listarPostulantes() {
    try {
        const snapshot = await coleccionPostulantes.get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error al listar postulantes:", error);
        return [];
    }
}

async function buscarPostulantePorTelefono(telefono) {
    try {
        const telLimpio = (telefono || '').replace(/\s+/g, '');
        const snapshot = await coleccionPostulantes.where('telefono', '==', telLimpio).limit(1).get();
        if (snapshot.empty) return null;
        return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    } catch (error) {
        console.error("Error al buscar postulante:", error);
        return null;
    }
}

module.exports = {
    db,
    guardarCaso,
    obtenerCaso,
    listarCasos,
    actualizarCaso,
    guardarPostulante,
    listarPostulantes,
    buscarPostulantePorTelefono
};