require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');

// Importar el banco de preguntas externo
const bancoPreguntasAlucilex = require('./banco_preguntas.js');

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const openai = new OpenAI({ 
    apiKey: process.env.OPENROUTER_API_KEY, 
    baseURL: 'https://openrouter.ai/api/v1' 
});

const cacheRespuestas = new Map();
const cacheEmbeddings = new Map();
const conversaciones = new Map();
const TTL_RESPUESTA = 3600000;
const MAX_HISTORIAL = 10;

// ========== DICCIONARIO DE ORO (COMPLETO) ==========
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
    "accion de precario": 2195, "mutuo": 2196, "prestamo de consumo": 2196,
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

// ========== FUNCIONES AUXILIARES ==========
function calcularSimilitud(s1, s2) {
    let s1Lower = s1.toLowerCase();
    let s2Lower = s2.toLowerCase();
    let costs = new Array();
    for (let i = 0; i <= s1Lower.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= s2Lower.length; j++) {
            if (i == 0) costs[j] = j;
            else {
                if (j > 0) {
                    let newValue = costs[j - 1];
                    if (s1Lower.charAt(i - 1) != s2Lower.charAt(j - 1))
                        newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0) costs[s2Lower.length] = lastValue;
    }
    return (1.0 - (costs[s2Lower.length] / Math.max(s1Lower.length, s2Lower.length)));
}

function buscarEnDiccionario(texto) {
    const textoNormalizado = texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const clavesOrdenadas = Object.keys(diccionarioOro).sort((a, b) => b.length - a.length);
    for (const concepto of clavesOrdenadas) {
        const articulo = diccionarioOro[concepto];
        const regex = new RegExp(`\\b${concepto.replace(/\s+/g, '\\s+')}\\b`, 'i');
        if (regex.test(textoNormalizado)) return articulo;
    }
    const palabrasClave = textoNormalizado.split(/[\s,.-]+/).filter(p => p.length > 3 && !['que', 'como', 'cual', 'para'].includes(p));
    for (const concepto of clavesOrdenadas) {
        const conceptoNormalizado = concepto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        for (let palabra of palabrasClave) {
            if (calcularSimilitud(palabra, conceptoNormalizado) >= 0.75) return diccionarioOro[concepto];
        }
        if (textoNormalizado.replace(/\s+/g, '').includes(conceptoNormalizado.replace(/\s+/g, ''))) {
            return diccionarioOro[concepto];
        }
    }
    return null;
}

function hashTexto(texto) {
    return crypto.createHash('sha256').update(texto).digest('hex');
}

function limpiarCaches() {
    const now = Date.now();
    for (const [key, val] of cacheRespuestas.entries()) {
        if (now - val.timestamp > TTL_RESPUESTA) cacheRespuestas.delete(key);
    }
    if (cacheEmbeddings.size > 500) {
        const primerKey = cacheEmbeddings.keys().next().value;
        cacheEmbeddings.delete(primerKey);
    }
}
setInterval(limpiarCaches, 600000);

// ========== BÚSQUEDA ROBUSTA DE ARTÍCULO Y DOCTRINA (ADAPTADO A METADATOS) ==========
async function buscarArticuloPorNumero(numero) {
    try {
        // Nueva Idea: Buscamos primero coincidencia exacta en numero_limpio (más rápido y preciso)
        const { data, error } = await supabase
            .from('fragmentos_legales')
            .select('contenido, metadatos, id')
            .eq('metadatos->>tipo', 'ley')
            .eq('metadatos->>numero_limpio', numero.toString())
            .limit(1);

        if (!error && data && data.length > 0) return data[0];

        // Backup: Si no encontró por numero_limpio, probamos el filtro original
        const { data: dataRetry } = await supabase
            .from('fragmentos_legales')
            .select('contenido, metadatos, id')
            .eq('metadatos->>tipo', 'ley')
            .filter('metadatos->>articulo', 'ilike', `%${numero}%`)
            .limit(1);
        
        return dataRetry?.[0] || null;

    } catch (e) {
        console.error("[❌ ERROR SUPABASE LEY]:", e.message);
    }
    return null;
}

async function buscarDoctrina(embedding, limite = 15) {
    try {
        const { data, error } = await supabase.rpc('buscar_fragmentos', {
            query_embedding: embedding,
            filtro_tipo: 'doctrina', // Etiqueta correcta según inyector
            match_threshold: 0.00,   // Traer siempre los mejores 15
            match_count: limite
        });
        if (error) throw error;
        return data || [];
    } catch (e) {
        console.error("[❌ ERROR SUPABASE DOCTRINA]:", e.message);
    }
    return [];
}

// ===================== ENDPOINT PRINCIPAL (CON TELEMETRÍA) =====================
app.post('/api/consultar', async (req, res) => {
    const { pregunta, sessionId } = req.body;
    
    console.log(`\n=========================================`);
    console.log(`[🚀 NUEVA CONSULTA] Sesión: ${sessionId || 'Desconocida'}`);
    console.log(`[🗣️ USUARIO] Pregunta: "${pregunta}"`);

    if (!pregunta) {
        return res.status(400).json({ error: "Pregunta vacía" });
    }

    const hashPregunta = hashTexto(pregunta);
    const respuestaCacheada = cacheRespuestas.get(hashPregunta);
    
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    if (respuestaCacheada && Date.now() - respuestaCacheada.timestamp < TTL_RESPUESTA) {
        console.log(`[⚡ CACHÉ] Respondiendo desde memoria.`);
        const words = respuestaCacheada.respuesta.split(' ');
        for (let i = 0; i < words.length; i++) {
            res.write(`data: ${JSON.stringify({ content: words[i] + ' ' })}\n\n`);
            await new Promise(r => setTimeout(r, 20));
        }
        res.write('data: [DONE]\n\n');
        res.end();
        return;
    }

    if (!conversaciones.has(sessionId)) conversaciones.set(sessionId, []);
    let historial = conversaciones.get(sessionId);

    // 1. Detección de Artículo
    let numeroArticuloDetectado = null;
    let articuloContenido = "";
    const matchNumero = pregunta.match(/(?:art(?:[íi]culo|\.?)?\s*)?(\d{1,4})(?!\d)/i);
    if (matchNumero && matchNumero[1]) {
        numeroArticuloDetectado = matchNumero[1];
    } else {
        const fromDic = buscarEnDiccionario(pregunta);
        if (fromDic) numeroArticuloDetectado = fromDic.toString();
    }

    // 2. Procesamiento Paralelo
    let embeddingPromise = openai.embeddings.create({
        model: 'openai/text-embedding-3-small',
        input: pregunta.substring(0, 8000),
        dimensions: 768
    }).then(r => {
        console.log(`[🧠 EMBEDDING] Vector generado correctamente.`);
        return r.data[0].embedding;
    }).catch(e => { console.error("[❌ ERROR EMBEDDING]", e.message); return null; });

    let articuloPromise = numeroArticuloDetectado ? buscarArticuloPorNumero(numeroArticuloDetectado) : Promise.resolve(null);

    const [articuloResult, embeddingResult] = await Promise.all([articuloPromise, embeddingPromise]);
    
    if (articuloResult) {
        articuloContenido = articuloResult.contenido.replace(/\[.*?\]/g, '').trim();
        console.log(`[📜 LEY] ¡Éxito! Artículo ${numeroArticuloDetectado} recuperado.`);
    }

    let doctrinaTextos = [];
    if (embeddingResult) {
        const resultadosDoctrina = await buscarDoctrina(embeddingResult, 15);
        doctrinaTextos = resultadosDoctrina.map(f => f.contenido || '');
        console.log(`[📚 DOCTRINA] Se recuperaron ${resultadosDoctrina.length} fragmentos de apuntes.`);
    }

    let contextoDoctrina = doctrinaTextos.length ? doctrinaTextos.join('\n\n---\n\n') : '';
    let contextoTotal = `### APUNTES DEL ESTUDIANTE ENCONTRADOS EN BASE DE DATOS:\n${contextoDoctrina}\n\n### TEXTO DEL CÓDIGO CIVIL RECUPERADO:\n${articuloContenido || "Vacío"}`;

    // 3. PROMPT MAGISTRAL (NUEVA VERSIÓN)
    const systemPrompt = 
        "Eres Alucilex, el Catedrático Titular de Derecho Civil más prestigioso de Chile. " +
        "Esta es una CÁTEDRA MAGISTRAL UNIVERSITARIA. Tu respuesta DEBE ser un tratado profundo.\n\n" +
        "REGLAS INQUEBRANTABLES:\n" +
        "1. **PROHIBICIÓN DE RESUMEN:** CADA sección debe tener un desarrollo denso (Mínimo 3-4 párrafos por punto).\n" +
        "2. **CITA INICIAL:** Empieza con: '📜 **Art. [Número] del Código Civil:** [Texto completo]'.\n" +
        "3. **USO DE APUNTES:** El 'Contexto' contiene tus propios APUNTES UNIVERSITARIOS. Úsalos como base. Si la información en ellos es insuficiente, utiliza tu vasto conocimiento oficial del Derecho Chileno para completar la clase.\n" +
        "4. **SUERO DE LA VERDAD:** Puedes citar autores clásicos (Somarriva, Alessandri, Ramos Pazos) SOLO SI aparecen en los apuntes o si tienes absoluta certeza histórica. TIENES PROHIBIDO inventar nombres de libros o sentencias ficticias.\n" +
        "5. **ESTRUCTURA OBLIGATORIA:**\n" +
        "   - I. Naturaleza Jurídica y Evolución\n" +
        "   - II. Concepto Institucional Profundo\n" +
        "   - III. Análisis de Elementos y Requisitos\n" +
        "   - IV. Efectos Jurídicos Principales\n" +
        "   - V. Casos Prácticos de Aplicación\n" +
        "6. **PROSA ACADÉMICA:** Evita las viñetas simples; prefiere una narrativa jurídica fluida.";

    let mensajes = [{ role: "system", content: systemPrompt }];
    for (let msg of historial) mensajes.push(msg);
    mensajes.push({
        role: "user",
        content: `${contextoTotal}\n\nPregunta del alumno: ${pregunta}\n\nDicta tu cátedra magistral ahora.`
    });

    let respuestaFinal = "";

    try {
        console.log(`[🤖 IA] Generando respuesta...`);
        const stream = await openai.chat.completions.create({
            model: "deepseek/deepseek-chat",
            messages: mensajes,
            temperature: 0.6, 
            max_tokens: 5000,
            stream: true,
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            respuestaFinal += content;
            res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
        console.log(`[✅ ÉXITO] Respuesta enviada (${respuestaFinal.length} caracteres).`);
    } catch (err) {
        console.error(`[❌ ERROR IA] ${err.message}`);
        res.write(`data: ${JSON.stringify({ content: "\n\n❌ Error de conexión con el cerebro de Alucilex." })}\n\n`);
    }

    res.write('data: [DONE]\n\n');
    res.end();
    console.log(`=========================================\n`);

    if(respuestaFinal.length > 100){
        cacheRespuestas.set(hashPregunta, { respuesta: respuestaFinal, timestamp: Date.now() });
        historial.push({ role: "user", content: pregunta });
        historial.push({ role: "assistant", content: respuestaFinal });
        conversaciones.set(sessionId, historial.slice(-MAX_HISTORIAL));
    }
});

// ========== MÓDULO DE EVALUACIÓN MAGISTRAL (QUIZ + ANÁLISIS IA) ==========

/**
 * Endpoint: /api/quiz/generar
 * Lógica: 
 * 1. Selecciona pregunta aleatoria del banco de 125.
 * 2. Selecciona artículo aleatorio de Supabase.
 * 3. Genera una explicación de cátedra (mínimo 10 líneas) usando IA.
 */
app.post('/api/quiz/generar', async (req, res) => {
    console.log(`\n[🎲 QUIZ] Iniciando generación de evaluación y análisis de cátedra...`);
    
    try {
        // 1. Selección de pregunta del banco externo (Ya no hay duplicados internos)
        const totalPreguntas = bancoPreguntasAlucilex.length;
        const indexAleatorio = Math.floor(Math.random() * totalPreguntas);
        const preguntaData = bancoPreguntasAlucilex[indexAleatorio];
        
        let artData = { 
            numero: "Fundamento Doctrinario", 
            texto: "Analizando principios generales del Derecho Civil Chileno.",
            analisisIA: "Iniciando análisis magistral..."
        };
        
        // 2. Obtención de Artículo Aleatorio desde Supabase
        try {
            const artNumeroAleatorio = Math.floor(Math.random() * 2524) + 1;
            const { data, error } = await supabase.from('fragmentos_legales')
                .select('contenido')
                .eq('metadatos->>tipo', 'ley')
                .eq('metadatos->>numero_limpio', String(artNumeroAleatorio))
                .limit(1);

            if (!error && data && data.length > 0) {
                const textoArticulo = data[0].contenido.replace(/\[.*?\]/g, '').trim();
                
                // 3. GENERACIÓN DE ANÁLISIS DE CÁTEDRA (Mínimo 10 líneas)
                const promptAnalisis = `Actúa como un catedrático experto en Derecho Civil. 
                Explica de forma pedagógica y profunda el siguiente artículo del Código Civil:
                "${textoArticulo}"
                Tu explicación debe tener al menos 10 líneas de texto, ser clara para un estudiante, 
                enfocarse en la importancia práctica de la norma y su aplicación en la vida real. 
                No saludes, ve directo a la explicación.`;

                const completion = await openai.chat.completions.create({
                    model: "deepseek/deepseek-chat",
                    messages: [{ role: "user", content: promptAnalisis }],
                    temperature: 0.5,
                    max_tokens: 1000
                });

                artData = { 
                    numero: `Art. ${artNumeroAleatorio}`, 
                    texto: textoArticulo,
                    analisisIA: completion.choices[0].message.content
                };
            }
        } catch (errArt) {
            console.error("[❌ ERROR ARTÍCULO/IA]:", errArt.message);
        }

        // 4. Respuesta consolidada al Frontend
        res.json({
            articulo: artData,
            pregunta: preguntaData.pregunta,
            opciones: preguntaData.opciones,
            correcta: preguntaData.correcta,
            explicacion: preguntaData.explicacion,
            total: totalPreguntas,
            origen: 'banco_125_preguntas_alucilex'
        });

    } catch (error) {
        console.error('[❌ ERROR CRÍTICO QUIZ]:', error);
        res.status(500).json({ error: 'Error interno al generar la evaluación.' });
    }
});

app.get('/ping', (req, res) => res.status(200).send('OK'));
app.get('/', (req, res) => res.send('API Alucilex (Cátedra Profesional) funcionando.'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor ALUCILEX Blindado y Sincronizado en puerto ${PORT}`));

app.get('/ping', (req, res) => res.status(200).send('OK'));
app.get('/', (req, res) => res.send('API Alucilex (Cátedra Profesional) funcionando.'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor ALUCILEX Blindado en puerto ${PORT}`));