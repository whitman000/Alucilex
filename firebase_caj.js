// firebase_caj.js - Módulo de Gestión de Casos CAJ en Firestore (Node 24 Modular)
const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const path = require('path');
const fs = require('fs');

// 1. Inicialización protegida de Firebase Admin
const rutaServiceAccount = path.join(__dirname, 'serviceAccountKey.json');

if (getApps().length === 0) {
    if (fs.existsSync(rutaServiceAccount)) {
        const serviceAccount = require(rutaServiceAccount);
        initializeApp({
            credential: cert(serviceAccount)
        });
        console.log("🔥 Firebase inicializado con éxito con serviceAccountKey.json");
    } else {
        initializeApp();
        console.warn("⚠️ Aviso: No se encontró serviceAccountKey.json en ALUCILEX.");
    }
}

const db = getFirestore();
const coleccionCasos = db.collection('casos_caj');

// 2. Funciones auxiliares para la gestión de causas
async function guardarCaso(datos) {
    try {
        const nombreFinal = datos.usuario_nombre || datos.nombre || (datos.usuario && datos.usuario.nombre) || 'Usuario WhatsApp';
        const contraparteFinal = datos.contraparte_nombre || datos.contraparte || (datos.contraparte && datos.contraparte.nombre) || 'Por determinar';
        const materiaFinal = datos.materia || (datos.datos_causa && datos.datos_causa.materia) || 'Laboral';
        const tribunalFinal = datos.tribunal || (datos.datos_causa && datos.datos_causa.tribunal) || 'Por determinar';
        const relatoFinal = datos.relato_hechos || (Array.isArray(datos.hechos) ? datos.hechos.join('. ') : datos.hechos) || '';

        const registro = {
            canal: datos.canal || 'whatsapp',
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
async function listarCasos() {
    try {
        const snapshot = await coleccionCasos.get();
        const casos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Ordenar en memoria (más recientes primero) sin descartar documentos
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
async function actualizarDictamenYEscrito(idCaso, analisis, escrito) {
    try {
        await coleccionCasos.doc(idCaso).update({
            analisis_juridico: analisis,
            escrito_borrador: escrito,
            estado: 'escrito_listo',
            fecha_actualizacion: FieldValue.serverTimestamp()
        });
        console.log(`✅ Caso ${idCaso} actualizado con informe y escrito.`);
    } catch (error) {
        console.error("❌ Error al actualizar caso:", error.message);
        throw error;
    }
}
/**
 * Obtiene un caso por su ID desde Firestore
 */
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

/**
 * Actualiza los datos de un caso en Firestore
 */
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
// ==========================================
// GESTIÓN DE POSTULANTES / ASISTENTES JURÍDICOS
// ==========================================

const coleccionPostulantes = db.collection('postulantes_caj');

/**
 * Guarda o actualiza un postulante/asistente jurídico
 */
async function guardarPostulante(datos) {
    try {
        const docRef = await coleccionPostulantes.add({
            nombre: datos.nombre,
            telefono: datos.telefono.replace(/\s+/g, ''), // limpia espacios
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

/**
 * Lista todos los postulantes registrados
 */
async function listarPostulantes() {
    try {
        const snapshot = await coleccionPostulantes.get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error al listar postulantes:", error);
        return [];
    }
}

/**
 * Busca un postulante por su número de teléfono
 */
async function buscarPostulantePorTelefono(telefono) {
    try {
        const telLimpio = telefono.replace(/\s+/g, '');
        const snapshot = await coleccionPostulantes.where('telefono', '==', telLimpio).limit(1).get();
        if (snapshot.empty) return null;
        return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    } catch (error) {
        console.error("Error al buscar postulante:", error);
        return null;
    }
}