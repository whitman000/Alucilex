require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');

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

// ========== BÚSQUEDA ROBUSTA DE ARTÍCULO Y DOCTRINA ==========
async function buscarArticuloPorNumero(numero) {
    try {
        const { data, error } = await supabase
            .from('fragmentos_legales')
            .select('contenido, metadatos, id')
            .eq('metadatos->>tipo', 'ley')
            .filter('metadatos->>articulo', 'ilike', `%${numero}%`)
            .limit(1);
        if (!error && data && data.length > 0) return data[0];
    } catch (e) {
        console.error("Error buscando articulo:", e.message);
    }
    return null;
}

async function buscarDoctrina(embedding, limite = 15) { // AUMENTADO A 15 FRAGMENTOS
    try {
        const { data, error } = await supabase.rpc('buscar_fragmentos', {
            query_embedding: embedding,
            filtro_tipo: 'doctrina',
            match_threshold: 0.12, // DRÁSTICAMENTE REDUCIDO PARA FORZAR QUE SIEMPRE ENCUENTRE APUNTES
            match_count: limite
        });
        if (!error && data) return data;
    } catch (e) {
        console.error("Error buscando doctrina:", e.message);
    }
    return [];
}

// ===================== ENDPOINT PRINCIPAL (PURO EFECTO MÁQUINA DE ESCRIBIR) =====================
app.post('/api/consultar', async (req, res) => {
    const { pregunta, sessionId } = req.body;
    if (!pregunta) return res.status(400).json({ error: "Pregunta vacía" });
    if (!sessionId) return res.status(400).json({ error: "Se requiere sessionId" });

    const hashPregunta = hashTexto(pregunta);
    const respuestaCacheada = cacheRespuestas.get(hashPregunta);
    
    // Preparar encabezados para Streaming en tiempo real
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    if (respuestaCacheada && Date.now() - respuestaCacheada.timestamp < TTL_RESPUESTA) {
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
    if (historial.length > MAX_HISTORIAL) historial = historial.slice(-MAX_HISTORIAL);

    // 1. Detectar número de artículo
    let numeroArticuloDetectado = null;
    let articuloObjeto = null;
    let articuloContenido = "";
    
    const matchNumero = pregunta.match(/(?:art(?:[íi]culo|\.?)?\s*)?(\d{1,4})(?!\d)/i);
    if (matchNumero && matchNumero[1]) {
        numeroArticuloDetectado = matchNumero[1];
    } else {
        const fromDic = buscarEnDiccionario(pregunta);
        if (fromDic) numeroArticuloDetectado = fromDic.toString();
    }

    // 2. Ejecutar búsquedas en paralelo
    let embeddingPromise = null;
    if (cacheEmbeddings.has(hashPregunta)) {
        embeddingPromise = Promise.resolve(cacheEmbeddings.get(hashPregunta));
    } else {
        embeddingPromise = openai.embeddings.create({
            model: 'openai/text-embedding-3-small',
            input: pregunta.substring(0, 8000),
            dimensions: 768
        }).then(res => res.data[0].embedding).catch(() => null);
    }

    let articuloPromise = numeroArticuloDetectado ? buscarArticuloPorNumero(numeroArticuloDetectado) : Promise.resolve(null);

    const [articuloResult, embeddingResult] = await Promise.all([articuloPromise, embeddingPromise]);
    
    if (articuloResult) {
        articuloContenido = articuloResult.contenido.replace(/\[.*?\]/g, '').trim();
    }

    let doctrinaTextos = [];
    if (embeddingResult) {
        cacheEmbeddings.set(hashPregunta, embeddingResult);
        const resultadosDoctrina = await buscarDoctrina(embeddingResult, 15);
        doctrinaTextos = resultadosDoctrina.map(f => f.contenido || f.texto || '');
    }

    let contextoDoctrina = doctrinaTextos.length ? doctrinaTextos.join('\n\n---\n\n') : '';
    let contextoTotal = `### APUNTES DEL ESTUDIANTE ENCONTRADOS EN BASE DE DATOS:\n${contextoDoctrina}\n\n### TEXTO DEL CÓDIGO CIVIL RECUPERADO:\n${articuloContenido || "Vacío"}`;

    // 3. EL NUEVO PROMPT EXTREMO: FUERZA BRUTA PARA EXTENSIÓN Y PRECISIÓN
    const systemPrompt = 
        "Eres Alucilex, el Catedrático Titular de Derecho Civil más erudito, exigente y exhaustivo de Chile. " +
        "Esta es una CÁTEDRA MAGISTRAL UNIVERSITARIA. Tu respuesta DEBE ser un tratado monumental. " +
        "Tienes 5000 tokens disponibles y debes usarlos casi en su totalidad.\n\n" +
        "REGLAS DE EXTENSIÓN Y FORMATO (INQUEBRANTABLES):\n" +
        "1. **PROHIBICIÓN DE RESUMEN:** Está absolutamente PROHIBIDO dar respuestas de 1 o 2 párrafos por sección. Para CADA sección que abras, DEBES redactar un mínimo de 4 a 5 párrafos densos, con abundante doctrina, debate jurídico y ejemplos. Si eres escueto, fallarás.\n" +
        "2. **CITA INICIAL LIMPIA:** Empieza transcribiendo el artículo exacto así: '📜 **Art. [Número] del Código Civil:** [Texto completo]'.\n" +
        "3. **USO OBLIGATORIO DE LA DOCTRINA:** Debes leer el 'Contexto de Base de Datos' provisto. SI HAY APUNTES AHÍ, utilízalos para armar tu clase. Si el contexto está 'Vacío', asume el control total y extrae todo de tu propio conocimiento del Derecho Chileno.\n" +
        "4. **CITA A LOS MAESTROS:** Tu respuesta no tiene validez si no nombras, explicas y debates los criterios de al menos tres de estos autores chilenos: Arturo Alessandri, Manuel Somarriva, René Ramos Pazos, Víctor Vial del Río, Pablo Rodríguez Grez o Luis Claro Solar.\n" +
        "5. **ESTRUCTURA OBLIGATORIA (Mínimo 500 palabras por punto):**\n" +
        "   - I. Naturaleza Jurídica y Evolución Histórica\n" +
        "   - II. Concepto Doctrinal Profundo\n" +
        "   - III. Análisis Exhaustivo de Elementos y Requisitos (Desarrolla cada requisito en un párrafo separado)\n" +
        "   - IV. Efectos Jurídicos y Características Principales\n" +
        "   - V. Casos Prácticos Complejos y Jurisprudencia\n" +
        "6. **NO uses listas con viñetas simples.** Todo debe ser prosa académica fluida y profesional.";

    let mensajes = [{ role: "system", content: systemPrompt }];
    for (let msg of historial) mensajes.push(msg);
    mensajes.push({
        role: "user",
        content: `${contextoTotal}\n\nPregunta del alumno: ${pregunta}\n\nDicta tu cátedra magistral ahora, asegurándote de desarrollar cada punto con máxima extensión y profundidad.`
    });

    let respuestaFinal = "";

    try {
        // Temperatura a 0.6 para máxima capacidad de expansión sin perder lógica jurídica
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
    } catch (err) {
        console.error("Error OpenAI Stream:", err.message);
        res.write(`data: ${JSON.stringify({ content: "\n\n❌ Hubo una interrupción en la conexión. Por favor, reintenta." })}\n\n`);
    }

    res.write('data: [DONE]\n\n');
    res.end();

    if(respuestaFinal.length > 50){
        cacheRespuestas.set(hashPregunta, { respuesta: respuestaFinal, timestamp: Date.now() });
        historial.push({ role: "user", content: pregunta });
        historial.push({ role: "assistant", content: respuestaFinal });
        conversaciones.set(sessionId, historial.slice(-MAX_HISTORIAL));
    }
});

// ======================== QUIZ Y MAPEO ORIGINAL COMPLETO ========================
const mapeoTemas = {
    "bienes": [
        { campo: "articulo_numero", operador: "gte", valor: 565 },
        { campo: "articulo_numero", operador: "lte", valor: 595 }
    ],
    "dominio": [
        { campo: "articulo_numero", operador: "gte", valor: 582 },
        { campo: "articulo_numero", operador: "lte", valor: 605 }
    ],
    "tradicion": [
        { campo: "articulo_numero", operador: "gte", valor: 670 },
        { campo: "articulo_numero", operador: "lte", valor: 699 }
    ],
    "posesion": [
        { campo: "articulo_numero", operador: "gte", valor: 700 },
        { campo: "articulo_numero", operador: "lte", valor: 729 }
    ],
    "filiacion": [
        { campo: "articulo_numero", operador: "gte", valor: 179 },
        { campo: "articulo_numero", operador: "lte", valor: 242 }
    ],
    "sucesion": [
        { campo: "articulo_numero", operador: "gte", valor: 951 },
        { campo: "articulo_numero", operador: "lte", valor: 1067 }
    ],
    "obligaciones": [
        { campo: "articulo_numero", operador: "gte", valor: 1437 },
        { campo: "articulo_numero", operador: "lte", valor: 1566 }
    ],
    "contratos": [
        { campo: "articulo_numero", operador: "gte", valor: 1438 },
        { campo: "articulo_numero", operador: "lte", valor: 2456 }
    ],
    "sociedad_conyugal": [
        { campo: "articulo_numero", operador: "gte", valor: 135 },
        { campo: "articulo_numero", operador: "lte", valor: 185 }
    ]
};

// BANCO DE PREGUNTAS ORIGINAL
const bancoPreguntasAlucilex = [
    {
        pregunta: "Juan le dona a Pedro un automóvil con la condición de que este último 'no se case nunca'. Según el Código Civil chileno, ¿cuál es el efecto de esta condición?",
        opciones: ["A. La condición es válida y Pedro pierde el auto si se casa.", "B. La condición se tiene por no escrita y la donación es pura y simple.", "C. La condición anula el acto jurídico por completo.", "D. La condición es válida pero solo por 10 años."],
        correcta: 1,
        explicacion: "El artículo 1073 del Código Civil establece que la condición de no casarse 'se tendrá por no escrita', salvo que se limite a no casarse antes de cumplir la mayoría de edad o con una persona determinada. Por ende, la donación vale y la condición se ignora."
    },
    {
        pregunta: "Un joven de 16 años (menor adulto) vende su bicicleta sin la autorización de su representante legal. ¿Qué sanción civil acarrea este acto?",
        opciones: ["A. Nulidad Absoluta.", "B. Inexistencia.", "C. Nulidad Relativa.", "D. Resciliación."],
        correcta: 2,
        explicacion: "Los actos de los menores adultos (incapaces relativos) adolecen de nulidad relativa, ya que su incapacidad no es absoluta y el acto puede ser saneado por la ratificación del representante legal o por el transcurso del tiempo (4 años), según el Art. 1682."
    },
    {
        pregunta: "María, para evitar el embargo, celebra una compraventa con su hermano sobre su única casa, pero acuerdan en secreto que no habrá pago de precio ni entrega. ¿Qué tipo de simulación existe aquí?",
        opciones: ["A. Simulación lícita.", "B. Simulación relativa.", "C. Simulación absoluta.", "D. Reserva mental."],
        correcta: 2,
        explicacion: "Estamos ante una simulación absoluta. En ella, las partes celebran un acto jurídico, pero en realidad no quieren celebrar acto alguno (todo es una fachada). A diferencia de la relativa, donde esconden un acto real bajo la apariencia de otro."
    },
    {
        pregunta: "Para que la fuerza vicie el consentimiento, el Código Civil exige que sea:",
        opciones: ["A. Injusta, grave y determinante.", "B. Física, actual e irresistible.", "C. Moral, leve y proveniente de la contraparte.", "D. Exclusivamente económica."],
        correcta: 0,
        explicacion: "La fuerza debe ser grave (capaz de producir una impresión fuerte), injusta (contraria a derecho) y determinante (el acto se celebra a consecuencia de ella). El Art. 1456 agrega que se presume gravedad si hay amenaza de un mal irreparable y grave."
    },
    {
        pregunta: "Según el Art. 1464 del Código Civil, hay objeto ilícito en la enajenación de:",
        opciones: ["A. Las cosas que no existen pero se espera que existan.", "B. Los derechos o privilegios que no pueden transferirse a otra persona.", "C. Las cosas embargadas por decreto judicial, incluso si el juez lo autoriza.", "D. Los bienes raíces ubicados en zonas fronterizas."],
        correcta: 1,
        explicacion: "El Art. 1464 Nº 2 señala expresamente que hay objeto ilícito en la enajenación de los derechos y privilegios que no pueden transferirse a otras personas (derechos personalísimos)."
    },
    {
        pregunta: "¿Cuál de los siguientes modos de adquirir el dominio es de carácter 'originario'?",
        opciones: ["A. La tradición.", "B. La sucesión por causa de muerte.", "C. La ocupación.", "D. La cesión de derechos."],
        correcta: 2,
        explicacion: "La ocupación es un modo originario, ya que el dominio no se transfiere de un patrimonio a otro (como en la tradición), sino que nace por primera vez en el patrimonio del adquirente al apoderarse de una cosa que no pertenece a nadie."
    },
    {
        pregunta: "Para que exista 'posesión regular' de un inmueble, ¿qué requisitos copulativos se exigen?",
        opciones: ["A. Justo título, buena fe inicial y, si el título es traslaticio, la tradición.", "B. Dominio, capacidad y buena fe permanente.", "C. Inscripción conservatoria por al menos 10 años.", "D. Mero tenedor, título gratuito y buena fe."],
        correcta: 0,
        explicacion: "Según el Art. 702 del Código Civil, la posesión regular requiere justo título y buena fe al momento de adquirirla. Si el título es traslaticio de dominio (como una compraventa), requiere además la tradición."
    },
    {
        pregunta: "Si un río cambia definitivamente su cauce, dejando en seco una franja de tierra, los dueños de los predios ribereños adquieren esa tierra. ¿Qué tipo de accesión es esta?",
        opciones: ["A. Aluvión.", "B. Avulsión.", "C. Adjunción.", "D. Mutación de álveo o cambio de cauce."],
        correcta: 3,
        explicacion: "Es un caso de accesión de inmueble a inmueble. La ley señala que, si el río cambia de cauce, los propietarios riberanos acceden a la parte descubierta en proporción a sus líneas de demarcación (Art. 654 y 655)."
    },
    {
        pregunta: "La tradición del dominio de los bienes raíces y de los derechos reales constituidos en ellos, se efectúa por:",
        opciones: ["A. La entrega material de las llaves de la propiedad.", "B. La firma de la escritura pública ante notario.", "C. La inscripción del título en el Registro de Propiedad del Conservador de Bienes Raíces.", "D. El pago íntegro del precio convenido."],
        correcta: 2,
        explicacion: "El Art. 686 del Código Civil es categórico: la tradición de bienes raíces solo se verifica mediante la inscripción en el Conservador de Bienes Raíces respectivo. Sin inscripción, el comprador no es dueño."
    },
    {
        pregunta: "El arrendatario de una casa tiene respecto de ella la calidad de:",
        opciones: ["A. Poseedor irregular.", "B. Poseedor regular.", "C. Mero tenedor.", "D. Propietario fiduciario."],
        correcta: 2,
        explicacion: "El arrendatario es un mero tenedor (Art. 714 del CC), ya que ejerce la tenencia sobre una cosa, no como dueño, sino en lugar o a nombre del dueño (el arrendador). Le falta el 'animus domini'."
    },
    {
        pregunta: "¿En qué tipo de contratos va envuelta siempre la condición resolutoria tácita?",
        opciones: ["A. En los contratos unilaterales.", "B. En los contratos bilaterales.", "C. En los contratos reales.", "D. En los contratos gratuitos."],
        correcta: 1,
        explicacion: "El Art. 1489 consagra que en los contratos bilaterales va envuelta la condición resolutoria de no cumplirse por uno de los contratantes lo pactado, otorgando el derecho alternativo a pedir la resolución o el cumplimiento."
    },
    {
        pregunta: "Si tres amigos piden un préstamo al banco y pactan solidaridad pasiva, el banco puede exigir:",
        opciones: ["A. A cada uno un tercio de la deuda exclusivamente.", "B. El total de la deuda a cualquiera de ellos, a su arbitrio.", "C. Solo al deudor que tenga más patrimonio.", "D. Primero a un fiador y luego a los deudores."],
        correcta: 1,
        explicacion: "La solidaridad pasiva significa que el acreedor puede dirigirse en contra de cualquiera de los deudores y exigirle el pago total de la deuda. El pago que haga uno extingue la obligación respecto de todos ante el banco (Art. 1514)."
    },
    {
        pregunta: "¿Qué función principal cumple la cláusula penal en un contrato?",
        opciones: ["A. Pagar impuestos al Fisco por el contrato.", "B. Avaluar anticipada y convencionalmente los perjuicios por el incumplimiento.", "C. Extinguir la obligación original automáticamente.", "D. Establecer la nulidad del contrato en caso de mora."],
        correcta: 1,
        explicacion: "Según el Art. 1535, sirve como avaluación anticipada de los perjuicios, eximiendo al acreedor de probarlos si el deudor no cumple o retarda su cumplimiento."
    },
    {
        pregunta: "Para que opere la compensación legal, ambas deudas deben ser, entre otros requisitos:",
        opciones: ["A. En dinero o cosas fungibles de la misma especie y calidad, y actualmente exigibles.", "B. De obligaciones naturales exclusivamente.", "C. Reconocidas previamente en un juicio declarativo.", "D. Superiores a 50 Unidades de Fomento."],
        correcta: 0,
        explicacion: "La compensación legal requiere que ambas obligaciones sean de dinero o de cosas fungibles de igual género y calidad; que ambas sean líquidas y actualmente exigibles (Art. 1656)."
    },
    {
        pregunta: "La máxima 'la mora purga la mora' (Art. 1552) significa que en los contratos bilaterales:",
        opciones: ["A. Ninguno está en mora dejando de cumplir lo pactado, mientras el otro no lo cumple por su parte o no se allana a cumplirlo.", "B. La mora de uno perdona los intereses penales del otro.", "C. El acreedor debe demandar dos veces para constituir en mora.", "D. No existe la mora en los contratos bilaterales."],
        correcta: 0,
        explicacion: "Es la excepción de contrato no cumplido. Para que un contratante pueda exigir al otro indemnización o la resolución, él mismo debe haber cumplido su obligación o estar llano a cumplirla."
    },
    {
        pregunta: "En la compraventa, si las partes acuerdan que el precio 'quedará al arbitrio exclusivo del vendedor', el contrato:",
        opciones: ["A. Es válido y el comprador debe pagar lo que exija el vendedor.", "B. No vale, carece de un requisito esencial.", "C. Es válido si el juez aprueba el precio posteriormente.", "D. Se convierte en una donación."],
        correcta: 1,
        explicacion: "El Art. 1809 del Código Civil establece expresamente que el precio no puede dejarse al arbitrio de uno de los contratantes. Si falta el precio, falta un elemento de la esencia y el acto no produce efecto."
    },
    {
        pregunta: "El vendedor de un bien raíz sufre lesión enorme cuando:",
        opciones: ["A. El precio que recibe es inferior a la mitad del justo precio de la cosa que vende.", "B. El justo precio de la cosa que compra es inferior a la mitad del precio que paga por ella.", "C. Vende una cosa mueble por menos del costo de producción.", "D. Es engañado con violencia física."],
        correcta: 0,
        explicacion: "El Art. 1889 define la lesión enorme. El vendedor la sufre si recibe un precio inferior a la mitad del justo precio."
    },
    {
        pregunta: "Los vicios redhibitorios u ocultos en la compraventa dan al comprador el derecho a:",
        opciones: ["A. Denunciar al vendedor por estafa.", "B. Exigir la resolución del contrato o la rebaja proporcional del precio.", "C. Exigir que se le entregue un bien raíz de reemplazo.", "D. Nada, por el principio de que el comprador debe cuidarse solo."],
        correcta: 1,
        explicacion: "Los vicios ocultos dan origen a la acción redhibitoria para rescindir la venta, o a la acción estimatoria para rebajar proporcionalmente el precio (Art. 1857 y 1868)."
    },
    {
        pregunta: "El contrato de arrendamiento de cosas es un contrato:",
        opciones: ["A. Real, que se perfecciona con la entrega de la cosa.", "B. Consensual, que se perfecciona por el solo acuerdo de voluntades.", "C. Solemne, requiere siempre escritura pública.", "D. Unilateral, pues solo el arrendador contrae obligaciones."],
        correcta: 1,
        explicacion: "El arrendamiento es un contrato netamente consensual. No requiere entrega ni escritura para perfeccionarse, bastando el acuerdo en la cosa y en la renta."
    },
    {
        pregunta: "La hipoteca otorga al acreedor hipotecario los derechos de:",
        opciones: ["A. Uso, goce y disposición sobre el inmueble.", "B. Venta privada directa sin intervención judicial.", "C. Persecución (contra quien la posea) y de preferencia (en el pago).", "D. Arrendar el inmueble hipotecado y quedarse con los frutos."],
        correcta: 2,
        explicacion: "La hipoteca otorga al acreedor el derecho de perseguir la finca en manos de quien se encuentre y el derecho a pagarse con preferencia a otros acreedores."
    },
    {
        pregunta: "Para que haya lugar a la indemnización por responsabilidad extracontractual, se requiere copulativamente:",
        opciones: ["A. Dolo o culpa, daño, relación de causalidad y capacidad del autor.", "B. Un contrato previo incumplido y daño patrimonial.", "C. Exclusivamente la prueba de un daño físico.", "D. Que el autor sea mayor de 18 años y cometa un delito penal."],
        correcta: 0,
        explicacion: "La responsabilidad extracontractual (Arts. 2314 y ss) exige la concurrencia de cuatro elementos: acción u omisión culpable o dolosa, capacidad civil, existencia de un daño y nexo causal."
    },
    {
        pregunta: "Si dos o más personas cometen conjuntamente un delito o cuasidelito civil:",
        opciones: ["A. Responden por partes iguales.", "B. Son solidariamente responsables de todo perjuicio.", "C. El juez determina quién es el más culpable y solo él paga.", "D. El Estado asume subsidiariamente el pago."],
        correcta: 1,
        explicacion: "El Art. 2317 consagra una regla excepcional: si un delito o cuasidelito ha sido cometido por dos o más personas, cada una de ellas será solidariamente responsable de todo perjuicio."
    },
    {
        pregunta: "Si una maceta cae desde el balcón de un edificio y lesiona a un peatón, la ley presume:",
        opciones: ["A. Culpabilidad de todas las personas que habitan la parte del edificio de donde cayó.", "B. El peatón debe probar la culpa exacta de quien la tiró.", "C. Es un caso fortuito, nadie responde.", "D. Responde el arquitecto del edificio."],
        correcta: 0,
        explicacion: "El daño causado por una cosa que cae de la parte superior de un edificio es imputable a todas las personas que habitan la misma parte, dividiéndose la indemnización entre todas (Art. 2328)."
    },
    {
        pregunta: "Si la víctima se expuso imprudentemente al daño (por ejemplo, cruzó con luz roja y fue atropellada):",
        opciones: ["A. El conductor queda totalmente eximido de responsabilidad.", "B. El juez debe reducir prudencialmente la indemnización.", "C. El peatón debe indemnizar al conductor.", "D. No tiene efecto en materia civil."],
        correcta: 1,
        explicacion: "Es la hipótesis del Art. 2330. La apreciación del daño está sujeta a reducción si el que lo ha sufrido se expuso a él imprudentemente (concurrencia de culpas)."
    },
    {
        pregunta: "En el régimen de participación en los gananciales, durante su vigencia:",
        opciones: ["A. Los cónyuges administran en conjunto todos los bienes.", "B. El marido administra los bienes de ambos.", "C. Cada cónyuge administra su patrimonio libremente, como si estuvieran separados de bienes.", "D. Ninguno puede enajenar inmuebles sin autorización del juez."],
        correcta: 2,
        explicacion: "Durante la vigencia de este régimen, funciona como una separación total de bienes. Solo al término del régimen se calculan los patrimonios para la compensación (Art. 1792-1 y ss)."
    },
    {
        pregunta: "¿Cuál es el principal efecto de la declaración de un inmueble como 'bien familiar'?",
        opciones: ["A. Pasa a ser propiedad de los hijos comunes.", "B. No se puede enajenar ni gravar sin el consentimiento del cónyuge no propietario.", "C. Se vuelve inembargable de forma absoluta.", "D. Queda exento del pago de contribuciones."],
        correcta: 1,
        explicacion: "El cónyuge dueño no puede vender, hipotecar o arrendar la propiedad sin la autorización específica del otro cónyuge. No es inembargable de forma absoluta, pero la familia goza del beneficio de excusión."
    },
    {
        pregunta: "El patrimonio reservado de la mujer casada (Art. 150) opera bajo sociedad conyugal y requiere que la mujer:",
        opciones: ["A. Haya aportado bienes inmuebles antes del matrimonio.", "B. Reciba una herencia durante el matrimonio.", "C. Ejerza un trabajo remunerado separado de su marido.", "D. Tenga capitulaciones matrimoniales."],
        correcta: 2,
        explicacion: "El Art. 150 señala que la mujer casada que ejerce una profesión, oficio o industria separados de su marido, se mirará como separada de bienes respecto de lo adquirido fruto de ese trabajo."
    },
    {
        pregunta: "La sucesión en los bienes de una persona se abre:",
        opciones: ["A. Al momento en que se dicta la posesión efectiva.", "B. En el momento exacto de su muerte, en su último domicilio.", "C. Cuando los herederos aceptan la herencia ante notario.", "D. Cuando se paga el impuesto de herencias."],
        correcta: 1,
        explicacion: "Según el Art. 955 del Código Civil, la sucesión se abre en el momento de la muerte del causante y en su último domicilio."
    },
    {
        pregunta: "Son asignaciones forzosas en el derecho chileno, que el testador está obligado a respetar:",
        opciones: ["A. Los alimentos que se deben por ley, las legítimas y la cuarta de mejoras.", "B. La mitad legitimaria exclusivamente.", "C. Solo los legados a favor del Fisco.", "D. La cuarta de libre disposición."],
        correcta: 0,
        explicacion: "El Art. 1167 define las asignaciones forzosas. El testador está obligado a hacerlas: los alimentos debidos por ley, las legítimas y la cuarta de mejoras."
    },
    {
        pregunta: "En la sucesión intestada, el 'derecho de representación' es una ficción legal que permite a:",
        opciones: ["A. Un abogado comparecer en representación de los herederos ausentes.", "B. Los hijos ocupar el lugar y grado de su padre o madre que no quiso o no pudo suceder.", "C. El cónyuge sobreviviente representar a los hijos menores.", "D. Un legatario exigir la entrega de su cosa."],
        correcta: 1,
        explicacion: "Definido en el Art. 984. Los descendientes suben a ocupar el lugar de su padre/madre premuerto, incapaz o que repudió la herencia, para recibir la porción que a este le habría correspondido."
    }
];

app.post('/api/quiz/generar', async (req, res) => {
    try {
        const totalPreguntas = bancoPreguntasAlucilex.length;
        const indexAleatorio = Math.floor(Math.random() * totalPreguntas);
        const preguntaData = bancoPreguntasAlucilex[indexAleatorio];
        
        let artData = { numero: "Dogmática General", texto: "Analizando fundamentos esenciales del Código Civil Chileno para el caso práctico." };
        
        try {
            const artAleatorio = Math.floor(Math.random() * 2524) + 1;
            const { data } = await supabase.from('fragmentos_legales')
                .select('contenido')
                .eq('metadatos->>tipo', 'ley')
                .eq('metadatos->>articulo', String(artAleatorio))
                .limit(1);
            if (data && data.length > 0) {
                artData = { numero: artAleatorio, texto: data[0].contenido.replace(/\[.*?\]/g, '').trim() };
            }
        } catch (e) {
            console.log("Quiz: Fallo menor al obtener artículo aleatorio, se usará texto por defecto.");
        }

        res.json({
            articulo: artData,
            pregunta: preguntaData.pregunta,
            opciones: preguntaData.opciones,
            correcta: preguntaData.correcta,
            explicacion: preguntaData.explicacion,
            total: totalPreguntas,
            origen: 'banco_aleatorio_alucilex'
        });

    } catch (error) {
        console.error('Error Crítico en Generador de Quiz:', error);
        res.status(500).json({ error: 'Error interno al generar pregunta de evaluación.' });
    }
});

app.get('/ping', (req, res) => res.status(200).send('OK'));
app.get('/', (req, res) => res.send('API de Alucilex funcionando (Modo Cátedra Magistral Extensa).'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor ALUCILEX Totalmente Blindado en puerto ${PORT}`));