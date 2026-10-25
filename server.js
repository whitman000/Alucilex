require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');
const multer = require('multer');
const { getAuth } = require('firebase-admin/auth');

// Configuración de Multer para recibir adjuntos en memoria
const upload = multer({ 
    storage: multer.memoryStorage(), 
    limits: { fileSize: 15 * 1024 * 1024 } 
});

// Módulos CAJ: Base de Datos Firebase, Procesador de Documentos y Motor Jurídico
const { 
    guardarCaso, 
    listarCasos, 
    actualizarCaso,
    actualizarDictamenYEscrito, 
    guardarPostulante, 
    listarPostulantes, 
    buscarPostulantePorTelefono,
    validarAccesoPostulante,
    db: dbFirestore 
} = require('./firebase_caj');

const { obtenerPerfilUsuario } = require('./usuarios_auth_caj');
const { generarInformeJuridico, confeccionarEscritoJudicial } = require('./motor_caj');
const { analizarDocumento, guardarDocumentoEnCaso } = require('./procesador_documentos');
const {
    iniciarSesion,
    obtenerEstadoSesion,
    desconectarSesion,
    enviarMensaje,
    activarIAEnChat,
    obtenerOCrearControl
} = require('./whatsapp_caj');

// Importar los bancos estáticos de Alucilex
const bancoPreguntasAlucilex = require('./banco_preguntas.js');
const bancoArticulosAlucilex = require('./banco_articulos.js');

const app = express();
app.use(cors());
app.use(express.json());

// ============================================
// CAJ - VERIFICACION FIREBASE AUTHENTICATION
// ============================================

async function verificarIdentidadFirebase(req, res, next) {
    try {
        const authorization = req.headers.authorization || '';

        if (!authorization.startsWith('Bearer ')) {
            return res.status(401).json({
                ok: false,
                error: 'Token de autenticacion requerido'
            });
        }

        const token = authorization.slice(7).trim();

        if (!token) {
            return res.status(401).json({
                ok: false,
                error: 'Token vacio'
            });
        }

        const usuario = await getAuth().verifyIdToken(token, true);

        req.usuarioFirebase = {
            uid: usuario.uid,
            email: usuario.email || ''
        };

        next();

    } catch (error) {
        console.error('[CAJ AUTH] Token rechazado:', error.code || error.message);

        return res.status(401).json({
            ok: false,
            error: 'Autenticacion invalida o expirada'
        });
    }
}
// ============================================
// CAJ - PRUEBA DE IDENTIDAD FIREBASE
// ============================================

app.get('/api/caj/auth/verificar', verificarIdentidadFirebase, (req, res) => {
    res.json({
        ok: true,
        autenticado: true,
        uid: req.usuarioFirebase.uid
    });
});

app.get('/api/caj/auth/perfil', verificarIdentidadFirebase, async (req, res) => {
    try {
        const perfil = await obtenerPerfilUsuario(req.usuarioFirebase.uid);

        if (!perfil || perfil.activo !== true) {
            return res.status(403).json({
                ok: false,
                error: 'Perfil inexistente o inactivo'
            });
        }

        const roles = Array.isArray(perfil.roles)
            ? perfil.roles.filter(rol =>
                ['coordinador', 'asesor'].includes(rol)
              )
            : [];

        if (roles.length === 0) {
            return res.status(403).json({
                ok: false,
                error: 'Usuario sin roles autorizados'
            });
        }

        return res.json({
            ok: true,
            usuario: {
                uid: req.usuarioFirebase.uid,
                nombre: perfil.nombre || '',
                roles,
                sessionIdWhatsApp: perfil.sessionIdWhatsApp || null
            }
        });

    } catch (error) {
        console.error('[CAJ AUTH PERFIL]', error.message);
        return res.status(500).json({
            ok: false,
            error: 'Error al consultar identidad'
        });
    }
});

// Servir únicamente archivos públicos conocidos; nunca credenciales ni sesiones.
const archivosPublicos = new Set([
    '/alucilex.html',
    '/caj_dashboard.html',
    '/escrituras.html',
    '/motor_escrituras.js',
    '/privacidad.html',
    '/firebase_auth_caj.js'
]);
app.use((req, res, next) => {
    if ((req.method === 'GET' || req.method === 'HEAD') && archivosPublicos.has(req.path)) {
        return res.sendFile(path.join(__dirname, req.path.slice(1)));
    }
    next();
});

// === MARCAPASOS: REGISTRO DE PING EN RENDER ===
app.get('/', (req, res) => {
    console.log('💓 [MARCAPASOS] Latido recibido desde Google. Servidor 100% despierto.');
    res.status(200).send('OK');
});

app.get('/ping', (req, res) => {
    res.status(200).send('OK');
});

// Etapa de pruebas: el control QR solo se admite desde el computador del servidor o entorno autorizado.
app.use('/api/caj/whatsapp/qr', (req, res, next) => {
    const ip = req.socket.remoteAddress;
    if (process.env.ALLOW_REMOTE_QR !== 'true' && !['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(ip)) {
        return res.status(403).json({ ok: false, error: 'QR en prueba local. Falta habilitar acceso remoto autenticado.' });
    }
    next();
});

let supabase = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
        supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
        app.set('supabase', supabase);
    } catch (e) {
        console.warn('⚠️ Supabase omitido:', e.message);
    }
}

// Cliente OpenRouter con headers requeridos para activar la IA en producción
const openai = new OpenAI({ 
    apiKey: process.env.OPENROUTER_API_KEY || 'sk-or-v1-placeholder', 
    baseURL: 'https://openrouter.ai/api/v1',
    defaultHeaders: {
        'HTTP-Referer': process.env.RENDER_EXTERNAL_URL || 'https://alucilex.onrender.com',
        'X-Title': 'Alucilex - Consultor Juridico y CAJ'
    }
});

const cacheRespuestas = new Map();
const cacheEmbeddings = new Map();
const conversaciones = new Map();
const TTL_RESPUESTA = 3600000;
const MAX_HISTORIAL = 10;

// ========== DICCIONARIO DE ORO ==========
const diccionarioOro = {
    "ley": 1, "costumbre": 2, "renuncia de los derechos": 12, "efectos territoriales": 14,
    "interpretacion de la ley": 19, "dolo": 44, "culpa": 44, "fuerza mayor": 45,
    "caso fortuito": 45, "cauciones": 46, "presunciones": 47, "persona natural": 55,
    "domicilio civil": 59, "pluralidad de domicilios": 67, "nasciturus": 74,
    "existencia legal": 74, "presuncion de concepcion": 76, "muerte presunta": 80,
    "esponsales": 98, "matrimonio": 102, "sociedad conyugal": 135, "bienes familiares": 141,
    "patrimonio reservado": 150, "separacion total de bienes": 152, "filiacion": 186,
    "patria potestad": 243, "estado civil": 304, "derecho de alimentos": 321,
    "tutelas": 338, "curadurias": 338, "persona juridica": 545, "bienes corporales": 565,
    "bienes muebles": 567, "bienes inmuebles": 568, "muebles por anticipacion": 571,
    "cosas incorporales": 576, "derechos reales": 577, "derechos personales": 578,
    "creditos": 578, "dominio": 582, "propiedad": 582, "modos de adquirir el dominio": 588,
    "ocupacion": 606, "accesion": 643, "tradicion": 670, "reserva de dominio": 680,
    "inscripcion conservatoria": 686, "posesion": 700, "posesion regular": 702,
    "buena fe subjetiva": 706, "posesion irregular": 708, "posesion violenta": 710,
    "posesion clandestina": 713, "mero tenedor": 714, "mera tenencia": 714,
    "fideicomiso": 733, "propiedad fiduciaria": 733, "usufructo": 764,
    "derecho de uso": 811, "derecho de habitacion": 811, "servidumbre": 820,
    "posesion efectiva": 877, "accion reivindicatoria": 889, "acciones posesorias": 916,
    "denuncia de obra nueva": 930, "accion de obra ruinosa": 932,
    "sucesion por causa de muerte": 951, "asignaciones por causa de muerte": 953,
    "apertura de la sucesion": 955, "delacion": 956, "indignidad": 968,
    "sucesion intestada": 980, "derecho de representacion": 984, "testamento": 999,
    "asignaciones forzosas": 1167, "cuarta de mejoras": 1184, "acervos imaginarios": 1185,
    "desheredamiento": 1207, "lesion en la aceptacion de herencia": 1234,
    "herencia yacente": 1241, "beneficio de inventario": 1247, "albacea": 1270,
    "particion": 1317, "lesion en la particion": 1348, "beneficio de separacion": 1378,
    "fuentes de las obligaciones": 1437, "contrato": 1438, "convencion": 1438,
    "elementos del contrato": 1444, "capacidad": 1445, "representacion": 1448,
    "estipulacion a favor de otro": 1449, "promesa de hecho ajeno": 1450,
    "vicios del consentimiento": 1451, "error": 1452, "error de hecho": 1453,
    "error obstaculo": 1453, "error sustancial": 1454, "error en calidades accidentales": 1454,
    "error en la persona": 1455, "fuerza": 1456, "fuerza moral": 1456,
    "fuerza por tercero": 1457, "dolo determinante": 1458, "presuncion de dolo": 1459,
    "objeto": 1460, "cosa futura": 1461, "objeto ilicito": 1464,
    "condonacion de dolo futuro": 1465, "contratos prohibidos por ley": 1466,
    "causa": 1467, "causa ilicita": 1467, "obligaciones naturales": 1470,
    "obligaciones condicionales": 1473, "condicion resolutoria tacita": 1489,
    "obligaciones a plazo": 1494, "obligaciones de genero": 1508,
    "obligaciones solidarias": 1511, "solidaridad pasiva": 1511, "clausula penal": 1535,
    "clausula penal enorme": 1544, "fuerza obligatoria": 1545,
    "ley para los contratantes": 1545, "ejecucion de buena fe": 1546,
    "obligacion de entregar": 1548, "mora": 1551, "excepcion de contrato no cumplido": 1552,
    "obligaciones de hacer": 1553, "promesa": 1554, "obligaciones de no hacer": 1555,
    "indemnizacion de perjuicios": 1556, "intereses moratorios": 1559,
    "interpretacion de los contratos": 1560, "resciliacion": 1567, "mutuo disenso": 1567,
    "pago efectivo": 1568, "imputacion del pago": 1595, "pago por consignacion": 1599,
    "pago con subrogacion": 1608, "subrogacion legal": 1610, "beneficio de competencia": 1625,
    "novacion": 1628, "remision": 1652, "compensacion": 1655, "confusion": 1665,
    "perdida de la cosa que se debe": 1670, "nulidad absoluta": 1681, "nulidad relativa": 1681,
    "carga de la prueba": 1698, "instrumento publico": 1699, "simulacion": 1707,
    "contraescrituras": 1707, "regimenes patrimoniales": 1715, "capitulaciones matrimoniales": 1715,
    "haber de la sociedad conyugal": 1725, "donaciones remuneratorias": 1738,
    "presuncion de dominio de la sociedad conyugal": 1739, "participacion en los gananciales": 1792,
    "compraventa": 1793, "arras": 1803, "venta de cosa ajena": 1815,
    "venta con relacion a la cabida": 1831, "saneamiento de la eviccion": 1837,
    "eviccion parcial": 1854, "vicios redhibitorios": 1857, "accion estimatoria": 1868,
    "quanti minoris": 1868, "pacto comisorio": 1877, "pacto comisorio calificado": 1879,
    "pacto de retroventa": 1881, "pacto de retracto": 1886, "lesion enorme": 1889,
    "lesion enorme en la permuta": 1900, "cesion de derechos": 1901,
    "cesion de derecho de herencia": 1909, "arrendamiento": 1915,
    "arrendamiento de transporte": 2013, "sociedad": 2053, "mandato": 2116,
    "delegacion del mandato": 2135, "comodato": 2174, "prestamo de uso": 2174,
    "action de precario": 2195, "mutuo": 2196, "prestamo de consumo": 2196,
    "deposito": 2211, "deposito propiamente dicho": 2215, "secuestro": 2249,
    "renta vitalicia": 2259, "juego y apuesta": 2264, "censo vitalicio": 2279,
    "cuasicontratos": 2284, "agencia oficiosa": 2286, "pago de lo no debido": 2295,
    "comunidad": 2304, "responsabilidad extracontractual": 2314,
    "solidaridad extracontractual": 2317, "capacidad extracontractual": 2319,
    "responsabilidad por el hecho ajeno": 2320, "ruina de edificio": 2323,
    "presuncion de culpabilidad": 2329, "exposicion imprudente al daño": 2330,
    "fianza": 2336, "accion de reembolso": 2370, "prenda": 2384, "hipoteca": 2407,
    "hipoteca de cuota": 2417, "hipoteca sobre bienes futuros": 2419, "transaccion": 2446,
    "derecho de prenda general": 2465, "accion oblicua": 2466, "accion pauliana": 2468,
    "accion revocatoria": 2468, "prelacion de creditos": 2469, "prescripcion": 2492
};

function hashTexto(texto) {
    return crypto.createHash('sha256').update(texto).digest('hex');
}

function buscarEnDiccionario(texto) {
    const textoNormalizado = texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const clavesOrdenadas = Object.keys(diccionarioOro).sort((a, b) => b.length - a.length);
    for (const concepto of clavesOrdenadas) {
        const articulo = diccionarioOro[concepto];
        const regex = new RegExp(`\\b${concepto.replace(/\\s+/g, '\\s+')}\\b`, 'i');
        if (regex.test(textoNormalizado)) return articulo;
    }
    return null;
}

// ============================================================
// CONSULTOR JURÍDICO CIVIL (Alucilex Core)
// ============================================================

app.post('/api/consultar', async (req, res) => {
    const { pregunta, sessionId } = req.body;
    if (!pregunta) return res.status(400).json({ error: "Pregunta vacía" });

    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    try {
        const systemPrompt = "Eres Alucilex, Catedrático Titular de Derecho Civil en Chile. Responde con rigor doctrinal magistral.";
        const stream = await openai.chat.completions.create({
            model: "deepseek/deepseek-chat",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: pregunta }
            ],
            temperature: 0.6,
            max_tokens: 4000,
            stream: true,
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
    } catch (err) {
        res.write(`data: ${JSON.stringify({ content: "\n\n❌ Error al conectar con el motor Alucilex." })}\n\n`);
    }

    res.write('data: [DONE]\n\n');
    res.end();
});

app.post('/api/quiz/generar', async (req, res) => {
    try {
        const total = bancoPreguntasAlucilex.length;
        const index = Math.floor(Math.random() * total);
        const pData = bancoPreguntasAlucilex[index];
        const aData = bancoArticulosAlucilex[0] || {};

        res.json({
            articulo: aData,
            pregunta: pData.pregunta,
            opciones: pData.opciones,
            correcta: pData.correcta,
            explicacion: pData.explicacion,
            total
        });
    } catch (error) {
        res.status(500).json({ error: 'Error interno en quiz.' });
    }
});

// Enrutador de escrituras públicas
try {
    const escriturasRouter = require('./escrituras.js');
    app.use('/api', escriturasRouter);
} catch (e) {
    console.log("Módulo escrituras omitido o cargado independientemente.");
}

// ============================================================
// CAJ_API_PROTEGIDA_V1
app.use('/api/caj', verificarIdentidadFirebase, async (req, res, next) => {
    try {
        const { obtenerPerfilUsuario, tieneRol } =
            require('./usuarios_auth_caj');

        const perfil = await obtenerPerfilUsuario(req.usuarioFirebase.uid);

        if (!perfil || perfil.activo !== true) {
            return res.status(403).json({
                ok: false,
                error: 'Perfil inactivo o no vinculado'
            });
        }

        if (!tieneRol(perfil, 'coordinador') &&
            !tieneRol(perfil, 'asesor')) {
            return res.status(403).json({
                ok: false,
                error: 'Sin permisos CAJ'
            });
        }

        req.perfilCAJ = perfil;

        // Acceso conservador mientras se implementa la
        // propiedad y colaboracion de expedientes por asesor.
        if (!tieneRol(perfil, 'coordinador') &&
            !((req.method === 'GET' && req.path === '/casos') ||
              (req.method === 'GET' && /^\/whatsapp\/qr\/estado\/[^/]+$/.test(req.path)) ||
              // CAJ_QR_ASESORES_73
              (req.method === 'POST' &&
               ['/whatsapp/qr/iniciar', '/whatsapp/qr/desconectar', '/whatsapp/enviar', '/whatsapp/ia/activar', '/whatsapp/ia/control'].includes(req.path)) ||
              (req.method === 'POST' && ['/nuevo', '/caso'].includes(req.path)) ||
              (['PUT', 'DELETE'].includes(req.method) && /^\/casos\/[^/]+(?:\/adjuntos\/[^/]+)?$/.test(req.path)) ||
              (req.method === 'POST' && /^\/(procesar|adjuntos)\/[^/]+$/.test(req.path)))) {
            return res.status(403).json({
                ok: false,
                error: 'Operacion pendiente de autorizacion individual'
            });
        }

        // No permitir operar sobre sesiones WhatsApp ajenas.
        if (req.path === '/whatsapp/qr/iniciar' ||
            req.path === '/whatsapp/qr/desconectar') {

            if (typeof req.body?.sessionId !== 'string' ||
                !req.body.sessionId.trim()) {
                return res.status(400).json({
                    ok: false,
                    error: 'Debe indicar su sesion WhatsApp'
                });
            }
        }
        if (req.path.startsWith('/whatsapp/')) {
            const solicitada =
                req.body?.sessionId ||
                req.params?.sessionId ||
                (req.path.startsWith('/whatsapp/qr/estado/')
                    ? decodeURIComponent(
                        req.path.slice('/whatsapp/qr/estado/'.length)
                      )
                    : perfil.sessionIdWhatsApp);

            if (!perfil.sessionIdWhatsApp ||
                solicitada !== perfil.sessionIdWhatsApp) {
                return res.status(403).json({
                    ok: false,
                    error: 'Sesion WhatsApp no autorizada'
                });
            }
        }

        next();
    } catch (error) {
        console.error('[CAJ SEGURIDAD]', error.message);
        return res.status(503).json({
            ok: false,
            error: 'No fue posible verificar los permisos'
        });
    }
});

// RUTAS MESA DE TRABAJO JURÍDICA CAJ (Firebase + OpenRouter)
// ============================================================

// CAJ_CONTROL_PROPIEDAD_2753
// Proteger operaciones individuales sobre expedientes.
app.use([
    '/api/caj/procesar/:id',
    '/api/caj/adjuntos/:id',
    '/api/caj/casos/:id'
], async (req, res, next) => {
    try {
        if (!req.usuarioFirebase?.uid) {
            return res.status(401).json({
                ok: false,
                error: 'Autenticacion requerida'
            });
        }

        const {
            puedeAdministrarExpediente
        } = require('./permisos_expedientes_caj');

        const id = req.params.id;

        if (!id || id.includes('/')) {
            return res.status(400).json({
                ok: false,
                error: 'Identificador invalido'
            });
        }

        const doc = await dbFirestore
            .collection('casos_caj')
            .doc(id)
            .get();

        if (!doc.exists) {
            return res.status(404).json({
                ok: false,
                error: 'Expediente no disponible'
            });
        }

        const caso = doc.data();

        if (!puedeAdministrarExpediente(
            caso,
            req.usuarioFirebase.uid
        )) {
            return res.status(404).json({
                ok: false,
                error: 'Expediente no disponible'
            });
        }

        // Los campos de autorizacion no pueden modificarse
        // a traves del formulario general del expediente.
        if (req.method === 'PUT') {
            const camposProtegidos = [
                'propietario_uid',
                'colaboradores_uids',
                'postulante_id',
                'firebase_uid'
            ];

            const cuerpo = req.body || {};

            if (camposProtegidos.some(campo =>
                Object.prototype.hasOwnProperty.call(cuerpo, campo)
            )) {
                return res.status(403).json({
                    ok: false,
                    error: 'No puede modificar campos de autorizacion'
                });
            }
        }

        next();

    } catch (error) {
        console.error(
            '[CAJ CONTROL PROPIEDAD]',
            error.message
        );

        return res.status(500).json({
            ok: false,
            error: 'No fue posible verificar el expediente'
        });
    }
});

// CAJ_PROTECCION_CREACION_2758
async function protegerCreacionCasoCAJ(req, res, next) {
    try {
        const uid = req.usuarioFirebase?.uid;

        if (!uid || !req.perfilCAJ) {
            return res.status(401).json({
                ok: false,
                error: 'Identidad CAJ requerida'
            });
        }

        const {
            normalizarRUT,
            normalizarTelefono
        } = require('./firebase_caj');

        const datos = req.body || {};

        const rut = normalizarRUT(
            datos.usuario_rut ||
            datos.rut ||
            datos.rut_titular ||
            datos.usuario?.rut
        );

        const telefono = normalizarTelefono(
            datos.telefono ||
            datos.telefono_contacto ||
            datos.usuario?.telefono
        );

        // No permitir que el cliente determine propiedad,
        // colaboradores o identificadores internos.
        const camposProhibidos = [
            'propietario_uid',
            'colaboradores_uids',
            'id_expediente_forzado'
        ];

        if (camposProhibidos.some(campo =>
            Object.prototype.hasOwnProperty.call(datos, campo)
        )) {
            return res.status(403).json({
                ok: false,
                error: 'Campos internos no autorizados'
            });
        }

        // CAJ_AISLAMIENTO_FINAL: la selección del documento y las colisiones
        // se verifican en guardarCaso mediante transaccion Firestore.
        req.body = {
            ...datos,
            propietario_uid: uid,
            postulante_id: req.perfilCAJ.postulante_id || 'sin_asignar'
        };

        next();

    } catch (error) {
        console.error('[CAJ CREACION]', error.message);

        return res.status(500).json({
            ok: false,
            error: 'Error verificando propiedad del expediente'
        });
    }
}

// 1. Obtener todos los casos
app.get('/api/caj/casos', async (req, res) => {
    try {
        // CAJ_AISLAMIENTO_2751
        const todos = await listarCasos();
        const { puedeAccederExpediente } =
            require('./permisos_expedientes_caj');

        const casos = todos.filter(caso =>
            puedeAccederExpediente(caso, req.usuarioFirebase.uid)
        );

        res.json({ ok: true, casos });
    } catch (e) {
        res.status(500).json({ ok: false, error: e.message });
    }
});

// 2. Ingresar nueva causa anclada al RUT maestro (y habilitar en lista IA si trae teléfono)
app.post('/api/caj/nuevo', protegerCreacionCasoCAJ, async (req, res) => {
    try {
        const resultado = await guardarCaso(req.body);
        const fono = req.body.telefono || req.body.telefono_contacto || req.body.usuario?.telefono;
        if (fono && req.body.activar_ia_whatsapp !== false) {
            await activarIAEnChat(req.perfilCAJ.sessionIdWhatsApp, fono, true, false).catch(() => {});
        }
        console.log(`✅ Causa procesada con éxito (ID: ${resultado.id})`);
        res.json({ ok: true, id: resultado.id, caso: resultado });
    } catch (error) {
        console.error('Error al crear causa:', error);
        res.status(500).json({ ok: false, error: error.message });
    }
});

// Alias compatible para creación
app.post('/api/caj/caso', protegerCreacionCasoCAJ, async (req, res) => {
    try {
        const resultado = await guardarCaso(req.body);
        const fono = req.body.telefono || req.body.telefono_contacto || req.body.usuario?.telefono;
        if (fono && req.body.activar_ia_whatsapp !== false) {
            await activarIAEnChat(req.perfilCAJ.sessionIdWhatsApp, fono, true, false).catch(() => {});
        }
        res.json({ ok: true, caso: resultado, id: resultado.id });
    } catch (e) {
        res.status(500).json({ ok: false, error: e.message });
    }
});

// 3. Procesar caso: genera Matriz Forense en 4 Fases y Demanda OJV
app.post('/api/caj/procesar/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { tipoEscrito } = req.body;

        const docSnap = await dbFirestore.collection('casos_caj').doc(id).get();
        if (!docSnap.exists) {
            return res.status(404).json({ ok: false, error: 'Expediente no encontrado' });
        }

        const caso = { id, ...docSnap.data() };
        console.log(`⚖️ Ejecutando Matriz Forense para expediente ${id}...`);
        const informe = await generarInformeJuridico(caso);

        console.log(`📝 Confeccionando escrito formal OJV (${tipoEscrito || 'Demanda'})...`);
        const escrito = await confeccionarEscritoJudicial(caso, tipoEscrito || 'Demanda', informe);

        await actualizarDictamenYEscrito(id, informe, escrito);

        res.json({ ok: true, informe, escrito });
    } catch (e) {
        console.error("❌ Error al procesar caso CAJ:", e.message);
        res.status(500).json({ ok: false, error: e.message });
    }
});

// 4. Recepción de documentos adjuntos (PDFs o Imágenes)
app.post('/api/caj/adjuntos/:id', upload.any(), async (req, res) => {
    try {
        const { id } = req.params;
        const archivo = req.file || (req.files && req.files[0]);

        if (!archivo) {
            return res.status(400).json({ ok: false, error: 'No se recibió ningún archivo' });
        }

        console.log(`📎 Recibido archivo '${archivo.originalname}' (${archivo.mimetype}) para expediente ${id}`);
        const infoDoc = await analizarDocumento(archivo.buffer, archivo.mimetype, archivo.originalname);
        const resultado = await guardarDocumentoEnCaso(id, infoDoc);

        res.json({ ok: true, resultado });
    } catch (error) {
        console.error('Error al procesar adjunto:', error);
        res.status(500).json({ ok: false, error: error.message });
    }
});

// 5. Eliminar adjunto de un caso
app.delete('/api/caj/casos/:id/adjuntos/:index', async (req, res) => {
    try {
        const { id, index } = req.params;
        const idx = parseInt(index, 10);
        
        const docRef = dbFirestore.collection('casos_caj').doc(id);
        const docSnap = await docRef.get();
        if (!docSnap.exists) {
            return res.status(404).json({ ok: false, error: 'Expediente no encontrado' });
        }

        const data = docSnap.data();
        let adjuntos = data.documentos_probatorios || [];

        if (idx >= 0 && idx < adjuntos.length) {
            adjuntos.splice(idx, 1);
            await docRef.update({ documentos_probatorios: adjuntos });
            return res.json({ ok: true, mensaje: 'Documento eliminado', documentos_probatorios: adjuntos });
        } else {
            return res.status(400).json({ ok: false, error: 'Índice de documento no válido' });
        }
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
});

// 6. Eliminar expediente completo
app.delete('/api/caj/casos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await dbFirestore.collection('casos_caj').doc(id).delete();
        res.json({ ok: true, mensaje: 'Expediente eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
});

// 7. Modificar expediente
app.put('/api/caj/casos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await actualizarCaso(id, req.body);
        res.json({ ok: true, mensaje: 'Expediente actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
});

// 8. Rutas de nómina y postulantes
// CAJ_REGISTRO_ASESORES_V2 - solo coordinadores; alta pendiente sin credenciales.
function exigirCoordinadorCAJ(req, res, next) {
    const { tieneRol } = require('./usuarios_auth_caj');
    if (!tieneRol(req.perfilCAJ, 'coordinador')) {
        return res.status(403).json({ ok: false, error: 'Solo coordinacion puede gestionar asesores' });
    }
    next();
}

app.get('/api/caj/postulantes', exigirCoordinadorCAJ, async (req, res) => {
    try {
        const postulantes = await listarPostulantes();
        // Nunca exponer PINs antiguos ni campos internos de autenticacion.
        const visibles = postulantes.filter(p => p.activo === true && !p.duplicado_de).map(p => ({
            id: p.id, nombre: p.nombre || '', rut: p.rut || '',
            telefono: p.telefono || '', email: p.email || '',
            activo: p.activo === true, rol: p.rol || 'asesor',
            estado_vinculacion: p.estado_vinculacion || (p.firebase_uid ? 'vinculado' : 'pendiente')
        }));
        res.json({ ok: true, postulantes: visibles });
    } catch (error) {
        res.status(500).json({ ok: false, error: 'Error consultando asesores' });
    }
});

app.post('/api/caj/postulantes', exigirCoordinadorCAJ, async (req, res) => {
    try {
        const d = req.body || {};
        const nombre = typeof d.nombre === 'string' ? d.nombre.trim() : '';
        const rut = typeof d.rut === 'string' ? d.rut.trim() : '';
        const email = typeof d.email === 'string' ? d.email.trim().toLowerCase() : '';
        const { normalizarTelefono, normalizarRUT } = require('./firebase_caj');
        const telefono = normalizarTelefono(d.telefono);
        if (nombre.length < 3 || nombre.length > 120 ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 ||
            !/^569\d{8}$/.test(telefono) || (rut && !normalizarRUT(rut))) {
            return res.status(400).json({ ok: false, error: 'Revise nombre, RUT, correo y WhatsApp' });
        }
        if ('pin' in d || 'firebase_uid' in d || 'roles' in d || 'activo' in d) {
            return res.status(403).json({ ok: false, error: 'Campos reservados no permitidos' });
        }
        const coleccion = dbFirestore.collection('postulantes_caj');
        // Verificar cuentas existentes: el alta NO fusiona identidades.
        const [porEmail, porTelefono] = await Promise.all([
            coleccion.where('email', '==', email).limit(1).get(),
            coleccion.where('telefono', '==', telefono).limit(1).get()
        ]);
        if (!porEmail.empty || !porTelefono.empty) {
            return res.status(409).json({ ok: false, error: 'Correo o telefono ya registrado; revisar vinculacion existente' });
        }
        const doc = await coleccion.add({
            nombre, rut: rut ? normalizarRUT(rut) : '', telefono, email,
            rol: 'asesor', activo: false, estado_vinculacion: 'pendiente',
            fecha_registro: new Date(), creado_por_uid: req.usuarioFirebase.uid
        });
        const { activarAsesor } = require('./alta_firebase_asesores_caj');
        let invitacion = null;
        let aviso = '';
        try { invitacion = await activarAsesor(doc.id, req.usuarioFirebase.uid); }
        catch (e) { console.error('[CAJ ALTA PENDIENTE]', e.code || e.message); aviso = 'Registro guardado, pero la invitacion fallo. Use Activar en el panel.'; }
        res.status(201).json({ ok: true, invitacion, aviso, postulante: {
            id: doc.id, nombre, rut, telefono, email, activo: false,
            estado_vinculacion: 'pendiente'
        }});
    } catch (error) {
        console.error('[CAJ ASESORES]', error.message);
        res.status(500).json({ ok: false, error: 'No fue posible registrar al asesor' });
    }
});

// CAJ_EDICION_887_CORREGIDA
app.put('/api/caj/postulantes/:id/editar', exigirCoordinadorCAJ, async (req, res) => {
    try {
        const id = String(req.params.id || '');

        if (!/^[a-zA-Z0-9_-]{1,128}$/.test(id)) {
            return res.status(400).json({ ok: false, error: 'ID invalido' });
        }

        const datos = req.body || {};
        const permitidos = ['nombre', 'rut', 'email', 'telefono'];

        if (Object.keys(datos).some(k => !permitidos.includes(k))) {
            return res.status(403).json({
                ok: false,
                error: 'Campos no autorizados'
            });
        }

        const { normalizarRUT, normalizarTelefono } = require('./firebase_caj');

        const nombre = String(datos.nombre || '').trim();
        const rutEntrada = String(datos.rut || '').trim();
        const rut = rutEntrada ? normalizarRUT(rutEntrada) : '';

        if (nombre.length < 3 || nombre.length > 120 || (rutEntrada && !rut)) {
            return res.status(400).json({
                ok: false,
                error: 'Nombre o RUT invalido'
            });
        }

        const col = dbFirestore.collection('postulantes_caj');
        const ref = col.doc(id);
        const anterior = await ref.get();

        if (!anterior.exists || anterior.data().duplicado_de ||
            anterior.data().activo !== true) {
            return res.status(404).json({
                ok: false,
                error: 'Asesor no encontrado o inactivo'
            });
        }

        const actual = anterior.data();
        const vinculado = Boolean(actual.firebase_uid);
        const cambios = { nombre, rut, actualizadoEn: new Date() };

        if (vinculado) {
            if ('email' in datos || 'telefono' in datos) {
                return res.status(409).json({
                    ok: false,
                    error: 'Correo y WhatsApp de cuentas vinculadas no son editables'
                });
            }
        } else {
            const email = String(datos.email || '').trim().toLowerCase();
            const telefono = normalizarTelefono(datos.telefono);

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
                email.length > 254 || !/^569\d{8}$/.test(telefono)) {
                return res.status(400).json({
                    ok: false,
                    error: 'Correo o telefono invalido'
                });
            }

            const [correos, telefonos] = await Promise.all([
                col.where('email', '==', email).get(),
                col.where('telefono', '==', telefono).get()
            ]);

            if ([...correos.docs, ...telefonos.docs]
                .some(doc => doc.id !== id)) {
                return res.status(409).json({
                    ok: false,
                    error: 'Correo o telefono pertenece a otro asesor'
                });
            }

            cambios.email = email;
            cambios.telefono = telefono;
        }

        await dbFirestore.runTransaction(async tx => {
            const snap = await tx.get(ref);

            if (!snap.exists || snap.data().activo !== true ||
                snap.data().duplicado_de) {
                throw new Error('Asesor no disponible');
            }

            const previo = snap.data();

            if (Boolean(previo.firebase_uid) !== vinculado) {
                throw new Error('La vinculacion del asesor cambio');
            }

            const perfilRef = vinculado
                ? dbFirestore.collection('usuarios_alucilex').doc(previo.firebase_uid)
                : null;

            const perfil = perfilRef ? await tx.get(perfilRef) : null;

            if (!vinculado &&
                (String(previo.email || '').trim().toLowerCase() !==
                    String(actual.email || '').trim().toLowerCase() ||
                 normalizarTelefono(previo.telefono) !==
                    normalizarTelefono(actual.telefono))) {
                throw new Error('Los datos del asesor cambiaron; vuelva a editar');
            }

            tx.update(ref, cambios);

            if (perfil && perfil.exists) {
                tx.update(perfilRef, { nombre });
            }
        });

        return res.json({
            ok: true,
            mensaje: 'Cambios guardados correctamente'
        });

    } catch (error) {
        console.error('[CAJ EDICION ASESOR]', error.message);

        return res.status(500).json({
            ok: false,
            error: 'No fue posible guardar: ' + error.message
        });
    }
});

// CAJ_ELIMINAR_POSTULANTE_V1
app.delete('/api/caj/postulantes/:id', exigirCoordinadorCAJ, async (req, res) => {
    try {
        const id = String(req.params.id || '');

        if (!/^[a-zA-Z0-9_-]{1,128}$/.test(id)) {
            return res.status(400).json({
                ok: false, error: 'Identificador invalido'
            });
        }

        const col = dbFirestore.collection('postulantes_caj');
        const ref = col.doc(id);

        await dbFirestore.runTransaction(async tx => {
            const snap = await tx.get(ref);

            if (!snap.exists || snap.data().activo !== true) {
                const err = new Error('Postulante inexistente o inactivo');
                err.status = 404;
                throw err;
            }

            const p = snap.data();

            if (
                p.rol === 'coordinador' ||
                p.firebase_uid === req.usuarioFirebase.uid
            ) {
                const err = new Error(
                    'No se permite eliminar la cuenta de coordinación ni la propia cuenta'
                );
                err.status = 403;
                throw err;
            }

            const perfilRef = p.firebase_uid
                ? dbFirestore.collection('usuarios_alucilex').doc(p.firebase_uid)
                : null;

            const perfilSnap = perfilRef
                ? await tx.get(perfilRef)
                : null;

            if (perfilSnap && perfilSnap.exists) {
                const perfil = perfilSnap.data();

                if (
                    Array.isArray(perfil.roles) &&
                    perfil.roles.includes('coordinador')
                ) {
                    const err = new Error(
                        'No se puede desactivar un coordinador'
                    );
                    err.status = 403;
                    throw err;
                }
            }

            tx.update(ref, {
                activo: false,
                estado_vinculacion: 'retirado',
                eliminado_por_uid: req.usuarioFirebase.uid,
                fecha_eliminacion: new Date()
            });

            if (perfilSnap && perfilSnap.exists) {
                tx.update(perfilRef, {
                    activo: false,
                    actualizadoEn: new Date()
                });
            }
        });

        res.json({
            ok: true,
            mensaje: 'Postulante retirado de la nómina activa'
        });
    } catch (error) {
        console.error('[CAJ RETIRO POSTULANTE]', error.message);
        res.status(error.status || 500).json({
            ok: false,
            error: error.status
                ? error.message
                : 'No fue posible retirar al postulante'
        });
    }
});

// CAJ_ALTA_FIREBASE_V1 - Solo coordinacion autorizada.
app.post('/api/caj/postulantes/:id/activar', exigirCoordinadorCAJ, async (req, res) => {
  try {
    const { activarAsesor } = require('./alta_firebase_asesores_caj');
    const resultado = await activarAsesor(req.params.id, req.usuarioFirebase.uid);
    res.json(resultado);
  } catch (e) {
    console.error('[ALTA CAJ]', e.code || e.message);
    res.status(e.status || 500).json({ok:false,error:e.status ? e.message : 'No se pudo activar la cuenta. Consulte el servidor.'});
  }
});

// 9. Login al Despacho Jurídico CAJ
app.post('/api/caj/auth/login', async (req, res) => {
    try {
        const { identificador, pin } = req.body;
        if (!identificador) {
            return res.status(400).json({ ok: false, error: 'Debe ingresar su número de WhatsApp o RUT.' });
        }
        const resultado = await validarAccesoPostulante(identificador, pin);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
});

// ============================================================
// CANAL WHATSAPP: RECEPCIÓN 24/7 EN LA NUBE Y LOCAL (BAILEYS)
// ============================================================

app.post('/api/caj/whatsapp/qr/iniciar', async (req, res) => {
    try {
        const { sessionId } = req.body;
        const idSesion = req.perfilCAJ.sessionIdWhatsApp;
        await iniciarSesion(idSesion);
        res.json({ ok: true, mensaje: 'Iniciando sesión' });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
});

app.get('/api/caj/whatsapp/qr/estado/:sessionId', (req, res) => {
    try {
        const { sessionId } = req.params;
        const estado = obtenerEstadoSesion(sessionId);
        res.json(estado);
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
});

app.post('/api/caj/whatsapp/qr/desconectar', async (req, res) => {
    try {
        const { sessionId } = req.body;
        const resultado = await desconectarSesion(req.perfilCAJ.sessionIdWhatsApp);
        res.json({ ok: true, desconectado: resultado });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
});

// Endpoint para enviar mensajes manuales por WhatsApp CAJ (pausa la IA y registra en Firebase)
app.post('/api/caj/whatsapp/enviar', async (req, res) => {
    const { sessionId, numero, texto } = req.body;
    if (!sessionId || !numero || !texto) {
        return res.status(400).json({ ok: false, error: 'Faltan datos requeridos.' });
    }
    try {
        await enviarMensaje(req.perfilCAJ.sessionIdWhatsApp, numero, texto);
        res.json({ ok: true, mensaje: 'Mensaje enviado correctamente' });
    } catch (error) {
        console.error('Error enviando WA:', error);
        res.status(500).json({ ok: false, error: error.message });
    }
});

// Endpoint para que el asesor active/reactive la IA en un chat específico desde la lista CAJ
app.post('/api/caj/whatsapp/ia/activar', async (req, res) => {
    const { sessionId, numero, activar = true, dispararSaludo = true } = req.body;
    if (!numero) {
        return res.status(400).json({ ok: false, error: 'Debe indicar el número de teléfono del cliente.' });
    }
    try {
        const estado = await activarIAEnChat(req.perfilCAJ.sessionIdWhatsApp, numero, activar, dispararSaludo);
        res.json({ ok: true, estado });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
});

// CAJ_CONTROL_MANUAL_IA_V1
// Control interno por expediente. Nunca envia comandos al cliente.
app.post('/api/caj/whatsapp/ia/control', async (req, res) => {
    try {
        const { casoId, accion } = req.body || {};

        if (
            typeof casoId !== 'string' ||
            !/^[a-zA-Z0-9_-]{1,200}$/.test(casoId) ||
            !['pausar', 'continuar'].includes(accion)
        ) {
            return res.status(400).json({
                ok: false,
                error: 'Expediente u orden invalida'
            });
        }

        const expediente = await dbFirestore
            .collection('casos_caj')
            .doc(casoId)
            .get();

        if (
            !expediente.exists ||
            expediente.data().propietario_uid !== req.usuarioFirebase.uid
        ) {
            return res.status(404).json({
                ok: false,
                error: 'Expediente no autorizado'
            });
        }

        const sessionId = req.perfilCAJ.sessionIdWhatsApp;

        if (
            typeof sessionId !== 'string' ||
            !/^[a-zA-Z0-9_-]+$/.test(sessionId)
        ) {
            return res.status(403).json({
                ok: false,
                error: 'Sesion WhatsApp no autorizada'
            });
        }

        const conversaciones = await dbFirestore
            .collection('conversaciones_whatsapp_caj')
            .where('expedienteId', '==', casoId)
            .get();

        const vinculadas = conversaciones.docs.filter(doc => {
            const data = doc.data();

            return (
                data.sessionId === sessionId &&
                typeof data.jid === 'string' &&
                /^\d+@(lid|s\.whatsapp\.net)$/.test(data.jid) &&
                doc.id === sessionId + '_' + data.jid
            );
        });

        if (vinculadas.length !== 1) {
            return res.status(409).json({
                ok: false,
                error: 'No existe una unica conversacion vinculada al expediente'
            });
        }

        const jid = vinculadas[0].data().jid;
        const control = obtenerOCrearControl(sessionId);

        if (!control.permitido(jid)) {
            return res.status(409).json({
                ok: false,
                error: 'La conversacion no esta habilitada en esta sesion'
            });
        }

        if (accion === 'pausar') {
            await control.pausarManual(jid);
        } else {
            await control.reactivar(jid);
        }

        return res.json({
            ok: true,
            accion,
            pausado: accion === 'pausar',
            mensaje: accion === 'pausar'
                ? 'IA pausada por el asesor'
                : 'IA autorizada para continuar al recibir un mensaje del cliente'
        });

    } catch (error) {
        console.error('[CAJ CONTROL IA]', error.message);
        return res.status(500).json({
            ok: false,
            error: 'No fue posible ejecutar la orden de IA'
        });
    }
});
// Enlace directo de conveniencia a la interfaz
app.get('/caj', (req, res) => {
    res.sendFile(path.join(__dirname, 'caj_dashboard.html'));
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Servidor ALUCILEX Blindado y Sincronizado en puerto ${PORT}`);

    (async () => {
        try {
            if (!dbFirestore) {
                throw new Error('Firestore no disponible');
            }

            const fs = require('fs');
            const carpetaCredenciales = path.join(__dirname, 'auth_caj');

            const snapshot = await dbFirestore
                .collection('usuarios_alucilex')
                .where('activo', '==', true)
                .get();

            const sesionesUnicas = new Set();

            for (const documento of snapshot.docs) {
                const perfil = documento.data();

                if (
                    !Array.isArray(perfil.roles) ||
                    !perfil.roles.some(rol =>
                        ['asesor', 'coordinador'].includes(rol)
                    )
                ) {
                    continue;
                }

                const sessionId = perfil.sessionIdWhatsApp;

                if (
                    typeof sessionId !== 'string' ||
                    !/^[a-zA-Z0-9_-]+$/.test(sessionId) ||
                    sesionesUnicas.has(sessionId)
                ) {
                    continue;
                }

                sesionesUnicas.add(sessionId);

                const archivoCredenciales = path.join(
                    carpetaCredenciales,
                    sessionId,
                    'creds.json'
                );

                if (!fs.existsSync(archivoCredenciales) &&
                    process.env.ALUCILEX_WHATSAPP_PERSISTENCIA === '1') {
                    const { obtenerEstadoRespaldo } = require('./storage_sesiones_caj');
                    const estadoRespaldo = await obtenerEstadoRespaldo(sessionId);
                    if (estadoRespaldo?.revocado === true || !estadoRespaldo?.version) {
                        console.log(`[CAJ WHATSAPP] Sin respaldo recuperable: ${sessionId}`);
                        continue;
                    }
                }
                if (!fs.existsSync(archivoCredenciales) &&
                    process.env.ALUCILEX_WHATSAPP_PERSISTENCIA !== '1') {
                    console.log(
                        `[CAJ WHATSAPP] Sin credenciales guardadas: ${sessionId}`
                    );
                    continue;
                }

                try {
                    console.log(
                        `[CAJ WHATSAPP] Recuperando sesion: ${perfil.nombre || sessionId}`
                    );

                    await iniciarSesion(sessionId, true);

                } catch (error) {
                    console.error(
                        `[CAJ WHATSAPP] Error en ${sessionId}: ${error.message}`
                    );
                }
            }

            console.log('[CAJ WHATSAPP] Revision de sesiones finalizada.');

        } catch (error) {
            console.error(
                '[CAJ WHATSAPP] Error de recuperacion multiusuario:',
                error.message
            );
        }
    })();
});