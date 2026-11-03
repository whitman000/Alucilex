// firebase_caj.js - Conexión a Firestore con Expediente Único por RUT y Repositorio WhatsApp CAJ
require('dotenv').config();
const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getStorage } = require('firebase-admin/storage');
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

const storageBucket = getApps().length > 0
    ? getStorage().bucket(
        process.env.FIREBASE_STORAGE_BUCKET ||
        'alucinet-lex.firebasestorage.app'
    )
    : null;

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
    // CAJ_PROTECCION_LID_TELEFONO_V1
    // Un LID identifica un chat, no acredita un telefono.
    const identificador = String(telefono || '').trim().toLowerCase();

    if (identificador.endsWith('@lid')) {
        return '';
    }
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

// CAJ_AISLAMIENTO_FINAL: una sesion WhatsApp se vincula a exactamente un perfil activo.
async function obtenerPerfilSesionCAJ(sessionId) {
    if (!db || !sessionId) throw new Error('Sesion WhatsApp sin identidad');
    const q = await db.collection('usuarios_alucilex')
        .where('sessionIdWhatsApp', '==', sessionId).limit(2).get();
    if (q.size !== 1 || q.docs[0].data().activo !== true ||
        !Array.isArray(q.docs[0].data().roles) ||
        !q.docs[0].data().roles.some(r => ['coordinador','asesor'].includes(r))) {
        throw new Error('Sesion WhatsApp sin perfil unico y activo');
    }
    return { uid: q.docs[0].id, ...q.docs[0].data() };
}

function idConPropietario(uid, idBase) {
    const huella = require('crypto').createHash('sha256').update(uid).digest('hex').slice(0, 24);
    return `CAJ_${huella}_${idBase}`;
}

async function referenciaCasoPropietario(idBase, uid) {
    const anterior = coleccionCasos.doc(idBase);
    const snap = await anterior.get();
    if (snap.exists && snap.data().propietario_uid === uid) return anterior;
    return coleccionCasos.doc(idConPropietario(uid, idBase));
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

        // Identificadores nuevos exclusivos por propietario; conservar IDs heredados propios.
        const uid = datos.propietario_uid;
        if (typeof uid !== 'string' || !uid.trim()) {
            throw new Error('Propietario Firebase obligatorio para guardar expedientes');
        }
        const baseTemporal = telNormalizado ? `WA_${telNormalizado}` : null;
        const baseDefinitiva = rutTitular ? `EXP_${rutTitular}` : null;
        const expedienteForzado = typeof datos.id_expediente_forzado === 'string'
            ? datos.id_expediente_forzado.trim()
            : '';
        const idBase = expedienteForzado || baseDefinitiva || baseTemporal;
        const docRefElegida = idBase
            ? await referenciaCasoPropietario(idBase, uid)
            : null;
        const idExpediente = docRefElegida ? docRefElegida.id : null;
        const idTempTelefono = baseTemporal
            ? (await referenciaCasoPropietario(baseTemporal, uid)).id
            : null;

        let temporalPendienteDeEliminar = null;
        let dataPrevia = {};
        let docRef = null;

        if (idExpediente && coleccionCasos) {
            docRef = docRefElegida;
            const docExistente = await docRef.get();
            if (docExistente.exists) {
                dataPrevia = docExistente.data() || {};
            }
            // Si ahora tenemos RUT y antes existía un expediente temporal WA_<TELEFONO>, fusionamos sus datos y lo limpiamos
            if (!expedienteForzado && rutTitular && idTempTelefono && idExpediente !== idTempTelefono) {
                const docTempRef = coleccionCasos.doc(idTempTelefono);
                const docTempSnap = await docTempRef.get();
                if (docTempSnap.exists) {
                    const tempData = docTempSnap.data() || {};
                    // CAJ_MIGRACION_SEGURA_2762
                    const propietarioTemporal = tempData.propietario_uid || null;
                    const propietarioDestino = dataPrevia.propietario_uid || null;
                    const propietarioEntrante = datos.propietario_uid || null;

                    const propietarios = [
                        propietarioTemporal,
                        propietarioDestino,
                        propietarioEntrante
                    ].filter(Boolean);

                    if (new Set(propietarios).size > 1) {
                        throw new Error(
                            'Migracion bloqueada: propietarios diferentes'
                        );
                    }

                    if (propietarios.length > 0 &&
                        [propietarioTemporal, propietarioDestino,
                         propietarioEntrante].some(valor => valor === null)) {
                        throw new Error(
                            'Migracion bloqueada: propiedad sin verificar'
                        );
                    }

                    dataPrevia = {
                        ...tempData,
                        ...dataPrevia,
                        hechos: [...(tempData.hechos || []), ...(dataPrevia.hechos || [])],
                        historial_whatsapp: [...(tempData.historial_whatsapp || []), ...(dataPrevia.historial_whatsapp || [])],
                        documentos_probatorios: [...(tempData.documentos_probatorios || []), ...(dataPrevia.documentos_probatorios || [])]
                    };
                    temporalPendienteDeEliminar = docTempRef;
                    console.log(`🔄 Expediente temporal ${idTempTelefono} migrado y fusionado a ${idExpediente}`);
                }
            }
        }

        // CAJ_PROPIEDAD_INMUTABLE_2761
        const propietarioExistente = dataPrevia.propietario_uid || null;
        const propietarioSolicitado = datos.propietario_uid || null;

        if (propietarioExistente &&
            propietarioSolicitado &&
            propietarioExistente !== propietarioSolicitado) {
            throw new Error(
                'No se permite cambiar el propietario del expediente'
            );
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

        // Unificar documentos del expediente sin duplicarlos.
        // Prioriza el ID del mensaje de WhatsApp o el ID del archivo.
        const mapaAdjuntos = new Map();

        const documentosPrevios = Array.isArray(dataPrevia.documentos_probatorios)
            ? dataPrevia.documentos_probatorios
            : [];

        const documentosNuevos = Array.isArray(datos.documentos_probatorios)
            ? datos.documentos_probatorios
            : [];

        for (const documento of [...documentosPrevios, ...documentosNuevos]) {
            if (!documento) continue;

            const identificador =
                typeof documento === 'object'
                    ? (
                        documento.id_whatsapp ||
                        documento.id_archivo ||
                        documento.id ||
                        documento.storage_path ||
                        documento.url
                    )
                    : null;

            const claveDocumento = identificador
                ? String(identificador)
                : JSON.stringify(documento);

            if (!mapaAdjuntos.has(claveDocumento)) {
                mapaAdjuntos.set(claveDocumento, documento);
            } else if (
                typeof documento === 'object' &&
                documento !== null
            ) {
                const anterior = mapaAdjuntos.get(claveDocumento);

                if (typeof anterior === 'object' && anterior !== null) {
                    mapaAdjuntos.set(claveDocumento, {
                        ...anterior,
                        ...documento
                    });
                }
            }
        }

        const adjuntosCombinados = Array.from(mapaAdjuntos.values());

        const registro = {
            propietario_uid: datos.propietario_uid || dataPrevia.propietario_uid || null,
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

        // CAJ_FICHA_ESTRUCTURADA_V1
        // Campos adicionales independientes para cada expediente.
        const camposPersonales = [
            'tipo_ingreso',
            'nombres',
            'apellido1',
            'apellido2',
            'sexo',
            'fecha_nacimiento',
            'edad',
            'genero',
            'region',
            'comuna',
            'telefono_fijo',
            'telefono_recado',
            'email',
            'nacionalidad',
            'estado_civil',
            'profesion',
            'etnia',
            'representante_legal',
            'forma_ingreso'
        ];

        const camposJuridicos = [
            'numero_causa',
            'ruc',
            'caratula',
            'calidad_procesal',
            'fecha_audiencia',
            'estado_procesal',
            'consulta_juridica',
            'objetivo_consulta',
            'observaciones_entrevista'
        ];

        function consolidarCampos(campos, grupo) {
            const anteriores = dataPrevia[grupo] || {};
            const nuevos = datos[grupo] || {};
            const resultado = { ...anteriores };

            for (const campo of campos) {
                const valor = nuevos[campo] ?? datos[campo];

                if (
                    valor !== undefined &&
                    valor !== null &&
                    String(valor).trim() !== ''
                ) {
                    resultado[campo] = valor;
                }
            }

            return resultado;
        }

        registro.ficha_personal = consolidarCampos(
            camposPersonales,
            'ficha_personal'
        );

        registro.antecedentes_juridicos = consolidarCampos(
            camposJuridicos,
            'antecedentes_juridicos'
        );
        if (!dataPrevia.fecha_ingreso) {
            registro.fecha_ingreso = new Date();
        } else {
            registro.fecha_ingreso = dataPrevia.fecha_ingreso;
        }

        if (docRef) {
            await db.runTransaction(async tx => {
                const actual = await tx.get(docRef);
                if (actual.exists && actual.data().propietario_uid !== uid) {
                    throw new Error('Escritura bloqueada: propietario distinto o ausente');
                }
                if (temporalPendienteDeEliminar) {
                    const temporal = await tx.get(temporalPendienteDeEliminar);
                    if (temporal.exists && temporal.data().propietario_uid !== uid) {
                        throw new Error('Migracion bloqueada: temporal ajeno');
                    }
                    if (temporal.exists) tx.delete(temporalPendienteDeEliminar);
                }
                tx.set(docRef, registro, { merge: true });
            });
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

async function buscarCasoPorTelefono(telefono, uid) {
    const tel = normalizarTelefono(telefono);
    if (!tel || !uid || !coleccionCasos) return null;
    const preferida = await referenciaCasoPropietario(`WA_${tel}`, uid);
    const doc = await preferida.get();
    if (doc.exists && doc.data().propietario_uid === uid) {
        return { id: doc.id, ...doc.data() };
    }
    const snap = await coleccionCasos.where('usuario.telefono', '==', tel).get();
    const propios = snap.docs.filter(d => d.data().propietario_uid === uid);
    if (propios.length === 1) return { id: propios[0].id, ...propios[0].data() };
    if (propios.length > 1) throw new Error('Telefono asociado a varios expedientes; requiere seleccion explicita');
    return null;
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
        // CAJ_ACTUALIZACION_FICHAS_SEGURA_V1
        // Actualiza cada casillero sin reemplazar el grupo completo.
        const actualizacion = { ...datos };

        const camposPermitidos = {
            ficha_personal: [
                'tipo_ingreso', 'nombres', 'apellido1', 'apellido2',
                'sexo', 'fecha_nacimiento', 'edad', 'genero',
                'region', 'comuna', 'telefono_fijo', 'telefono_recado',
                'email', 'nacionalidad', 'estado_civil', 'profesion',
                'etnia', 'representante_legal', 'forma_ingreso'
            ],
            antecedentes_juridicos: [
                'numero_causa', 'ruc', 'caratula',
                'calidad_procesal', 'fecha_audiencia',
                'estado_procesal', 'consulta_juridica',
                'objetivo_consulta', 'observaciones_entrevista'
            ]
        };

        for (const [grupo, permitidos] of Object.entries(camposPermitidos)) {
            if (!Object.prototype.hasOwnProperty.call(actualizacion, grupo)) {
                continue;
            }

            const campos = actualizacion[grupo];

            if (
                !campos ||
                typeof campos !== 'object' ||
                Array.isArray(campos)
            ) {
                throw new Error('Estructura inválida: ' + grupo);
            }

            delete actualizacion[grupo];

            for (const [campo, valor] of Object.entries(campos)) {
                if (!permitidos.includes(campo)) {
                    throw new Error('Campo no permitido: ' + grupo + '.' + campo);
                }

                if (valor !== undefined && valor !== null) {
                    actualizacion[`${grupo}.${campo}`] = valor;
                }
            }
        }

        await coleccionCasos.doc(id).update({
            ...actualizacion,
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
                // CAJ_PROTECCION_TELEFONO_LID_V6
                // El LID nunca se interpreta como telefono.
                telefono: String(jid).endsWith('@lid')
                    ? ''
                    : normalizarTelefono(jid),
                pausado: false,
                mensajesVistos: new Set(),
                salidasPropias: new Set(),
                historial: [],
                ficha: {},
                expedienteId: null,
                // CAJ_ESTADO_ENTREVISTA_PERSISTENTE_V1
                entrevista: {
                    fase: 'en_curso',
                    cierre_preguntado: false,
                    finalizada: false,
                    camposResueltos: [],
                    campoActual: null,
                    // CAJ_ESTADO_JURIDICO_V1
                    existeCausaJudicial: null,
                    requiereRuc: null
                }
            });
        }
        return memoriaLocal.get(jid);
    }

    async function cargarDesdeFirestore(jid) {
        const mem = asegurarEstadoMemoria(jid);
        if (!coleccionConversaciones) return mem;
        try {
            const idConversacion = `${sessionId}_${jid}`;
const docSnap = await coleccionConversaciones.doc(idConversacion).get();
            if (docSnap.exists) {
                const data = docSnap.data() || {};
                if (typeof data.pausado === 'boolean') mem.pausado = data.pausado;

                // CAJ_ESTADO_ENTREVISTA_PERSISTENTE_V1
                if (data.entrevista && typeof data.entrevista === 'object') {
                    const guardada = data.entrevista;
                    mem.entrevista = {
                        // CAJ_RECUPERAR_FASE_ENTREVISTA_V2
                        fase: guardada.finalizada === true
                            ? 'finalizada'
                            : guardada.cierre_preguntado === true
                                ? 'esperando_confirmacion'
                                : 'en_curso',
                        cierre_preguntado: guardada.cierre_preguntado === true,
                        finalizada: guardada.finalizada === true,
                        camposResueltos: Array.isArray(guardada.camposResueltos)
                            ? [...new Set(guardada.camposResueltos.filter(
                                campo => typeof campo === 'string'
                            ))]
                            : [],
                        campoActual: typeof guardada.campoActual === 'string'
                            ? guardada.campoActual
                            : null,
                        existeCausaJudicial:
                            typeof guardada.existeCausaJudicial === 'boolean'
                                ? guardada.existeCausaJudicial
                                : null,
                        requiereRuc:
                            typeof guardada.requiereRuc === 'boolean'
                                ? guardada.requiereRuc
                                : null,
                        esperandoDetalleAdicional:
                            guardada.esperandoDetalleAdicional === true,
                        // CAJ_RECUPERAR_ESTADOS_RESPUESTAS_V1
                        estadosRespuestas:
                            guardada.estadosRespuestas &&
                            typeof guardada.estadosRespuestas === 'object' &&
                            !Array.isArray(guardada.estadosRespuestas)
                                ? { ...guardada.estadosRespuestas }
                                : {}
                    };
                }
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
                    // CAJ_RECUPERACION_FICHAS_PROTEGIDA_V1
                    const fichaLocal = mem.ficha || {};
                    const fichaRemota = data.ficha || {};

                    mem.ficha = {
                        ...fichaRemota,
                        ...fichaLocal,
                        ficha_personal: {
                            ...(fichaRemota.ficha_personal || {}),
                            ...(fichaLocal.ficha_personal || {})
                        },
                        antecedentes_juridicos: {
                            ...(fichaRemota.antecedentes_juridicos || {}),
                            ...(fichaLocal.antecedentes_juridicos || {})
                        }
                    };
                }
                if (data.expedienteId) {
                    mem.expedienteId = data.expedienteId;
                }

                // CAJ_RECUPERAR_TELEFONO_LID_V4
                // Recuperar la identidad telefónica verificada del LID.
                const telefonoVerificado = String(
                    data.telefono_verificado || ''
                );

                if (
                    String(jid).endsWith('@lid') &&
                    /^\d{8,15}$/.test(telefonoVerificado)
                ) {
                    const telefonoActual = String(
                        mem.ficha.telefono || ''
                    );

                    const telefonoLid = String(jid).split('@')[0];

                    if (
                        !telefonoActual ||
                        telefonoActual === telefonoLid ||
                        telefonoActual === telefonoVerificado
                    ) {
                        mem.telefono = telefonoVerificado;
                        mem.ficha.telefono = telefonoVerificado;
                        mem.ficha.telefono_verificado =
                            telefonoVerificado;
                    } else {
                        console.warn(
                            '[CAJ IDENTIDAD] Telefono diferente en ficha; requiere verificacion'
                        );
                    }
                }
            }
        } catch (err) {
            console.warn(`⚠️ Advertencia leyendo conversación ${jid}:`, err.message);
        }
        return mem;
    }

    async function persistirEnFirestore(jid, exigirConfirmacion = false) {
        const mem = asegurarEstadoMemoria(jid);
        if (!coleccionConversaciones) {
            if (exigirConfirmacion) {
                throw new Error('Firestore no disponible para guardar el control IA');
            }
            return;
        }
        try {
            await coleccionConversaciones.doc(`${sessionId}_${jid}`).set({
                jid,
                telefono: mem.telefono,
                sessionId,
                pausado: mem.pausado,
                expedienteId: mem.expedienteId || null,
                // CAJ_ESTADO_ENTREVISTA_PERSISTENTE_V1
                entrevista: mem.entrevista,
                ficha: mem.ficha || {},
                historial: mem.historial.slice(-60),
                salidasPropias: Array.from(mem.salidasPropias).slice(-100),
                actualizadoEn: new Date()
            }, { merge: true });
        } catch (err) {
            console.warn(`⚠️ Advertencia guardando conversación ${jid}:`, err.message);
            if (exigirConfirmacion) throw err;
        }
    }

    return {
        async estado(jid) {
            const mem = await cargarDesdeFirestore(jid);
            // CAJ_RESPUESTA_CIERRE_CONTROLADA_V1
            return {
                pausado: mem.pausado,
                // CAJ_ULTIMA_INTERVENCION_ASESOR_V1
                ultimaIntervencionAsesor: [...(mem.historial || [])]
                    .reverse()
                    .find(m => m?.autor === 'asesor_juridico')
                    ?.fecha || null,
                fichaActual: {
                    ...mem.ficha,
                    ficha_personal: { ...(mem.ficha.ficha_personal || {}) },
                    antecedentes_juridicos: { ...(mem.ficha.antecedentes_juridicos || {}) }
                },
                entrevista: {
                    fase: mem.entrevista?.fase || 'en_curso',
                    cierre_preguntado:
                        mem.entrevista?.cierre_preguntado === true,
                    finalizada:
                        mem.entrevista?.finalizada === true,
                    camposResueltos: [...(mem.entrevista?.camposResueltos || [])],
                    campoActual: mem.entrevista?.campoActual || null,
                    esperandoDetalleAdicional:
                        mem.entrevista?.esperandoDetalleAdicional === true,
                    existeCausaJudicial:
                        typeof mem.entrevista?.existeCausaJudicial === 'boolean'
                            ? mem.entrevista.existeCausaJudicial
                            : null,
                    requiereRuc:
                        typeof mem.entrevista?.requiereRuc === 'boolean'
                            ? mem.entrevista.requiereRuc
                            : null
                }
            };
        },

        async pausar(jid, valor) {
            const mem = await cargarDesdeFirestore(jid);
            mem.pausado = Boolean(valor);
            await persistirEnFirestore(jid, true);
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
            const perfilSesion = await obtenerPerfilSesionCAJ(sessionId);
            let casoExistente = null;

            if (mem.expedienteId) {
                casoExistente = await obtenerCaso(mem.expedienteId);

                if (!casoExistente) {
                    throw new Error(
                        'Expediente activo inexistente. No se cargan antecedentes de otra causa.'
                    );
                }

                if (casoExistente.propietario_uid !== perfilSesion.uid) {
                    throw new Error(
                        'Acceso bloqueado: expediente activo pertenece a otro propietario.'
                    );
                }
            }
            const asesor = await obtenerAsesor();

            if (casoExistente) {
                mem.expedienteId = casoExistente.id;
                mem.ficha = {
                    // CAJ_MEMORIA_FICHAS_V1
                    ...mem.ficha,
                    ficha_personal: {
                        ...(mem.ficha.ficha_personal || {}),
                        ...(casoExistente.ficha_personal || {})
                    },
                    antecedentes_juridicos: {
                        ...(mem.ficha.antecedentes_juridicos || {}),
                        ...(casoExistente.antecedentes_juridicos || {})
                    },
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
                // CAJ_CONTEXTO_PREGUNTA_IA_V1
                entrevista: {
                    campoActual: mem.entrevista?.campoActual || null,
                    esperandoDetalleAdicional:
                        mem.entrevista?.esperandoDetalleAdicional === true,
                    camposResueltos: [
                        ...(mem.entrevista?.camposResueltos || [])
                    ],
                    finalizada: mem.entrevista?.finalizada === true,
                    cierre_preguntado:
                        mem.entrevista?.cierre_preguntado === true
                },
                asesorNombre: mem.ficha.postulante_nombre || asesor.nombre,
                asesorId: mem.ficha.postulante_id || asesor.id,
                centroNombre: mem.ficha.centro_caj || asesor.centro_caj
            };
        },

        async incorporar(mensaje, resultado = {}) {
            const { jid, delAsesor } = mensaje;
            const mem = await cargarDesdeFirestore(jid);
            // CAJ_NUMERO_REAL_LID_V1
            // Identidad de chat y telefono son datos diferentes.
            const telefonoEntrante = String(
                mensaje.telefonoVerificado || ''
            );

            if (telefonoEntrante && !/^\d{8,15}$/.test(telefonoEntrante)) {
                throw new Error('Telefono alternativo invalido');
            }

            const telefonoAnterior = String(
                mem.ficha.telefono_verificado || ''
            );

            if (
                telefonoEntrante &&
                telefonoAnterior &&
                telefonoEntrante !== telefonoAnterior
            ) {
                throw new Error(
                    'Conflicto de identidad telefonica en la conversacion'
                );
            }

            if (telefonoEntrante) {
                mem.telefono = telefonoEntrante;
                mem.ficha.telefono_verificado = telefonoEntrante;
                mem.ficha.telefono = telefonoEntrante;
            }

            // CAJ_CONFIRMACION_CIERRE_V1
            // Solo interpretar el cierre tras una pregunta efectivamente enviada.
            // CAJ_CIERRE_SEGURO_V2
            const normalizarRespuestaCierre = valor =>
                String(valor || '')
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .toLowerCase()
                    .replace(/[^a-z0-9\s]/g, '')
                    .trim()
                    .replace(/\s+/g, ' ');

            const entrevista = mem.entrevista || {
                fase: 'en_curso',
                cierre_preguntado: false,
                finalizada: false
            };

            const historial = mem.historial || [];
            const anterior = historial[historial.length - 2];

            const preguntaAnterior =
                anterior?.autor === 'ia_caj' &&
                normalizarRespuestaCierre(anterior.texto)
                    .includes(
                        'tiene algun antecedente adicional que desee agregar a su consulta'
                    );

            const respuestaCliente = normalizarRespuestaCierre(
                mensaje.texto
            );

            // CAJ_RESPUESTA_CAUSA_JUDICIAL_V1
            // Solo interpreta la respuesta a la pregunta
            // jurídica efectivamente enviada.
            if (
                !delAsesor &&
                entrevista.campoActual === 'existeCausaJudicial' &&
                entrevista.cierre_preguntado !== true
            ) {
                const {
                    interpretarExistenciaCausa
                } = require('./entrevista_caj');

                const preguntaJudicial =
                    '¿Actualmente existe una causa judicial iniciada sobre este asunto?';

                const preguntaCoincide =
                    anterior?.autor === 'ia_caj' &&
                    normalizarRespuestaCierre(anterior.texto)
                        .includes(
                            normalizarRespuestaCierre(preguntaJudicial)
                        );

                if (preguntaCoincide) {
                    const interpretacion =
                        interpretarExistenciaCausa(mensaje.texto);

                    if (typeof interpretacion === 'boolean') {
                        entrevista.existeCausaJudicial = interpretacion;
                        entrevista.campoActual = null;
                    }
                }
            }

            // CAJ_CIERRE_ESTADOS_V3
            const respuestaNegativaCierreCAJ =
                /^(?:no|no gracias|no muchas gracias|no tengo nada mas|no tengo nada mas que agregar|no tengo mas antecedentes|no hay nada mas que agregar|nada mas|eso es todo|seria todo|no eso seria todo|no eso seria todo muchas gracias)$/
                    .test(respuestaCliente);

            const respuestaPositivaCierreCAJ =
                /^(?:si|claro|si tengo|tengo algo mas|si quiero agregar|si quiero agregar algo)$/
                    .test(respuestaCliente);

            if (!delAsesor && entrevista.cierre_preguntado === true) {
                if (respuestaNegativaCierreCAJ) {
                    entrevista.fase = 'finalizada';
                    entrevista.finalizada = true;
                    entrevista.cierre_preguntado = false;
                    entrevista.esperandoDetalleAdicional = false;
                    entrevista.campoActual = null;
                } else if (respuestaPositivaCierreCAJ) {
                    entrevista.fase = 'esperando_detalle';
                    entrevista.finalizada = false;
                    entrevista.cierre_preguntado = false;
                    entrevista.esperandoDetalleAdicional = true;
                    entrevista.campoActual = null;
                }
            } else if (
                !delAsesor &&
                entrevista.esperandoDetalleAdicional === true &&
                respuestaCliente
            ) {
                // La IA procesa los antecedentes que acaba de aportar.
                entrevista.esperandoDetalleAdicional = false;
                entrevista.fase = 'en_curso';
                entrevista.finalizada = false;
            } else if (
                !delAsesor &&
                entrevista.finalizada === true &&
                respuestaCliente
            ) {
                entrevista.finalizada = false;
                entrevista.fase = 'en_curso';
            }

            console.log('[CAJ CIERRE] Estado', {
                finalizada: entrevista.finalizada === true,
                esperandoDetalle:
                    entrevista.esperandoDetalleAdicional === true,
                pendienteConfirmacion:
                    entrevista.cierre_preguntado === true
            });
            // CAJ_RESPUESTA_NO_APLICABLE_V1
            // Solo resolver el campo que fue efectivamente preguntado.
            if (
                !delAsesor &&
                entrevista.cierre_preguntado !== true &&
                typeof entrevista.campoActual === 'string'
            ) {
                const {
                    PREGUNTAS_PERSONALES,
                    estaRespondidoSinDato
                } = require('./entrevista_caj');

                // CAJ_NO_APLICABLE_JURIDICO_V1
                const { siguientePreguntaJuridica } =
                    require('./entrevista_caj');

                let preguntaRegistrada = PREGUNTAS_PERSONALES.find(
                    item => item[0] === entrevista.campoActual
                );

                if (!preguntaRegistrada) {
                    const juridica = siguientePreguntaJuridica(
                        mem.ficha,
                        entrevista
                    );

                    if (
                        juridica &&
                        juridica.campo === entrevista.campoActual
                    ) {
                        preguntaRegistrada = [
                            juridica.campo,
                            juridica.pregunta
                        ];
                    }
                }

                const preguntaCoincide =
                    preguntaRegistrada &&
                    anterior?.autor === 'ia_caj' &&
                    normalizarRespuestaCierre(anterior.texto)
                        .includes(
                            normalizarRespuestaCierre(preguntaRegistrada[1])
                        );

                if (
                    preguntaCoincide &&
                    (
                        estaRespondidoSinDato(mensaje.texto) ||
                        (
                            ['no', 'no se'].includes(
                                normalizarRespuestaCierre(mensaje.texto)
                            ) &&
                            [
                                'telefono_fijo',
                                'telefono_recado',
                                'numero_causa',
                                'ruc',
                                'tribunal',
                                'fecha_audiencia'
                            ].includes(entrevista.campoActual)
                        )
                    )
                ) {
                    entrevista.camposResueltos = [
                        ...new Set([
                            ...(entrevista.camposResueltos || []),
                            entrevista.campoActual
                        ])
                    ];

                    entrevista.campoActual = null;
                }
            }

            // CAJ_AVANCE_CONTEXTUAL_IA_V1
            // Aceptar una interpretacion solo para el campo preguntado.
            const interpretacion = resultado.interpretacion_respuesta;

            // CAJ_CAUSA_JUDICIAL_CONTEXTUAL_V1
            // Interpretar respuestas naturales sin depender
            // de una lista cerrada de expresiones.
            if (
                !delAsesor &&
                entrevista.cierre_preguntado !== true &&
                entrevista.campoActual === 'existeCausaJudicial' &&
                anterior?.autor === 'ia_caj' &&
                interpretacion?.campo === 'existeCausaJudicial'
            ) {
                const estadoCausa = interpretacion.estado;
                const valorCausa = String(
                    interpretacion.valor ?? ''
                ).trim().toLowerCase();

                let existeCausaInterpretada = null;

                if (
                    estadoCausa === 'respondido' &&
                    ['true', 'si', 'sí'].includes(valorCausa)
                ) {
                    existeCausaInterpretada = true;
                } else if (
                    estadoCausa === 'no_aplica' ||
                    (
                        estadoCausa === 'respondido' &&
                        ['false', 'no'].includes(valorCausa)
                    )
                ) {
                    existeCausaInterpretada = false;
                }

                if (typeof existeCausaInterpretada === 'boolean') {
                    entrevista.existeCausaJudicial =
                        existeCausaInterpretada;

                    entrevista.campoActual = null;

                    console.log(
                        '[CAJ ENTREVISTA] Existencia de causa interpretada',
                        { existeCausaJudicial: existeCausaInterpretada }
                    );
                }
            }

            // CAJ_VALIDACION_GENERAL_ENTREVISTA_V1
            // El mismo criterio se aplica a datos personales
            // y antecedentes juridicos.
            const { PREGUNTAS_PERSONALES } =
                require('./entrevista_caj');

            const personales = new Set(
                PREGUNTAS_PERSONALES.map(item => item[0])
            );

            const juridicos = new Set([
                'consulta_juridica',
                'relato_hechos',
                'contraparte_nombre',
                'objetivo_consulta',
                'numero_causa',
                'tribunal',
                'calidad_procesal',
                'estado_procesal',
                'fecha_audiencia',
                'ruc'
            ]);

            // Solamente estos campos pueden omitirse
            // sin detener la entrevista.
            const omitibles = new Set([
                'apellido2',
                'genero',
                'telefono_fijo',
                'telefono_recado',
                'email',
                'etnia',
                'representante_legal',
                'contraparte_nombre',
                'numero_causa',
                'tribunal',
                'ruc',
                'fecha_audiencia'
            ]);

            const campoEsperado = entrevista.campoActual;

            // CAJ_AVANCE_SEMANTICO_REPARADO_V1
            // Separar la pregunta registrada de la interpretacion IA.
            const preguntaActivaCAJ =
                !delAsesor &&
                entrevista.cierre_preguntado !== true &&
                anterior?.autor === 'ia_caj' &&
                typeof campoEsperado === 'string' &&
                (
                    personales.has(campoEsperado) ||
                    juridicos.has(campoEsperado)
                );

            const interpretacionValida =
                preguntaActivaCAJ &&
                interpretacion &&
                typeof interpretacion === 'object' &&
                !Array.isArray(interpretacion) &&
                interpretacion.campo === campoEsperado;

            const extraidosContextuales =
                resultado.datos_extraidos || {};

            const personalExtraida =
                extraidosContextuales.ficha_personal || {};

            const juridicaExtraida =
                extraidosContextuales.antecedentes_juridicos || {};

            const fechaValida = valor => {
                if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
                    return false;
                }

                const fecha = new Date(valor + 'T00:00:00Z');

                return !Number.isNaN(fecha.getTime()) &&
                    fecha.toISOString().slice(0, 10) === valor;
            };

            let valorExtraido = '';

            if (personales.has(campoEsperado)) {
                valorExtraido = personalExtraida[campoEsperado];

                if (!valorExtraido) {
                    valorExtraido =
                        extraidosContextuales[campoEsperado];
                }
            } else if (juridicos.has(campoEsperado)) {
                valorExtraido = juridicaExtraida[campoEsperado];

                if (!valorExtraido) {
                    valorExtraido =
                        extraidosContextuales[campoEsperado];
                }
            }

            const valorConfirmado = String(
                valorExtraido ?? ''
            ).trim();

            const valorInterpretado = String(
                interpretacion?.valor ?? ''
            ).trim();

            // CAJ_COINCIDENCIA_SEMANTICA_VALIDADA_V1
            // Contrastar la interpretacion con la extraccion.
            const normalizarDatoCAJ = valor =>
                String(valor ?? '')
                    .trim()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .replace(/\s+/g, ' ')
                    .toLowerCase();

            const datoInterpretadoCAJ =
                normalizarDatoCAJ(valorInterpretado);

            const datoExtraidoCAJ =
                normalizarDatoCAJ(valorConfirmado);

            // CAJ_AVANCE_FLEXIBLE_GENERAL_V1
            // La interpretacion contextual de la IA determina
            // si la respuesta fue comprendida.
            // No exigir coincidencia textual entre dos extracciones.

            const estadosComprensiblesCAJ = new Set([
                'respondido',
                'no_aplica',
                'desconocido'
            ]);

            // CAJ_EXTRACCION_ALTERNATIVA_V1
            // La extraccion IA puede ser valida aunque no devuelva
            // interpretacion_respuesta para el campo exacto.
            const normalizarCampoCAJ = valor =>
                String(valor ?? '')
                    .trim()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .toLowerCase();

            let datoNuevoCAJ = valorConfirmado;

            if (
                campoEsperado === 'nombres' &&
                !String(datoNuevoCAJ || '').trim()
            ) {
                datoNuevoCAJ =
                    extraidosContextuales.usuario_nombre || '';
            }

            const valorAnteriorCAJ = personales.has(campoEsperado)
                ? (
                    mem.ficha.ficha_personal?.[campoEsperado] ||
                    (
                        campoEsperado === 'nombres'
                            ? mem.ficha.usuario_nombre
                            : mem.ficha[campoEsperado]
                    ) ||
                    ''
                )
                : (
                    mem.ficha.antecedentes_juridicos?.[campoEsperado] ||
                    mem.ficha[campoEsperado] ||
                    ''
                );

            const datoNormalizadoCAJ =
                normalizarCampoCAJ(datoNuevoCAJ);

            const valoresInvalidosCAJ = new Set([
                '', 'usuario caj', 'por determinar',
                'sin asignar', 's/r', 'desconocido',
                'no aplica', 'pendiente'
            ]);

            // Para identificadores y fechas se mantiene la
            // interpretacion contextual y sus validaciones.
            const camposEstrictosCAJ = new Set([
                'usuario_rut',
                'fecha_nacimiento',
                'fecha_audiencia',
                'email',
                'ruc'
            ]);

            const extraccionNuevaCAJ =
                preguntaActivaCAJ &&
                !camposEstrictosCAJ.has(campoEsperado) &&
                !['requiere_aclaracion', 'no_relacionado']
                    .includes(interpretacion?.estado) &&
                !valoresInvalidosCAJ.has(datoNormalizadoCAJ) &&
                datoNormalizadoCAJ !==
                    normalizarCampoCAJ(valorAnteriorCAJ);

            const estadoContextualCAJ =
                interpretacionValida &&
                estadosComprensiblesCAJ.has(
                    interpretacion.estado
                )
                    ? interpretacion.estado
                    : null;

            const estadoRespuestaCAJ =
                estadoContextualCAJ ||
                (extraccionNuevaCAJ ? 'respondido' : null);

            const respuestaComprensibleCAJ =
                preguntaActivaCAJ &&
                Boolean(estadoRespuestaCAJ) &&
                String(mensaje.texto ?? '').trim().length > 0;

            console.log('[CAJ AVANCE] Diagnostico', {
                campo: campoEsperado,
                preguntaActiva: Boolean(preguntaActivaCAJ),
                interpretacionValida: Boolean(interpretacionValida),
                extraccionNueva: Boolean(extraccionNuevaCAJ),
                estado: estadoRespuestaCAJ || 'pendiente',
                avanzar: Boolean(respuestaComprensibleCAJ)
            });

            if (respuestaComprensibleCAJ) {
                entrevista.camposResueltos = [
                    ...new Set([
                        ...(entrevista.camposResueltos || []),
                        campoEsperado
                    ])
                ];

                entrevista.campoActual = null;

                console.log(
                    '[CAJ ENTREVISTA] Avance contextual',
                    {
                        campo: campoEsperado,
                        estado: interpretacion.estado
                    }
                );
            }

            mem.entrevista = entrevista;

            const extraidos = resultado.datos_extraidos || {};
            const asesor = await obtenerAsesor();
            const perfilSesion = await obtenerPerfilSesionCAJ(sessionId);

            const hechosPrevios = Array.isArray(mem.ficha.hechos) ? mem.ficha.hechos : [];
            const hechosNuevos = Array.isArray(extraidos.hechos) ? extraidos.hechos : [];
            const hechosUnificados = Array.from(new Set([...hechosPrevios, ...hechosNuevos].map(h => String(h || '').trim()).filter(Boolean)));

            mem.ficha = {
                // Conservar campos anteriores de la entrevista
                ...mem.ficha,
                usuario_nombre: elegirValorNoVacio(extraidos.usuario_nombre, mem.ficha.usuario_nombre, 'Usuario CAJ'),
                usuario_rut: elegirValorNoVacio(normalizarRUT(extraidos.usuario_rut), mem.ficha.usuario_rut, ''),
                // CAJ_CONSERVAR_TELEFONO_V7
                telefono: elegirValorNoVacio(
                    mem.telefono,
                    mem.ficha.telefono,
                    ''
                ),
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

            // CAJ_IA_CAMPOS_FICHA_V1
            // Integra datos provenientes de mensajes escritos o audios transcritos.
            const gruposIA = [
                'ficha_personal',
                'antecedentes_juridicos'
            ];

            for (const grupo of gruposIA) {
                const anteriores = mem.ficha[grupo] || {};
                const recibidos = extraidos[grupo] || {};

                if (
                    typeof recibidos !== 'object' ||
                    Array.isArray(recibidos)
                ) {
                    continue;
                }

                const consolidados = { ...anteriores };

                for (const [campo, valor] of Object.entries(recibidos)) {
                    // CAJ_ACLARACION_GENERAL_V1
                    // No consolidar el campo actual cuando
                    // la IA indica que falta informacion.
                    if (
                        !delAsesor &&
                        campo === campoEsperado &&
                        (
                            grupo === 'ficha_personal' ||
                            grupo === 'antecedentes_juridicos'
                        ) &&
                        interpretacion?.campo === campoEsperado &&
                        interpretacion?.estado === 'requiere_aclaracion'
                    ) {
                        continue;
                    }
                    if (
                        typeof valor === 'string' &&
                        valor.trim() !== ''
                    ) {
                        consolidados[campo] = valor.trim();
                    }
                }

                mem.ficha[grupo] = consolidados;
            }

            // CAJ_GUARDAR_RESPUESTA_FLEXIBLE_V1
            // Guardar la respuesta comprendida en su campo.
            // Conservar siempre los antecedentes existentes.
            if (respuestaComprensibleCAJ && campoEsperado) {
                const grupoRespuestaCAJ = personales.has(campoEsperado)
                    ? 'ficha_personal'
                    : juridicos.has(campoEsperado)
                        ? 'antecedentes_juridicos'
                        : null;

                if (grupoRespuestaCAJ) {
                    const valoresCAJ =
                        mem.ficha[grupoRespuestaCAJ] || {};

                    const anteriorCAJ = String(
                        valoresCAJ[campoEsperado] ?? ''
                    ).trim();

                    let respuestaParaGuardarCAJ = '';

                    if (estadoRespuestaCAJ === 'no_aplica') {
                        respuestaParaGuardarCAJ = 'No aplica';
                    } else if (
                        estadoRespuestaCAJ === 'desconocido'
                    ) {
                        respuestaParaGuardarCAJ = 'Desconocido';
                    } else {
                        respuestaParaGuardarCAJ =
                            (interpretacionValida ? valorInterpretado : '') ||
                            datoNuevoCAJ ||
                            String(mensaje.texto ?? '').trim();
                    }

                    if (
                        !anteriorCAJ &&
                        respuestaParaGuardarCAJ
                    ) {
                        mem.ficha[grupoRespuestaCAJ] = {
                            ...valoresCAJ,
                            [campoEsperado]: respuestaParaGuardarCAJ
                        };
                    }

                    entrevista.estadosRespuestas = {
                        ...(entrevista.estadosRespuestas || {}),
                        [campoEsperado]: estadoRespuestaCAJ
                    };
                }
            }

            let expedienteActivo = null;

            if (mem.expedienteId) {
                const casoActivo = await obtenerCaso(mem.expedienteId);

                if (!casoActivo) {
                    throw new Error(
                        'El expediente activo no existe. Se bloquea la asociación automática.'
                    );
                }

                if (casoActivo.propietario_uid !== perfilSesion.uid) {
                    throw new Error(
                        'Expediente activo pertenece a otro propietario.'
                    );
                }

                expedienteActivo = casoActivo.id;
            } else {
                // Cada causa nueva recibe su propio identificador.
                // No se reutiliza automaticamente el RUT o telefono.
                expedienteActivo = `CAUSA_${require('node:crypto').randomUUID()}`;
            }

            const casoGuardado = await guardarCaso({
                ...mem.ficha,
                id_expediente_forzado: expedienteActivo,
                propietario_uid: perfilSesion.uid,
                postulante_id: perfilSesion.postulante_id || mem.ficha.postulante_id,
                canal: 'whatsapp',
                ia_activa: !mem.pausado && !delAsesor,
                estado_atencion: mem.entrevista?.finalizada
                    ? 'entrevista_finalizada'
                    : (mem.pausado || delAsesor)
                        ? 'relevo_asesor_humano'
                        : 'en_indagacion_ia',
                historial_whatsapp: mem.historial
            });

            if (casoGuardado && casoGuardado.id) {
                mem.expedienteId = casoGuardado.id;
            }
            await persistirEnFirestore(jid);
        },

        // ====================================================
        // DOCUMENTOS PROBATORIOS RECIBIDOS POR WHATSAPP
        // ====================================================

        async obtenerExpedienteParaDocumento(jid) {
            const mem = await cargarDesdeFirestore(jid);

            const perfilSesion = await obtenerPerfilSesionCAJ(sessionId);
            let caso = mem.expedienteId && coleccionCasos
                ? await obtenerCaso(mem.expedienteId)
                : null;
            if (caso && caso.propietario_uid !== perfilSesion.uid) {
                throw new Error('Documento bloqueado: expediente de otro propietario');
            }


            if (!caso) {
                // Los identificadores @lid no son números
                // telefónicos verificables.
                // No asociar documentos por coincidencias
                // de un identificador LID con un teléfono.
                if (String(jid).endsWith('@lid')) {
                    throw new Error(
                        'El chat utiliza un identificador LID sin expediente previamente asociado. Se requiere verificar la vinculacion antes de guardar documentos.'
                    );
                }

                caso = await buscarCasoPorTelefono(mem.telefono, perfilSesion.uid);
            }

            if (!caso || !caso.id) {

                throw new Error(
                    'No existe un expediente identificado para este chat'
                );
            }

            mem.expedienteId = caso.id;
            await persistirEnFirestore(jid);

            return caso.id;
        },

        async registrarDocumento(jid, documento) {
            if (!coleccionCasos) {
                throw new Error('Firestore no configurado');
            }

            if (
                !documento ||
                !documento.id_archivo ||
                !documento.storage_path
            ) {
                throw new Error('Datos del documento incompletos');
            }

            const expedienteId =
                await this.obtenerExpedienteParaDocumento(jid);

            const referencia = coleccionCasos.doc(expedienteId);

            await db.runTransaction(async transaccion => {
                const snapshot = await transaccion.get(referencia);

                if (!snapshot.exists) {
                    throw new Error('El expediente ya no existe');
                }

                const datos = snapshot.data() || {};

                const documentos = Array.isArray(
                    datos.documentos_probatorios
                )
                    ? [...datos.documentos_probatorios]
                    : [];

                const indice = documentos.findIndex(
                    item => item &&
                        item.id_archivo === documento.id_archivo
                );

                if (indice >= 0) {
                    documentos[indice] = {
                        ...documentos[indice],
                        ...documento
                    };
                } else {
                    documentos.push(documento);
                }

                transaccion.update(referencia, {
                    documentos_probatorios: documentos,
                    actualizadoEn: new Date(),
                    fecha_actualizacion: new Date()
                });
            });

            console.log(
                `[CAJ DOCUMENTOS] Documento registrado en expediente ${expedienteId}`
            );

            return {
                expedienteId,
                documentoId: documento.id_archivo,
                registrado: true
            };
        },



        // CAJ_REGISTRO_CAMPO_PREGUNTADO_V1
        async registrarCampoPreguntado(jid, campo) {
            const { PREGUNTAS_PERSONALES } = require('./entrevista_caj');

            const permitido =
                PREGUNTAS_PERSONALES.some(
                    item => item[0] === campo
                ) ||
                [
                    'existeCausaJudicial',
                    'consulta_juridica',
                    'relato_hechos',
                    'contraparte_nombre',
                    'objetivo_consulta',
                    'numero_causa',
                    'tribunal',
                    'calidad_procesal',
                    'estado_procesal',
                    'fecha_audiencia',
                    'ruc'
                ].includes(campo);

            if (!permitido) {
                throw new Error('Campo de entrevista no reconocido');
            }

            const mem = await cargarDesdeFirestore(jid);

            mem.entrevista = {
                ...mem.entrevista,
                campoActual: campo
            };

            // CAJ_CONFIRMAR_CAMPO_PREGUNTADO_V1
            await persistirEnFirestore(jid, true);
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

                // CAJ_CONFIRMACION_CIERRE_V1
                const textoNormalizado = String(textoRespuesta)
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .toLowerCase();

                if (
                    textoNormalizado.includes(
                        'tiene algun antecedente adicional que desee agregar a su consulta'
                    )
                ) {
                    mem.entrevista = {
                        ...mem.entrevista,
                        fase: 'esperando_confirmacion',
                        cierre_preguntado: true,
                        finalizada: false,
                        esperandoDetalleAdicional: false,
                        campoActual: null
                    };
                }
                if (mem.expedienteId && coleccionCasos) {
                    const perfilSesion = await obtenerPerfilSesionCAJ(sessionId);
                    await guardarCaso({
                        ...mem.ficha,
                        propietario_uid: perfilSesion.uid,
                        id_expediente_forzado: mem.expedienteId,
                        canal: 'whatsapp',
                        estado_atencion: mem.entrevista?.finalizada === true
                            ? 'entrevista_finalizada'
                            : mem.pausado
                                ? 'relevo_asesor_humano'
                                : 'en_indagacion_ia',
                        historial_whatsapp: mem.historial
                    }).catch(error => {
                        console.error(
                            '[CAJ] Error al guardar salida en expediente:',
                            error
                        );
                    });
                }
            }
            await persistirEnFirestore(jid);
        }
    };
}


// CAJ_GUARDAR_MAPEO_LID_V3
// Conserva únicamente asociaciones telefónicas explícitas de WhatsApp.
// No busca ni modifica expedientes jurídicos.
async function registrarMapeoLidTelefonoCAJ(sessionId, jid, telefono) {
    if (!coleccionConversaciones) {
        throw new Error('Firestore no disponible');
    }

    if (
        !/^[a-zA-Z0-9_-]+$/.test(String(sessionId)) ||
        !/^\d+@lid$/.test(String(jid)) ||
        !/^\d{8,15}$/.test(String(telefono))
    ) {
        throw new Error('Identificadores de WhatsApp invalidos');
    }

    const ref = coleccionConversaciones.doc(`${sessionId}_${jid}`);

    await db.runTransaction(async tx => {
        const snap = await tx.get(ref);
        const anterior = snap.exists ? snap.data() : {};

        if (
            anterior.sessionId &&
            anterior.sessionId !== sessionId
        ) {
            throw new Error('Sesion de conversacion no coincide');
        }

        const conocido = anterior.telefono_verificado || '';

        if (conocido && conocido !== telefono) {
            throw new Error(
                'Conflicto LID-telefono: asociacion diferente'
            );
        }

        tx.set(ref, {
            jid,
            sessionId,
            telefono_verificado: telefono,
            fuente_telefono: 'remoteJidAlt',
            telefono_verificado_en: new Date()
        }, { merge: true });
    });

    return true;
}
module.exports = {
    db,
    storageBucket,
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
    registrarMapeoLidTelefonoCAJ,
    crearRepositorioWhatsAppFirebase
};