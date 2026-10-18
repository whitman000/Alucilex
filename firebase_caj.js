// firebase_caj.js - Conexión a Firestore con Expediente Único por RUT y Repositorio WhatsApp CAJ
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

if (getApps().length === 0 && credencialFirebase) {
    initializeApp({ credential: cert(credencialFirebase) });
    console.log("🔥 Firebase inicializado con éxito");
}

const db = getApps().length > 0 ? getFirestore() : null;
const coleccionCasos = db ? db.collection('casos_caj') : null;
const coleccionPostulantes = db ? db.collection('postulantes_caj') : null;
const coleccionConversaciones = db ? db.collection('conversaciones_whatsapp_caj') : null;

/**
 * Limpia y normaliza el RUT chileno (ej: " 12.899.975-K " -> "12899975-K")
 */
function normalizarRUT(rut) {
    if (!rut || typeof rut !== 'string') return null;
    const limpio = rut.replace(/[^0-9kK]/g, '').toUpperCase();
    if (limpio.length < 7) return null;
    const cuerpo = limpio.slice(0, -1);
    const dv = limpio.slice(-1);
    if (!/^\d+$/.test(cuerpo)) return null;
    return `${cuerpo}-${dv}`;
}

/**
 * Limpia un número de teléfono dejando formato chileno estándar (ej: 56912345678)
 */
function normalizarTelefono(telefono) {
    if (!telefono) return '';
    let limpio = String(telefono).split('@')[0].replace(/[^0-9]/g, '');
    if (limpio.length === 9 && limpio.startsWith('9')) {
        limpio = '56' + limpio;
    }
    return limpio;
}

function elegirValorNoVacio(nuevo, previo, porDefecto = '') {
    const valoresIgnorados = new Set(['', 's/r', 'sin-rut', 'por determinar', 'usuario caj', 'no informado', 'no informada', 'null', 'undefined']);
    if (nuevo !== undefined && nuevo !== null) {
        const str = String(nuevo).trim();
        if (str && !valoresIgnorados.has(str.toLowerCase())) {
            return str;
        }
    }
    if (previo !== undefined && previo !== null) {
        const strPrev = String(previo).trim();
        if (strPrev && !valoresIgnorados.has(strPrev.toLowerCase())) {
            return strPrev;
        }
    }
    return porDefecto;
}

// ==========================================
// GESTIÓN DE EXPEDIENTE FORENSE POR RUT
// ==========================================

async function guardarCaso(datos) {
    try {
        const rutTitular = normalizarRUT(datos.usuario_rut || datos.rut || datos.rut_titular || (datos.usuario && datos.usuario.rut));
        const telNormalizado = normalizarTelefono(datos.telefono || datos.telefono_contacto || (datos.usuario && datos.usuario.telefono));
        const nombreFinal = elegirValorNoVacio(datos.usuario_nombre || datos.nombre || (datos.usuario && datos.usuario.nombre), null, 'Usuario CAJ');
        const contraparteFinal = elegirValorNoVacio(datos.contraparte_nombre || datos.contraparte || (datos.contraparte && datos.contraparte.nombre), null, 'Por determinar');
        const materiaFinal = elegirValorNoVacio(datos.materia || (datos.datos_causa && datos.datos_causa.materia), null, 'General');
        const tribunalFinal = elegirValorNoVacio(datos.tribunal || (datos.datos_causa && datos.datos_causa.tribunal), null, 'Por determinar');
        const relatoFinal = datos.relato_hechos || (Array.isArray(datos.hechos) ? datos.hechos.filter(Boolean).join('. ') : datos.hechos) || '';
        const hechosEntrantes = Array.isArray(datos.hechos)
            ? datos.hechos.map(h => String(h || '').trim()).filter(Boolean)
            : (relatoFinal ? [String(relatoFinal).trim()] : []);

        // Determinar el ID del documento:
        // - Si hay RUT válido -> EXP_<RUT>
        // - Si viene de WhatsApp o tiene teléfono pero aún no da RUT -> WA_<TELEFONO> (para no duplicar fichas en cada mensaje)
        const idTempTelefono = telNormalizado ? `WA_${telNormalizado}` : null;
        const idExpediente = rutTitular ? `EXP_${rutTitular}` : (datos.id_expediente_forzado || idTempTelefono);

        let dataPrevia = {};
        let docRef = null;

        if (idExpediente && coleccionCasos) {
            docRef = coleccionCasos.doc(idExpediente);
            const docExistente = await docRef.get();
            if (docExistente.exists) {
                dataPrevia = docExistente.data() || {};
            }
            // Si ahora tenemos RUT y antes existía un expediente temporal WA_<TELEFONO>, fusionamos sus datos y lo limpiamos
            if (rutTitular && idTempTelefono && idExpediente !== idTempTelefono) {
                const docTempRef = coleccionCasos.doc(idTempTelefono);
                const docTempSnap = await docTempRef.get();
                if (docTempSnap.exists) {
                    const tempData = docTempSnap.data() || {};
                    dataPrevia = {
                        ...tempData,
                        ...dataPrevia,
                        hechos: [...(tempData.hechos || []), ...(dataPrevia.hechos || [])],
                        historial_whatsapp: [...(tempData.historial_whatsapp || []), ...(dataPrevia.historial_whatsapp || [])],
                        documentos_probatorios: [...(tempData.documentos_probatorios || []), ...(dataPrevia.documentos_probatorios || [])]
                    };
                    await docTempRef.delete().catch(() => {});
                    console.log(`🔄 Expediente temporal ${idTempTelefono} migrado y fusionado a ${idExpediente}`);
                }
            }
        }

        const usuarioPrevio = dataPrevia.usuario || {};
        const contrapartePrevia = dataPrevia.contraparte || {};
        const nombreConsolidado = elegirValorNoVacio(datos.usuario_nombre || datos.nombre || (datos.usuario && datos.usuario.nombre), dataPrevia.usuario_nombre || usuarioPrevio.nombre, 'Usuario CAJ');
        const rutConsolidado = rutTitular || normalizarRUT(dataPrevia.rut_titular || usuarioPrevio.rut);
        const telefonoConsolidado = elegirValorNoVacio(telNormalizado, usuarioPrevio.telefono || dataPrevia.telefono, '');
        const domicilioConsolidado = elegirValorNoVacio(datos.domicilio || (datos.usuario && datos.usuario.domicilio), usuarioPrevio.domicilio, '');
        const comunaConsolidada = elegirValorNoVacio(datos.comuna || (datos.usuario && datos.usuario.comuna), usuarioPrevio.comuna, '');
        const profesionConsolidada = elegirValorNoVacio(datos.profesion || (datos.usuario && datos.usuario.profesion), usuarioPrevio.profesion, '');
        const emailConsolidado = elegirValorNoVacio(datos.email || datos.correo || (datos.usuario && datos.usuario.email), usuarioPrevio.email, '');

        const contraparteNombreConsolidado = elegirValorNoVacio(
            datos.contraparte_nombre || (typeof datos.contraparte === 'string' ? datos.contraparte : datos.contraparte?.nombre),
            dataPrevia.contraparte_nombre || contrapartePrevia.nombre,
            'Por determinar'
        );
        const contraparteRutConsolidado = elegirValorNoVacio(
            datos.contraparte_rut || datos.contraparte?.rut,
            contrapartePrevia.rut,
            'S/R'
        );
        const contraparteDomicilioConsolidado = elegirValorNoVacio(
            datos.contraparte_domicilio || datos.contraparte?.domicilio,
            contrapartePrevia.domicilio,
            ''
        );

        const materiaConsolidada = elegirValorNoVacio(datos.materia || datos.datos_causa?.materia, dataPrevia.materia || dataPrevia.datos_causa?.materia, 'General');
        const tribunalConsolidado = elegirValorNoVacio(datos.tribunal || datos.datos_causa?.tribunal, dataPrevia.tribunal || dataPrevia.datos_causa?.tribunal, 'Por determinar');

        // Unificar hechos evitando duplicados exactos
        const hechosPrevios = Array.isArray(dataPrevia.hechos) ? dataPrevia.hechos.filter(Boolean) : [];
        const setHechos = new Set([...hechosPrevios, ...hechosEntrantes].map(h => String(h).trim()).filter(Boolean));
        const hechosCombinados = Array.from(setHechos);
        const relatoConsolidado = elegirValorNoVacio(datos.relato_hechos, dataPrevia.relato_hechos, hechosCombinados.join('. '));

        // Unificar historial de conversación de WhatsApp si viene incluido
        const historialPrevio = Array.isArray(dataPrevia.historial_whatsapp) ? dataPrevia.historial_whatsapp : [];
        const historialEntrante = Array.isArray(datos.historial_whatsapp) ? datos.historial_whatsapp : [];
        const mapaHistorial = new Map();
        for (const item of [...historialPrevio, ...historialEntrante]) {
            if (item && (item.id || item.texto)) {
                const key = item.id || `${item.fecha || ''}_${item.autor || ''}_${item.texto}`;
                mapaHistorial.set(key, item);
            }
        }
        const historialCombinado = Array.from(mapaHistorial.values());

        const adjuntosCombinados = [
            ...(dataPrevia.documentos_probatorios || []),
            ...(datos.documentos_probatorios || [])
        ];

        const registro = {
            rut_titular: rutConsolidado || 'SIN-RUT',
            canal: datos.canal || dataPrevia.canal || 'web',
            usuario_nombre: nombreConsolidado,
            usuario: {
                nombre: nombreConsolidado,
                rut: rutConsolidado || 'S/R',
                telefono: telefonoConsolidado,
                domicilio: domicilioConsolidado,
                comuna: comunaConsolidada,
                profesion: profesionConsolidada,
                email: emailConsolidado
            },
            contraparte_nombre: contraparteNombreConsolidado,
            contraparte: {
                nombre: contraparteNombreConsolidado,
                rut: contraparteRutConsolidado,
                domicilio: contraparteDomicilioConsolidado
            },
            materia: materiaConsolidada,
            datos_causa: { materia: materiaConsolidada, tribunal: tribunalConsolidado },
            tribunal: tribunalConsolidado,
            hechos: hechosCombinados,
            relato_hechos: relatoConsolidado,
            postulante_nombre: elegirValorNoVacio(datos.postulante_nombre, dataPrevia.postulante_nombre, process.env.CAJ_ASESOR_NOMBRE || 'Carlos Rosas'),
            postulante_id: elegirValorNoVacio(datos.postulante_id, dataPrevia.postulante_id, 'sin_asignar'),
            centro_caj: elegirValorNoVacio(datos.centro_caj, dataPrevia.centro_caj, process.env.CAJ_NOMBRE_CENTRO || 'Centro de Atención Jurídica - CAJ'),
            documentos_probatorios: adjuntosCombinados,
            historial_whatsapp: historialCombinado,
            ia_activa: datos.ia_activa !== undefined ? datos.ia_activa : (dataPrevia.ia_activa !== undefined ? dataPrevia.ia_activa : true),
            estado_atencion: datos.estado_atencion || dataPrevia.estado_atencion || 'en_indagacion_ia',
            actualizadoEn: new Date(),
            fecha_actualizacion: new Date()
        };

        if (!dataPrevia.fecha_ingreso) {
            registro.fecha_ingreso = new Date();
        } else {
            registro.fecha_ingreso = dataPrevia.fecha_ingreso;
        }

        if (docRef) {
            await docRef.set(registro, { merge: true });
            console.log(`📁 Expediente sincronizado en Firebase (ID: ${idExpediente})`);
            return { id: idExpediente, ...registro };
        } else {
            const nuevoDoc = await coleccionCasos.add(registro);
            return { id: nuevoDoc.id, ...registro };
        }
    } catch (error) {
        console.error("Error al guardar expediente:", error);
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

async function buscarCasoPorTelefono(telefono) {
    try {
        const tel = normalizarTelefono(telefono);
        if (!tel || !coleccionCasos) return null;

        // 1. Revisar si existe documento temporal WA_<telefono>
        const docTemp = await coleccionCasos.doc(`WA_${tel}`).get();
        if (docTemp.exists) {
            return { id: docTemp.id, ...docTemp.data() };
        }

        // 2. Buscar en casos_caj por usuario.telefono
        const snap = await coleccionCasos.where('usuario.telefono', '==', tel).limit(1).get();
        if (!snap.empty) {
            return { id: snap.docs[0].id, ...snap.docs[0].data() };
        }
        return null;
    } catch (error) {
        console.error("Error al buscar caso por teléfono:", error);
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
// GESTIÓN DE POSTULANTES / ASESORES JURÍDICOS
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
        const telNorm = normalizarTelefono(telLimpio);
        let snapshot = await coleccionPostulantes.where('telefono', '==', telLimpio).limit(1).get();
        if (snapshot.empty && telNorm && telNorm !== telLimpio) {
            snapshot = await coleccionPostulantes.where('telefono', '==', telNorm).limit(1).get();
        }
        if (snapshot.empty) return null;
        return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    } catch (error) {
        console.error("Error al buscar postulante:", error);
        return null;
    }
}

async function obtenerAsesorActivoCAJ(sessionId = 'coordinador_carlos', telefonoSesion = '') {
    const porDefecto = {
        id: sessionId || 'coordinador_carlos',
        nombre: process.env.CAJ_ASESOR_NOMBRE || 'Carlos Rosas',
        centro_caj: process.env.CAJ_NOMBRE_CENTRO || 'Centro de Atención Jurídica (CAJ)'
    };
    try {
        if (!coleccionPostulantes) return porDefecto;
        if (telefonoSesion) {
            const porFono = await buscarPostulantePorTelefono(telefonoSesion);
            if (porFono && porFono.nombre) {
                return {
                    id: porFono.id,
                    nombre: porFono.nombre,
                    centro_caj: porFono.centro_caj || porDefecto.centro_caj
                };
            }
        }
        const lista = await listarPostulantes();
        const activo = lista.find(p => p.activo !== false && p.nombre);
        if (activo) {
            return {
                id: activo.id,
                nombre: activo.nombre,
                centro_caj: activo.centro_caj || porDefecto.centro_caj
            };
        }
    } catch (e) {
        // Fallback silencioso
    }
    return porDefecto;
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

// ==========================================
// REPOSITORIO DE CONVERSACIONES WHATSAPP CAJ
// (Compatible con control_conversaciones_caj.js)
// ==========================================

function crearRepositorioWhatsAppFirebase({ sessionId = 'coordinador_carlos', obtenerAsesor = () => obtenerAsesorActivoCAJ(sessionId) } = {}) {
    const memoriaLocal = new Map();

    function asegurarEstadoMemoria(jid) {
        if (!memoriaLocal.has(jid)) {
            memoriaLocal.set(jid, {
                jid,
                telefono: normalizarTelefono(jid),
                pausado: false,
                mensajesVistos: new Set(),
                salidasPropias: new Set(),
                historial: [],
                ficha: {},
                expedienteId: null
            });
        }
        return memoriaLocal.get(jid);
    }

    async function cargarDesdeFirestore(jid) {
        const mem = asegurarEstadoMemoria(jid);
        if (!coleccionConversaciones) return mem;
        try {
            const docSnap = await coleccionConversaciones.doc(jid).get();
            if (docSnap.exists) {
                const data = docSnap.data() || {};
                if (typeof data.pausado === 'boolean') mem.pausado = data.pausado;
                if (Array.isArray(data.historial) && data.historial.length > mem.historial.length) {
                    mem.historial = data.historial;
                    for (const m of data.historial) {
                        if (m && m.id) mem.mensajesVistos.add(m.id);
                    }
                }
                if (Array.isArray(data.salidasPropias)) {
                    for (const idSal of data.salidasPropias) mem.salidasPropias.add(idSal);
                }
                if (data.ficha && typeof data.ficha === 'object') {
                    mem.ficha = { ...data.ficha, ...mem.ficha };
                }
                if (data.expedienteId) {
                    mem.expedienteId = data.expedienteId;
                }
            }
        } catch (err) {
            console.warn(`⚠️ Advertencia leyendo conversación ${jid}:`, err.message);
        }
        return mem;
    }

    async function persistirEnFirestore(jid) {
        const mem = asegurarEstadoMemoria(jid);
        if (!coleccionConversaciones) return;
        try {
            await coleccionConversaciones.doc(jid).set({
                jid,
                telefono: mem.telefono,
                sessionId,
                pausado: mem.pausado,
                expedienteId: mem.expedienteId || null,
                ficha: mem.ficha || {},
                historial: mem.historial.slice(-60),
                salidasPropias: Array.from(mem.salidasPropias).slice(-100),
                actualizadoEn: new Date()
            }, { merge: true });
        } catch (err) {
            console.warn(`⚠️ Advertencia guardando conversación ${jid}:`, err.message);
        }
    }

    return {
        async estado(jid) {
            const mem = await cargarDesdeFirestore(jid);
            return { pausado: mem.pausado };
        },

        async pausar(jid, valor) {
            const mem = await cargarDesdeFirestore(jid);
            mem.pausado = Boolean(valor);
            await persistirEnFirestore(jid);
            if (mem.expedienteId && coleccionCasos) {
                await coleccionCasos.doc(mem.expedienteId).set({
                    ia_activa: !mem.pausado,
                    estado_atencion: mem.pausado ? 'relevo_asesor_humano' : 'en_indagacion_ia',
                    actualizadoEn: new Date()
                }, { merge: true }).catch(() => {});
            }
        },

        async esPropio(jid, id) {
            const mem = asegurarEstadoMemoria(jid);
            return mem.salidasPropias.has(String(id));
        },

        async registrar(mensaje) {
            const { jid, id, delAsesor, texto = '', tipo = 'texto' } = mensaje;
            const mem = await cargarDesdeFirestore(jid);
            if (mem.mensajesVistos.has(id)) return false;
            mem.mensajesVistos.add(id);

            const registroMsg = {
                id,
                autor: delAsesor ? 'asesor_juridico' : 'cliente',
                rol: delAsesor ? 'assistant' : 'user',
                texto: String(texto || '').trim(),
                tipo,
                fecha: new Date().toISOString()
            };
            mem.historial.push(registroMsg);
            await persistirEnFirestore(jid);
            return true;
        },

        async marcar(jid, id, meta = {}) {
            const mem = asegurarEstadoMemoria(jid);
            const item = mem.historial.find(m => m.id === id);
            if (item) {
                item.estado = meta.estado;
                item.motivo = meta.motivo;
            }
            await persistirEnFirestore(jid);
        },

        async contexto(jid) {
            const mem = await cargarDesdeFirestore(jid);
            const casoExistente = await buscarCasoPorTelefono(mem.telefono);
            const asesor = await obtenerAsesor();

            if (casoExistente) {
                mem.expedienteId = casoExistente.id;
                mem.ficha = {
                    usuario_nombre: elegirValorNoVacio(mem.ficha.usuario_nombre, casoExistente.usuario_nombre),
                    usuario_rut: elegirValorNoVacio(mem.ficha.usuario_rut, casoExistente.rut_titular),
                    domicilio: elegirValorNoVacio(mem.ficha.domicilio, casoExistente.usuario?.domicilio),
                    comuna: elegirValorNoVacio(mem.ficha.comuna, casoExistente.usuario?.comuna),
                    profesion: elegirValorNoVacio(mem.ficha.profesion, casoExistente.usuario?.profesion),
                    email: elegirValorNoVacio(mem.ficha.email, casoExistente.usuario?.email),
                    materia: elegirValorNoVacio(mem.ficha.materia, casoExistente.materia),
                    tribunal: elegirValorNoVacio(mem.ficha.tribunal, casoExistente.tribunal),
                    contraparte_nombre: elegirValorNoVacio(mem.ficha.contraparte_nombre, casoExistente.contraparte_nombre),
                    contraparte_rut: elegirValorNoVacio(mem.ficha.contraparte_rut, casoExistente.contraparte?.rut),
                    contraparte_domicilio: elegirValorNoVacio(mem.ficha.contraparte_domicilio, casoExistente.contraparte?.domicilio),
                    hechos: Array.isArray(casoExistente.hechos) ? casoExistente.hechos : (mem.ficha.hechos || []),
                    relato_hechos: elegirValorNoVacio(mem.ficha.relato_hechos, casoExistente.relato_hechos),
                    postulante_nombre: elegirValorNoVacio(casoExistente.postulante_nombre, asesor.nombre, 'Carlos Rosas'),
                    postulante_id: elegirValorNoVacio(casoExistente.postulante_id, asesor.id, 'coordinador_carlos'),
                    centro_caj: elegirValorNoVacio(casoExistente.centro_caj, asesor.centro_caj, 'Centro de Atención Jurídica (CAJ)')
                };
            } else {
                mem.ficha = {
                    ...mem.ficha,
                    postulante_nombre: elegirValorNoVacio(mem.ficha.postulante_nombre, asesor.nombre, 'Carlos Rosas'),
                    postulante_id: elegirValorNoVacio(mem.ficha.postulante_id, asesor.id, 'coordinador_carlos'),
                    centro_caj: elegirValorNoVacio(mem.ficha.centro_caj, asesor.centro_caj, 'Centro de Atención Jurídica (CAJ)')
                };
            }

            return {
                jid,
                telefono: mem.telefono,
                historial: mem.historial.slice(-25),
                fichaActual: mem.ficha,
                asesorNombre: mem.ficha.postulante_nombre || asesor.nombre,
                asesorId: mem.ficha.postulante_id || asesor.id,
                centroNombre: mem.ficha.centro_caj || asesor.centro_caj
            };
        },

        async incorporar(mensaje, resultado = {}) {
            const { jid, delAsesor } = mensaje;
            const mem = await cargarDesdeFirestore(jid);
            const extraidos = resultado.datos_extraidos || {};
            const asesor = await obtenerAsesor();

            const hechosPrevios = Array.isArray(mem.ficha.hechos) ? mem.ficha.hechos : [];
            const hechosNuevos = Array.isArray(extraidos.hechos) ? extraidos.hechos : [];
            const hechosUnificados = Array.from(new Set([...hechosPrevios, ...hechosNuevos].map(h => String(h || '').trim()).filter(Boolean)));

            mem.ficha = {
                usuario_nombre: elegirValorNoVacio(extraidos.usuario_nombre, mem.ficha.usuario_nombre, 'Usuario CAJ'),
                usuario_rut: elegirValorNoVacio(normalizarRUT(extraidos.usuario_rut), mem.ficha.usuario_rut, ''),
                telefono: mem.telefono,
                domicilio: elegirValorNoVacio(extraidos.domicilio, mem.ficha.domicilio, ''),
                comuna: elegirValorNoVacio(extraidos.comuna, mem.ficha.comuna, ''),
                profesion: elegirValorNoVacio(extraidos.profesion, mem.ficha.profesion, ''),
                email: elegirValorNoVacio(extraidos.email, mem.ficha.email, ''),
                materia: elegirValorNoVacio(extraidos.materia, mem.ficha.materia, 'General'),
                tribunal: elegirValorNoVacio(extraidos.tribunal, mem.ficha.tribunal, 'Por determinar'),
                contraparte_nombre: elegirValorNoVacio(extraidos.contraparte_nombre, mem.ficha.contraparte_nombre, 'Por determinar'),
                contraparte_rut: elegirValorNoVacio(normalizarRUT(extraidos.contraparte_rut) || extraidos.contraparte_rut, mem.ficha.contraparte_rut, 'S/R'),
                contraparte_domicilio: elegirValorNoVacio(extraidos.contraparte_domicilio, mem.ficha.contraparte_domicilio, ''),
                hechos: hechosUnificados,
                relato_hechos: elegirValorNoVacio(extraidos.relato_hechos, mem.ficha.relato_hechos, hechosUnificados.join('. ')),
                postulante_nombre: elegirValorNoVacio(mem.ficha.postulante_nombre, asesor.nombre, 'Carlos Rosas'),
                postulante_id: elegirValorNoVacio(mem.ficha.postulante_id, asesor.id, 'coordinador_carlos'),
                centro_caj: elegirValorNoVacio(mem.ficha.centro_caj, asesor.centro_caj, 'Centro de Atención Jurídica (CAJ)')
            };

            const casoGuardado = await guardarCaso({
                ...mem.ficha,
                canal: 'whatsapp',
                ia_activa: !mem.pausado && !delAsesor,
                estado_atencion: (mem.pausado || delAsesor) ? 'relevo_asesor_humano' : (extraidos.ficha_completa ? 'ficha_completa_ia' : 'en_indagacion_ia'),
                historial_whatsapp: mem.historial
            });

            if (casoGuardado && casoGuardado.id) {
                mem.expedienteId = casoGuardado.id;
            }
            await persistirEnFirestore(jid);
        },

        async reservarSalida(jid, idSalida) {
            const mem = asegurarEstadoMemoria(jid);
            mem.salidasPropias.add(String(idSalida));
            await persistirEnFirestore(jid);
        },

        async marcarSalida(jid, idSalida, textoRespuesta = '') {
            const mem = asegurarEstadoMemoria(jid);
            mem.salidasPropias.add(String(idSalida));
            if (textoRespuesta) {
                const msgIA = {
                    id: idSalida,
                    autor: 'ia_caj',
                    rol: 'assistant',
                    texto: textoRespuesta,
                    tipo: 'texto',
                    fecha: new Date().toISOString()
                };
                mem.historial.push(msgIA);
                if (mem.expedienteId && coleccionCasos) {
                    await guardarCaso({
                        ...mem.ficha,
                        id_expediente_forzado: mem.expedienteId,
                        canal: 'whatsapp',
                        historial_whatsapp: mem.historial
                    }).catch(() => {});
                }
            }
            await persistirEnFirestore(jid);
        }
    };
}

module.exports = {
    db,
    normalizarRUT,
    normalizarTelefono,
    guardarCaso,
    obtenerCaso,
    buscarCasoPorTelefono,
    listarCasos,
    actualizarCaso,
    actualizarDictamenYEscrito,
    guardarPostulante,
    listarPostulantes,
    buscarPostulantePorTelefono,
    obtenerAsesorActivoCAJ,
    validarAccesoPostulante,
    crearRepositorioWhatsAppFirebase
};