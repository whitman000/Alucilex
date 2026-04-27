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

// ========== DICCIONARIO DE ORO (COMPLETO E INTACTO) ==========
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

// ========== MANTENIMIENTO DE MEMORIA (EVITA CAÍDAS DEL SERVIDOR) ==========
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
setInterval(limpiarCaches, 600000); // Limpia cada 10 minutos

function hashTexto(texto) {
    return crypto.createHash('sha256').update(texto).digest('hex');
}

// ========== FUNCIONES AUXILIARES DE BÚSQUEDA ==========
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

async function buscarArticuloPorNumero(numero) {
    try {
        const { data, error } = await supabase
            .from('fragmentos_legales')
            .select('contenido, metadatos, id')
            .eq('metadatos->>tipo', 'ley')
            .filter('metadatos->>articulo', 'eq', String(numero))
            .limit(1);
        if (!error && data && data.length > 0) return data[0];
    } catch (e) {
        console.error("Error buscando artículo por número:", e.message);
    }
    return null;
}

async function buscarDoctrina(embedding, limite = 10) {
    try {
        const { data, error } = await supabase.rpc('buscar_fragmentos', {
            query_embedding: embedding,
            filtro_tipo: 'doctrina',
            match_threshold: 0.25,
            match_count: limite
        });
        if (!error && data) return data;
    } catch (e) {
        console.error("Error buscando doctrina vectorial:", e.message);
    }
    return [];
}

// ===================== ENDPOINT PRINCIPAL HÍBRIDO =====================
app.post('/api/consultar', async (req, res) => {
    const { pregunta, sessionId } = req.body;
    if (!pregunta) return res.status(400).json({ error: "Pregunta vacía" });
    if (!sessionId) return res.status(400).json({ error: "Se requiere sessionId" });

    const hashPregunta = hashTexto(pregunta);
    const respuestaCacheada = cacheRespuestas.get(hashPregunta);
    if (respuestaCacheada && Date.now() - respuestaCacheada.timestamp < TTL_RESPUESTA) {
        res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' });
        res.write(`data: ${JSON.stringify({ content: respuestaCacheada.respuesta })}\n\n`);
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
    const matchNumero = pregunta.match(/(?:art(?:[íi]culo|\.?)?\s*)?(\d{1,4})(?!\d)/i);
    
    if (matchNumero && matchNumero[1]) {
        numeroArticuloDetectado = matchNumero[1];
    } else {
        const fromDic = buscarEnDiccionario(pregunta);
        if (fromDic) numeroArticuloDetectado = fromDic.toString();
    }

    let busquedaExitosa = false;
    let contextoLey = "";
    
    if (numeroArticuloDetectado) {
        articuloObjeto = await buscarArticuloPorNumero(numeroArticuloDetectado);
        if (articuloObjeto) {
            contextoLey = `[ARTÍCULO OFICIAL CC] Art. ${numeroArticuloDetectado}: ${articuloObjeto.contenido.replace(/\[.*?\]/g, '').trim()}`;
            busquedaExitosa = true;
        }
    }

    // 2. Generar embedding y buscar Doctrina
    let embedding = null;
    let doctrinaTextos = [];
    if (cacheEmbeddings.has(hashPregunta)) {
        embedding = cacheEmbeddings.get(hashPregunta);
    } else {
        try {
            const embeddingResponse = await openai.embeddings.create({
                model: 'openai/text-embedding-3-small',
                input: pregunta.substring(0, 8000),
                dimensions: 768
            });
            embedding = embeddingResponse.data[0].embedding;
            cacheEmbeddings.set(hashPregunta, embedding);
        } catch (err) {
            console.log("Error embedding:", err.message);
        }
    }

    if (embedding) {
        const resultados = await buscarDoctrina(embedding, 8); // Bajado a 8 para evitar Data Flood
        doctrinaTextos = resultados.map(f => f.contenido || f.texto || '');
    }

    // 3. Evaluar si usar base de datos o conocimiento de la IA
    let contextoDoctrina = doctrinaTextos.length ? doctrinaTextos.join('\n\n---\n\n') : '';
    const hayContextoLocal = busquedaExitosa || doctrinaTextos.length > 0;

    const contextoTotal = hayContextoLocal 
        ? `### CONTEXTO DE LA BASE DE DATOS:\n${contextoLey}\n\n### DOCTRINA:\n${contextoDoctrina}`
        : `### AVISO DEL SISTEMA: No se encontraron artículos exactos en la base de datos local. RESPONDE USANDO TU CONOCIMIENTO OFICIAL ENTRENADO SOBRE EL CÓDIGO CIVIL DE CHILE Y LA DOCTRINA CHILENA.`;

    const systemPrompt = 
        "Eres Alucilex, un catedrático de Derecho Civil chileno. Debes responder con profundidad académica, como si dictaras una clase.\n\n" +
        "REGLAS ESTRICTAS:\n" +
        "1. **SI HAY CONTEXTO DE BASE DE DATOS:** Inicia tu respuesta copiando exactamente el artículo del Código Civil que aparece en el contexto.\n" +
        "2. **SI NO HAY CONTEXTO (AVISO DEL SISTEMA):** Extrae de tu propio entrenamiento la respuesta, el artículo aplicable del Código Civil Chileno y los conceptos doctrinarios (Alessandri, Somarriva, Orrego). Nunca digas 'no tengo información'.\n" +
        "3. **DESARROLLO OBLIGATORIO:** Desarrolla: Concepto doctrinal, Requisitos, Características, Ejemplos prácticos y Conclusión.\n" +
        "4. **PROHIBIDO:** Responder con esquemas o listas cortas. Redacta en prosa académica conectada.\n" +
        "5. **CITA FUENTES:** Si usas doctrina, indícalo al final como '### Fuentes utilizadas'.";

    let mensajes = [{ role: "system", content: systemPrompt }];
    for (let msg of historial) mensajes.push(msg);
    mensajes.push({
        role: "user",
        content: `${contextoTotal}\n\nPregunta del usuario: ${pregunta}`
    });

    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' });

    if (articuloObjeto) {
        res.write(`data: ${JSON.stringify({ content: `📜 **Art. ${numeroArticuloDetectado} del Código Civil**\n\n${articuloObjeto.contenido.replace(/\[.*?\]/g, '').trim()}\n\n---\n\n` })}\n\n`);
    }

    let respuestaFinal = "";

    try {
        const stream = await openai.chat.completions.create({
            model: "deepseek/deepseek-chat",
            messages: mensajes,
            temperature: 0.2,
            max_tokens: 4500, // Ajustado para prevenir errores de límite
            stream: true,
        });
        
        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            respuestaFinal += content;
            res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
    } catch (err) {
        console.error("Error en el stream de DeepSeek:", err.message);
        res.write(`data: ${JSON.stringify({ content: "\n\n❌ Hubo un fallo en la conexión con la cátedra virtual. Por favor, reformula tu pregunta." })}\n\n`);
    }

    res.write('data: [DONE]\n\n');
    res.end();

    if (respuestaFinal.length > 50) {
        cacheRespuestas.set(hashPregunta, { respuesta: respuestaFinal, timestamp: Date.now() });
        historial.push({ role: "user", content: pregunta });
        historial.push({ role: "assistant", content: respuestaFinal });
        conversaciones.set(sessionId, historial.slice(-MAX_HISTORIAL));
    }
});

// ======================== QUIZ NO BLOQUEANTE ========================
const bancoPreguntasAlucilex = [
    {
        pregunta: "Juan le dona a Pedro un automóvil con la condición de que este último 'no se case nunca'. Según el CC chileno, ¿cuál es el efecto de esta condición?",
        opciones: ["A. La condición es válida y Pedro pierde el auto si se casa.", "B. La condición se tiene por no escrita y la donación es pura y simple.", "C. La condición anula el acto jurídico por completo.", "D. La condición es válida pero solo por 10 años."],
        correcta: 1,
        explicacion: "El artículo 1073 del Código Civil establece que la condición de no casarse 'se tendrá por no escrita', salvo que se limite a no casarse antes de cumplir la mayoría de edad. La donación vale."
    },
    {
        pregunta: "Un joven de 16 años (menor adulto) vende su bicicleta sin la autorización de su representante legal. ¿Qué sanción civil acarrea este acto?",
        opciones: ["A. Nulidad Absoluta.", "B. Inexistencia.", "C. Nulidad Relativa.", "D. Resciliación."],
        correcta: 2,
        explicacion: "Los actos de los menores adultos adolecen de nulidad relativa, ya que su incapacidad no es absoluta y el acto puede ser saneado por la ratificación del representante (Art. 1682)."
    },
    {
        pregunta: "María, para evitar el embargo, celebra una compraventa con su hermano sobre su casa, pero acuerdan en secreto que no habrá pago. ¿Qué tipo de simulación es?",
        opciones: ["A. Simulación lícita.", "B. Simulación relativa.", "C. Simulación absoluta.", "D. Reserva mental."],
        correcta: 2,
        explicacion: "Es simulación absoluta. Celebran un acto jurídico, pero en realidad no quieren celebrar acto alguno (es una fachada)."
    },
    {
        pregunta: "Para que la fuerza vicie el consentimiento, el Código Civil exige que sea:",
        opciones: ["A. Injusta, grave y determinante.", "B. Física, actual e irresistible.", "C. Moral, leve y proveniente de la contraparte.", "D. Exclusivamente económica."],
        correcta: 0,
        explicacion: "La fuerza debe ser grave (producir una impresión fuerte), injusta (contraria a derecho) y determinante (el acto se celebra a consecuencia de ella, Art. 1456)."
    },
    {
        pregunta: "Según el Art. 1464 del Código Civil, hay objeto ilícito en la enajenación de:",
        opciones: ["A. Las cosas que no existen pero se espera que existan.", "B. Los derechos que no pueden transferirse a otra persona.", "C. Las cosas embargadas por decreto judicial, incluso con autorización.", "D. Los bienes raíces en zonas fronterizas."],
        correcta: 1,
        explicacion: "El Art. 1464 Nº 2 señala expresamente que hay objeto ilícito en la enajenación de los derechos y privilegios que no pueden transferirse a otras personas."
    },
    {
        pregunta: "¿Cuál de los siguientes modos de adquirir el dominio es de carácter 'originario'?",
        opciones: ["A. La tradición.", "B. La sucesión por causa de muerte.", "C. La ocupación.", "D. La cesión de derechos."],
        correcta: 2,
        explicacion: "La ocupación es originaria, el dominio nace por primera vez en el patrimonio del adquirente al apoderarse de una cosa sin dueño."
    },
    {
        pregunta: "Para que exista 'posesión regular' de un inmueble, ¿qué requisitos se exigen?",
        opciones: ["A. Justo título, buena fe inicial y, si el título es traslaticio, la tradición.", "B. Dominio, capacidad y buena fe permanente.", "C. Inscripción conservatoria por al menos 10 años.", "D. Mero tenedor, título gratuito y buena fe."],
        correcta: 0,
        explicacion: "Art. 702 CC: Requiere justo título y buena fe al momento de adquirirla. Si es título traslaticio, requiere la tradición."
    },
    {
        pregunta: "Si un río cambia definitivamente su cauce, dejando en seco una franja. ¿Qué accesión es?",
        opciones: ["A. Aluvión.", "B. Avulsión.", "C. Adjunción.", "D. Mutación de álveo o cambio de cauce."],
        correcta: 3,
        explicacion: "Es mutación de álveo. Los propietarios riberanos acceden a la parte descubierta en proporción a sus líneas (Art. 654)."
    },
    {
        pregunta: "La tradición del dominio de los bienes raíces se efectúa por:",
        opciones: ["A. La entrega material de las llaves.", "B. La firma de la escritura pública.", "C. La inscripción del título en el CBR.", "D. El pago íntegro del precio."],
        correcta: 2,
        explicacion: "Art. 686 CC: La tradición de bienes raíces solo se verifica mediante la inscripción en el Conservador de Bienes Raíces."
    },
    {
        pregunta: "El arrendatario de una casa tiene respecto de ella la calidad de:",
        opciones: ["A. Poseedor irregular.", "B. Poseedor regular.", "C. Mero tenedor.", "D. Propietario fiduciario."],
        correcta: 2,
        explicacion: "Es mero tenedor (Art. 714 CC), ejerce la tenencia no como dueño, sino a nombre del dueño."
    },
    {
        pregunta: "¿En qué tipo de contratos va envuelta siempre la condición resolutoria tácita?",
        opciones: ["A. En los contratos unilaterales.", "B. En los contratos bilaterales.", "C. En los contratos reales.", "D. En los contratos gratuitos."],
        correcta: 1,
        explicacion: "Art. 1489: En los contratos bilaterales va envuelta la condición resolutoria de no cumplirse por uno lo pactado."
    },
    {
        pregunta: "Si tres amigos piden un préstamo con solidaridad pasiva, el banco puede exigir:",
        opciones: ["A. A cada uno un tercio exclusivamente.", "B. El total de la deuda a cualquiera de ellos.", "C. Solo al de mayor patrimonio.", "D. Primero al fiador."],
        correcta: 1,
        explicacion: "Solidaridad pasiva (Art. 1514): el acreedor puede dirigirse contra cualquiera por el total de la deuda."
    },
    {
        pregunta: "¿Qué función principal cumple la cláusula penal en un contrato?",
        opciones: ["A. Pagar impuestos.", "B. Avaluar anticipada y convencionalmente los perjuicios.", "C. Extinguir la obligación automáticamente.", "D. Establecer la nulidad."],
        correcta: 1,
        explicacion: "Art. 1535: Sirve como avaluación anticipada de los perjuicios por incumplimiento o retardo."
    },
    {
        pregunta: "La máxima 'la mora purga la mora' (Art. 1552) significa en contratos bilaterales que:",
        opciones: ["A. Ninguno está en mora si el otro no cumple o no se allana a cumplir.", "B. La mora perdona intereses.", "C. Hay que demandar dos veces.", "D. No existe mora bilateral."],
        correcta: 0,
        explicacion: "Es la excepción de contrato no cumplido. Uno no puede exigir cumplimiento si él mismo no ha cumplido o está dispuesto a hacerlo."
    },
    {
        pregunta: "El vendedor de un bien raíz sufre lesión enorme cuando:",
        opciones: ["A. El precio que recibe es inferior a la mitad del justo precio.", "B. El justo precio es inferior a la mitad de lo pagado.", "C. Vende un mueble por menos del costo.", "D. Es engañado."],
        correcta: 0,
        explicacion: "Art. 1889: El vendedor sufre lesión enorme si recibe un precio inferior a la mitad del justo precio."
    },
    {
        pregunta: "Los vicios redhibitorios u ocultos dan al comprador el derecho a:",
        opciones: ["A. Denunciar por estafa.", "B. Exigir la resolución del contrato o rebaja proporcional del precio.", "C. Exigir bien de reemplazo.", "D. Nada."],
        correcta: 1,
        explicacion: "Arts. 1857 y 1868: Dan origen a la acción redhibitoria (rescindir) o estimatoria (rebajar precio)."
    },
    {
        pregunta: "Para que haya lugar a la indemnización por responsabilidad extracontractual, se requiere:",
        opciones: ["A. Dolo o culpa, daño, relación de causalidad y capacidad.", "B. Contrato previo y daño.", "C. Daño físico exclusivo.", "D. Ser mayor de edad y delito penal."],
        correcta: 0,
        explicacion: "Arts. 2314 y ss: Acción/omisión culpable o dolosa, capacidad civil, daño y nexo causal."
    },
    {
        pregunta: "Si la víctima se expuso imprudentemente al daño, el juez debe:",
        opciones: ["A. Eximir de responsabilidad al autor.", "B. Reducir prudencialmente la indemnización.", "C. Obligar a la víctima a pagar.", "D. Ignorarlo."],
        correcta: 1,
        explicacion: "Art. 2330: La apreciación del daño está sujeta a reducción por exposición imprudente (concurrencia de culpas)."
    },
    {
        pregunta: "La sucesión en los bienes de una persona se abre:",
        opciones: ["A. Al dictarse posesión efectiva.", "B. En el momento exacto de su muerte, en su último domicilio.", "C. Al aceptar la herencia.", "D. Al pagar el impuesto."],
        correcta: 1,
        explicacion: "Art. 955 CC: La sucesión se abre en el momento de la muerte y en su último domicilio."
    },
    {
        pregunta: "En la sucesión intestada, el 'derecho de representación' permite a:",
        opciones: ["A. Un abogado comparecer.", "B. Los hijos ocupar el lugar de su padre/madre que no quiso o no pudo suceder.", "C. Al cónyuge representar hijos.", "D. Al legatario exigir su cosa."],
        correcta: 1,
        explicacion: "Art. 984: Los descendientes suben a ocupar el lugar del padre/madre premuerto, incapaz o que repudió."
    }
];

app.post('/api/quiz/generar', async (req, res) => {
    try {
        const totalPreguntas = bancoPreguntasAlucilex.length;
        const indexAleatorio = Math.floor(Math.random() * totalPreguntas);
        const preguntaData = bancoPreguntasAlucilex[indexAleatorio];
        
        let artData = { numero: "Dogmática", texto: "Analizando fundamentos del Código Civil." };
        
        // Petición a Supabase sin bloquear (timeout natural)
        try {
            const artAleatorio = Math.floor(Math.random() * 2524) + 1;
            const { data } = await supabase.from('fragmentos_legales')
                .select('contenido')
                .eq('metadatos->>tipo', 'ley')
                .eq('metadatos->>articulo', String(artAleatorio))
                .limit(1);
            if (data && data.length > 0) {
                artData = { numero: artAleatorio, texto: data[0].contenido };
            }
        } catch (e) {
            console.log("Quiz: Fallo al obtener artículo de fondo, usando default.");
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
        res.status(500).json({ error: 'Error interno al generar pregunta.' });
    }
});

// Rutas de mantenimiento
app.get('/ping', (req, res) => res.status(200).send('OK'));
app.get('/', (req, res) => res.send('API de Alucilex funcionando (Motor Híbrido).'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor ALUCILEX Blindado en puerto ${PORT}`));