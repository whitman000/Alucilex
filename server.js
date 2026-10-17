require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');
const multer = require('multer');

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

const { generarInformeJuridico, confeccionarEscritoJudicial } = require('./motor_caj');
const { analizarDocumento, guardarDocumentoEnCaso } = require('./procesador_documentos');
const { iniciarSesion, obtenerEstadoSesion, desconectarSesion, enviarMensaje } = require('./whatsapp_caj');

// Importar los bancos estáticos de Alucilex
const bancoPreguntasAlucilex = require('./banco_preguntas.js');
const bancoArticulosAlucilex = require('./banco_articulos.js');

const app = express();
app.use(cors());
app.use(express.json());
// Servir únicamente archivos públicos conocidos; nunca credenciales ni sesiones.
const archivosPublicos = new Set([
    '/alucilex.html', '/caj_dashboard.html', '/escrituras.html', '/motor_escrituras.js', '/privacidad.html'
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
// Etapa de pruebas: el control QR solo se admite desde el computador del servidor.
app.use('/api/caj/whatsapp/qr', (req, res, next) => {
    const ip = req.socket.remoteAddress;
    if (!['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(ip)) {
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

const openai = new OpenAI({ 
    apiKey: process.env.OPENROUTER_API_KEY || 'sk-or-v1-placeholder', 
    baseURL: 'https://openrouter.ai/api/v1' 
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
// RUTAS MESA DE TRABAJO JURÍDICA CAJ (Firebase + OpenRouter)
// ============================================================

// 1. Obtener todos los casos
app.get('/api/caj/casos', async (req, res) => {
    try {
        const casos = await listarCasos();
        res.json({ ok: true, casos });
    } catch (e) {
        res.status(500).json({ ok: false, error: e.message });
    }
});

// 2. Ingresar nueva causa anclada al RUT maestro
app.post('/api/caj/nuevo', async (req, res) => {
    try {
        const resultado = await guardarCaso(req.body);
        console.log(`✅ Causa procesada con éxito (ID: ${resultado.id})`);
        res.json({ ok: true, id: resultado.id, caso: resultado });
    } catch (error) {
        console.error('Error al crear causa:', error);
        res.status(500).json({ ok: false, error: error.message });
    }
});

// Alias compatible para creación
app.post('/api/caj/caso', async (req, res) => {
    try {
        const resultado = await guardarCaso(req.body);
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
app.get('/api/caj/postulantes', async (req, res) => {
    try {
        const postulantes = await listarPostulantes();
        res.json({ ok: true, postulantes });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
});

app.post('/api/caj/postulantes', async (req, res) => {
    try {
        const nuevo = await guardarPostulante(req.body);
        res.json({ ok: true, postulante: nuevo });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
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
        const idSesion = sessionId || 'coordinador_carlos';
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
        const resultado = await desconectarSesion(sessionId || 'coordinador_carlos');
        res.json({ ok: true, desconectado: resultado });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
});

// Enlace directo de conveniencia a la interfaz
app.get('/caj', (req, res) => {
    res.sendFile(require('path').join(__dirname, 'caj_dashboard.html'));
});

const PORT = process.env.PORT || 3001;
// NOTA: Eliminamos '127.0.0.1' para que en Render (0.0.0.0) funcione correctamente

// Endpoint para enviar mensajes por WhatsApp CAJ
app.post('/api/caj/whatsapp/enviar', async (req, res) => {
    const { sessionId, numero, texto } = req.body;
    if (!sessionId || !numero || !texto) {
        return res.status(400).json({ ok: false, error: 'Faltan datos requeridos.' });
    }
    try {
        const motorWa = require('./whatsapp_caj');
        await motorWa.enviarMensaje(sessionId, numero, texto);
        res.json({ ok: true, mensaje: 'Mensaje enviado correctamente' });
    } catch (error) {
        console.error('Error enviando WA:', error);
        res.status(500).json({ ok: false, error: error.message });
    }
});
app.listen(PORT, () => {
    console.log(`Servidor ALUCILEX Blindado y Sincronizado en puerto ${PORT}`);
    // Auto-iniciar sesión QR principal del Coordinador al arrancar
    iniciarSesion('coordinador_carlos').catch(() => {});
});
