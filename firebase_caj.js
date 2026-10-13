// firebase_caj.js - Conexión a Firestore con Expediente Único por RUT
require('dotenv').config();
const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const path = require('path');
const fs = require('fs');

let credencialFirebase = null;

// 1. Variable de entorno en Render
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
        credencialFirebase = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } catch (e) {
        console.error("Error al parsear FIREBASE_SERVICE_ACCOUNT:", e);
    }
}
// 2. Secret File en Render
if (!credencialFirebase && fs.existsSync('/etc/secrets/serviceAccountKey.json')) {
    credencialFirebase = require('/etc/secrets/serviceAccountKey.json');
}
// 3. Archivo local en tu PC
if (!credencialFirebase) {
    const localPath = path.resolve(__dirname, 'serviceAccountKey.json');
    if (fs.existsSync(localPath)) {
        credencialFirebase = require(localPath);
    }
}

if (getApps().length === 0) {
    initializeApp({ credential: cert(credencialFirebase) });
    console.log("🔥 Firebase inicializado con éxito");
}

const db = getFirestore();
const coleccionCasos = db.collection('casos_caj');
const coleccionPostulantes = db.collection('postulantes_caj');

/**
 * Limpia y normaliza el RUT chileno (ej: " 12.899.975-K " -> "12899975-K")
 */
function normalizarRUT(rut) {
    if (!rut || typeof rut !== 'string') return null;
    const limpio = rut.replace(/[^0-9kK]/g, '').toUpperCase();
    if (limpio.length < 2) return null;
    const cuerpo = limpio.slice(0, -1);
    const dv = limpio.slice(-1);
    return `${cuerpo}-${dv}`;
}

// ==========================================
// GESTIÓN DE EXPEDIENTE FORENSE POR RUT
// ==========================================

async function guardarCaso(datos) {
    try {
        const rutTitular = normalizarRUT(datos.usuario_rut || datos.rut || (datos.usuario && datos.usuario.rut));
        const nombreFinal = datos.usuario_nombre || datos.nombre || (datos.usuario && datos.usuario.nombre) || 'Usuario CAJ';
        const contraparteFinal = datos.contraparte_nombre || datos.contraparte || (datos.contraparte && datos.contraparte.nombre) || 'Por determinar';
        const materiaFinal = datos.materia || (datos.datos_causa && datos.datos_causa.materia) || 'General';
        const tribunalFinal = datos.tribunal || (datos.datos_causa && datos.datos_causa.tribunal) || 'Por determinar';
        const relatoFinal = datos.relato_hechos || (Array.isArray(datos.hechos) ? datos.hechos.join('. ') : datos.hechos) || '';

        const registro = {
            rut_titular: rutTitular || 'SIN-RUT',
            canal: datos.canal || 'web',
            usuario_nombre: nombreFinal,
            usuario: {
                nombre: nombreFinal,
                rut: rutTitular || 'S/R',
                telefono: datos.telefono || datos.telefono_contacto || '',
                domicilio: datos.domicilio || '',
                comuna: datos.comuna || '',
                profesion: datos.profesion || ''
            },
            contraparte_nombre: contraparteFinal,
            contraparte: {
                nombre: contraparteFinal,
                rut: datos.contraparte_rut || 'S/R',
                domicilio: datos.contraparte_domicilio || ''
            },
            materia: materiaFinal,
            datos_causa: { materia: materiaFinal, tribunal: tribunalFinal },
            tribunal: tribunalFinal,
            hechos: Array.isArray(datos.hechos) ? datos.hechos : [relatoFinal],
            relato_hechos: relatoFinal,
            postulante_nombre: datos.postulante_nombre || 'Carlos Rosas',
            postulante_id: datos.postulante_id || 'sin_asignar',
            documentos_probatorios: datos.documentos_probatorios || [],
            actualizadoEn: new Date()
        };

        // Si tenemos un RUT válido, usamos el RUT como ID del expediente (ej: "EXP_12899975-2")
        let docRef;
        if (rutTitular) {
            const idExpediente = `EXP_${rutTitular}`;
            docRef = coleccionCasos.doc(idExpediente);
            const docExistente = await docRef.get();

            if (docExistente.exists) {
                // Si ya existe el expediente para este RUT, lo complementamos
                const dataPrevia = docExistente.data();
                const hechosCombinados = [...(dataPrevia.hechos || []), ...registro.hechos];
                const adjuntosCombinados = [...(dataPrevia.documentos_probatorios || []), ...registro.documentos_probatorios];
                
                await docRef.update({
                    ...registro,
                    hechos: hechosCombinados,
                    documentos_probatorios: adjuntosCombinados,
                    fecha_actualizacion: new Date()
                });
                console.log(`📁 Expediente complementado para RUT ${rutTitular} (ID: ${idExpediente})`);
                return { id: idExpediente, ...registro, hechos: hechosCombinados };
            } else {
                registro.fecha_ingreso = new Date();
                await docRef.set(registro);
                console.log(`📁 Nuevo Expediente creado para RUT ${rutTitular} (ID: ${idExpediente})`);
                return { id: idExpediente, ...registro };
            }
        } else {
            // Si aún no informa RUT, se guarda con ID automático temporal
            registro.fecha_ingreso = new Date();
            docRef = await coleccionCasos.add(registro);
            return { id: docRef.id, ...registro };
        }
    } catch (error) {
        console.error("Error al guardar expediente por RUT:", error);
        throw error;
    }
}

async function obtenerCaso(id) {
    try {
        const doc = await coleccionCasos.doc(id).get();
        if (!doc.exists) return null;
        return { id: doc.id, ...doc.data() };
    } catch (error) {
        console.error("Error al obtener expediente:", error);
        return null;
    }
}

async function listarCasos() {
    try {
        const snapshot = await coleccionCasos.get();
        const casos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        casos.sort((a, b) => {
            const obtenerSegundos = (c) => {
                const f = c.actualizadoEn || c.fecha_actualizacion || c.fecha_ingreso;
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
        console.error("Error al listar expedientes:", error);
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
        console.error("Error al actualizar expediente:", error);
        throw error;
    }
}

async function actualizarDictamenYEscrito(id, informe, escrito) {
    try {
        await coleccionCasos.doc(id).update({
            informe_juridico: informe,
            escrito_judicial: escrito,
            analisis_juridico: informe,
            escrito_borrador: escrito,
            estado: 'escrito_listo',
            fecha_actualizacion: new Date(),
            actualizadoEn: new Date()
        });
        return { ok: true };
    } catch (error) {
        console.error("Error al actualizar dictamen y escrito:", error);
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
/**
 * Valida el acceso de un colega por WhatsApp o RUT
 */
async function validarAccesoPostulante(identificador, pin = null) {
    try {
        const idLimpio = (identificador || '').replace(/\s+/g, '');
        const rutNorm = normalizarRUT(idLimpio);

        // 1. Buscar por número de teléfono de WhatsApp
        let snapshot = await coleccionPostulantes.where('telefono', '==', idLimpio).get();
        
        // 2. Si no encuentra por teléfono, buscar por RUT
        if (snapshot.empty && rutNorm) {
            snapshot = await coleccionPostulantes.where('rut', '==', rutNorm).get();
        }

        if (snapshot.empty) {
            return { ok: false, error: 'El identificador ingresado no figura registrado en la nómina del Centro CAJ.' };
        }

        const doc = snapshot.docs[0];
        const data = doc.data();

        if (data.activo === false) {
            return { ok: false, error: 'Su habilitación para este despacho se encuentra inactiva. Consulte con coordinación.' };
        }

        if (data.pin && pin && String(data.pin) !== String(pin)) {
            return { ok: false, error: 'Código de seguridad incorrecto.' };
        }

        return {
            ok: true,
            usuario: {
                id: doc.id,
                nombre: data.nombre,
                telefono: data.telefono,
                rut: data.rut || rutNorm || '',
                rol: data.rol || (data.nombre.toLowerCase().includes('carlos rosas') ? 'coordinador' : 'postulante'),
                centro_caj: data.centro_caj || 'CAJ Puente Alto',
                materia_asignada: data.materia_asignada || 'General'
            }
        };
    } catch (error) {
        console.error("Error al validar acceso:", error);
        throw error;
    }
}

module.exports = {
    db,
    normalizarRUT,
    guardarCaso,
    obtenerCaso,
    listarCasos,
    actualizarCaso,
    actualizarDictamenYEscrito,
    guardarPostulante,
    listarPostulantes,
    buscarPostulantePorTelefono,
    validarAccesoPostulante
};