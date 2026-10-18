// motor_caj.js - Matriz Forense CAJ en 4 Fases + Agente Recepcionista e Indagador de WhatsApp
require('dotenv').config();
const axios = require('axios');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODELO = process.env.MODELO_LEGAL || 'openai/gpt-4o-mini';

function obtenerHeadersOpenRouter() {
    return {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.RENDER_EXTERNAL_URL || 'https://alucilex.onrender.com',
        'X-Title': 'Alucilex - Centro de Atencion Juridica CAJ'
    };
}

/**
 * Construye y garantiza la plantilla de encabezado oficial de la CAJ con el nombre del Asesor Jurídico
 */
function aplicarPlantillaEncabezadoCAJ(cuerpoMensaje, nombreAsesor = 'Carlos Rosas', nombreCentro = 'CENTRO DE ATENCIÓN JURÍDICA (CAJ)') {
    const limpio = String(cuerpoMensaje || '').trim();
    if (!limpio) return '';

    const centro = String(nombreCentro || 'CENTRO DE ATENCIÓN JURÍDICA (CAJ)').toUpperCase();
    const asesor = String(nombreAsesor || 'Carlos Rosas').trim();

    // Evitar duplicar el encabezado si el modelo ya lo incluyó
    if (limpio.includes('CENTRO DE ATENCIÓN JURÍDICA') && limpio.toLowerCase().includes(asesor.toLowerCase())) {
        return limpio;
    }

    const encabezado = [
        `🏛️ *${centro}*`,
        `⚖️ *Asesor Jurídico a cargo:* ${asesor}`,
        `━━━━━━━━━━━━━━━━━━━━━━`
    ].join('\n');

    return `${encabezado}\n\n${limpio}`;
}

/**
 * Extractor heurístico de respaldo (RUT y datos básicos) por si la IA falla o para enriquecer antes de guardar
 */
function extraerDatosHeuristicos(texto = '', fichaPrevia = {}) {
    const resultado = { ...fichaPrevia };
    const str = String(texto || '');

    // Detectar RUT chileno (ej. 12.345.678-9 o 12345678-K)
    const matchRut = str.match(/\b(\d{1,2}\.?\d{3}\.?\d{3}-[\dkK])\b/);
    if (matchRut && !resultado.usuario_rut) {
        resultado.usuario_rut = matchRut[1].replace(/\./g, '').toUpperCase();
    }

    // Detectar email si se menciona
    const matchEmail = str.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (matchEmail && !resultado.email) {
        resultado.email = matchEmail[0].toLowerCase();
    }

    return resultado;
}

/**
 * AGENTE RECEPCIONISTA E INDAGADOR WHATSAPP CAJ:
 * - Extrae y actualiza datos personales de la ficha (nombre, RUT, dirección, comuna, profesión, contraparte, materia) y los HECHOS.
 * - Procesa tanto los mensajes del cliente como los del asesor jurídico (cuando silencioso = true).
 * - Cuando la IA tiene el control (silencioso = false), guía paso a paso al usuario y responde con la plantilla oficial del Centro de Atención Jurídica.
 */
async function analizarMensajeWhatsAppCAJ({ jid, texto = '', delAsesor = false, contexto = {}, silencioso = false }) {
    const fichaActual = contexto.fichaActual || {};
    const historial = Array.isArray(contexto.historial) ? contexto.historial : [];
    const nombreAsesor = contexto.asesorNombre || fichaActual.postulante_nombre || process.env.CAJ_ASESOR_NOMBRE || 'Carlos Rosas';
    const nombreCentro = contexto.centroNombre || fichaActual.centro_caj || process.env.CAJ_NOMBRE_CENTRO || 'CENTRO DE ATENCIÓN JURÍDICA (CAJ)';

    const baseHeuristica = extraerDatosHeuristicos(texto, fichaActual);
    const transcripcion = historial.map(m => {
        const etiqueta = m.autor === 'asesor_juridico' ? `ASESOR JURÍDICO (${nombreAsesor})` : (m.autor === 'ia_caj' ? 'RECEPCIONISTA IA CAJ' : 'CLIENTE');
        return `[${etiqueta}]: ${m.texto}`;
    }).join('\n');

    const promptSistema = `Eres el Recepcionista e Indagador Jurídico Oficial del ${nombreCentro} en Chile.
El Asesor Jurídico titular que tomará este caso es: ${nombreAsesor}.

TU DOBLE MISIÓN EN CADA MENSAJE:
1. INDAGACIÓN Y EXTRACCIÓN PARA LA FICHA CAJ (Siempre activa, incluso si habla el asesor):
   Analiza toda la conversación acumulada y el último mensaje para extraer y actualizar los datos de la ficha del cliente y los hechos del caso:
   - Nombre completo del cliente (usuario_nombre)
   - RUT del cliente (usuario_rut, formato 12345678-9)
   - Dirección / domicilio exacto (domicilio) y Comuna (comuna)
   - Profesión u oficio (profesion) y correo electrónico (email)
   - Materia jurídica (Familia, Laboral, Civil, Arrendamiento, Pensión de Alimentos, Divorcio, Despido Injustificado, Posesión Efectiva, etc.)
   - Nombre, RUT y domicilio de la contraparte o empleador (si aplica)
   - HECHOS RELEVANTES (hechos como lista de hitos concretos y relato_hechos como narración cronológica detallada: fechas, montos, hijos involucrados, acuerdos previos, problema principal y urgencias como audiencias próximas).

2. GUÍA EMPÁTICA AL CLIENTE (Cuando silencioso = false):
   - Actúa como recepcionista e indagador del Centro de Atención Jurídica preparando la carpeta para el asesor jurídico ${nombreAsesor}.
   - Revisa qué datos de la ficha o de los hechos FALTAN todavía:
     a) Datos personales indispensables: Nombre completo, RUT, Dirección y Comuna (y profesión/oficio).
     b) Los hechos importantes del caso: qué sucedió, cuándo ocurrió, quién es la contraparte/demandado y qué necesita lograr.
   - Guía al cliente con calidez, claridad y orden (haciendo 1 o 2 preguntas claras a la vez para no abrumarlo) hasta completar su ficha y el relato de los hechos.
   - Cuando ya tengas Nombre, RUT, Dirección y el relato claro de los hechos, confírmale que su ficha y antecedentes quedaron registrados en el sistema para revisión directa del asesor jurídico ${nombreAsesor}.
   - NO incluyas el encabezado institucional en el campo "cuerpo_respuesta" porque el sistema lo estampará automáticamente arriba de tu mensaje.

DEBES RESPONDER EXCLUSIVAMENTE CON UN OBJETO JSON VÁLIDO CON ESTA ESTRUCTURA EXACTA (sin bloques markdown adicionales):
{
  "datos_extraidos": {
    "usuario_nombre": "string o vacío si aún no lo dice",
    "usuario_rut": "string formato 12345678-9 o vacío",
    "domicilio": "string o vacío",
    "comuna": "string o vacío",
    "profesion": "string o vacío",
    "email": "string o vacío",
    "materia": "Familia | Laboral | Civil | General",
    "tribunal": "string o Por determinar",
    "contraparte_nombre": "string o Por determinar",
    "contraparte_rut": "string o S/R",
    "contraparte_domicilio": "string o vacío",
    "hechos": ["hecho 1", "hecho 2"],
    "relato_hechos": "resumen narrativo completo y acumulado de los hechos del caso",
    "ficha_completa": false
  },
  "cuerpo_respuesta": "Texto de tu respuesta guiando al cliente (o cadena vacía si silencioso es true)"
}`;

    const promptUsuario = `ESTADO ACTUAL DE LA FICHA EN FIREBASE:
${JSON.stringify(baseHeuristica, null, 2)}

HISTORIAL RECIENTE DE LA CONVERSACIÓN DE WHATSAPP:
${transcripcion || '(Inicio de la atención)'}

ÚLTIMO MENSAJE RECIBIDO (${delAsesor ? `Enviado por el Asesor Jurídico ${nombreAsesor}` : 'Enviado por el Cliente'}):
"${texto}"

MODO SILENCIOSO (Relevo humano activo): ${silencioso ? 'SÍ (extrae todos los datos y hechos de la conversación pero deja cuerpo_respuesta vacío "")' : 'NO (genera cuerpo_respuesta guiando al cliente para completar su ficha y relatar los hechos)'}

Devuelve únicamente el JSON solicitado.`;

    try {
        if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === 'sk-or-v1-placeholder') {
            throw new Error('OPENROUTER_API_KEY no configurada');
        }

        const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
            model: MODELO,
            messages: [
                { role: 'system', content: promptSistema },
                { role: 'user', content: promptUsuario }
            ],
            temperature: 0.2
        }, {
            headers: obtenerHeadersOpenRouter()
        });

        const rawContent = response.data?.choices?.[0]?.message?.content || '{}';
        const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
        const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : rawContent);

        const datosExtraidos = {
            ...baseHeuristica,
            ...(parsed.datos_extraidos || {})
        };

        // Asegurar que cualquier hecho nuevo o relato del cliente no se pierda nunca
        if (!delAsesor && texto && texto !== '[INICIO_ATENCION_CAJ]') {
            const listaHechos = Array.isArray(datosExtraidos.hechos) ? datosExtraidos.hechos : [];
            if (listaHechos.length === 0) {
                listaHechos.push(texto);
            }
            datosExtraidos.hechos = listaHechos;
        }

        const cuerpo = silencioso ? '' : (parsed.cuerpo_respuesta || parsed.respuesta_humana || '');
        const respuestaConPlantilla = silencioso ? '' : aplicarPlantillaEncabezadoCAJ(cuerpo, nombreAsesor, nombreCentro);

        return {
            datos_extraidos: datosExtraidos,
            respuesta_humana: respuestaConPlantilla
        };
    } catch (error) {
        console.error('⚠️ Error en analizarMensajeWhatsAppCAJ (usando respaldo determinista):', error.message);
        const hechosRespaldo = Array.isArray(baseHeuristica.hechos) ? [...baseHeuristica.hechos] : [];
        if (texto && texto !== '[INICIO_ATENCION_CAJ]') {
            hechosRespaldo.push(`${delAsesor ? '[Asesor] ' : ''}${texto}`);
        }
        const datosRespaldo = {
            ...baseHeuristica,
            hechos: hechosRespaldo,
            relato_hechos: baseHeuristica.relato_hechos
                ? `${baseHeuristica.relato_hechos}. ${texto}`
                : (texto !== '[INICIO_ATENCION_CAJ]' ? texto : '')
        };

        if (silencioso) {
            return { datos_extraidos: datosRespaldo, respuesta_humana: '' };
        }

        const faltantes = [];
        if (!datosRespaldo.usuario_nombre || datosRespaldo.usuario_nombre === 'Usuario CAJ') faltantes.push('*Nombre completo*');
        if (!datosRespaldo.usuario_rut) faltantes.push('*RUT*');
        if (!datosRespaldo.domicilio) faltantes.push('*Dirección y comuna*');

        const mensajeFallback = faltantes.length > 0
            ? `Bienvenido/a a nuestro canal de recepción jurídica. Para armar su ficha de atención y entregar sus antecedentes al asesor jurídico *${nombreAsesor}*, por favor indíqueme:\n\n1. ${faltantes.join(', ')}\n2. Un relato breve de *los hechos de su caso* (qué ocurrió, fechas aproximadas y qué necesita resolver).`
            : `Muchas gracias. He registrado su mensaje en su ficha de atención para el asesor jurídico *${nombreAsesor}*. ¿Desea agregar algún otro hecho relevante o antecedente sobre su caso?`;

        return {
            datos_extraidos: datosRespaldo,
            respuesta_humana: aplicarPlantillaEncabezadoCAJ(mensajeFallback, nombreAsesor, nombreCentro)
        };
    }
}

/**
 * Normaliza y extrae el contenido íntegro de los documentos adjuntos
 */
function formatearDocumentosAdjuntos(documentos) {
    if (!documentos || documentos.length === 0) return 'No se han acompañado documentos aún.';

    return documentos.map((doc, idx) => {
        let d = doc;
        if (typeof doc === 'string' && doc.startsWith('{')) {
            try { d = JSON.parse(doc); } catch (e) {}
        }

        const nombre = d.nombre_archivo || d.nombreArchivo || d.nombre || 'Archivo adjunto';
        const tipo = d.tipo_documento || d.tipo || 'Documento Probatorio';
        const resumen = d.resumen_probatorio || d.resumen || d.glosa_para_otrosi || d.glosaOtrosi || 'Sin resumen';
        const glosa = d.glosa_para_otrosi || d.glosaOtrosi || 'S/G';
        const textoCompleto = d.texto_extraido || d.textoExtraido || '';

        return `=======================================================
[DOCUMENTO ADJUNTO #${idx + 1}]: ${tipo} (${nombre})
- RESUMEN PROBATORIO Y DATOS EXTRAÍDOS:
${resumen}

- GLOSA FORENSE SUGERIDA PARA PRIMER OTROSÍ:
"${glosa}"
${textoCompleto ? `\n- TEXTO ÍNTEGRO DEL DOCUMENTO:\n${textoCompleto.slice(0, 3500)}` : ''}
=======================================================`;
    }).join('\n\n');
}

/**
 * PRODUCTO 1: Genera el Dictamen Técnico en 3 Fases (Ficha de Partes, Cronología y Hoja de Ruta CAJ)
 */
async function generarInformeJuridico(caso) {
    const documentosTexto = formatearDocumentosAdjuntos(caso.documentos_probatorios);

    const promptSistema = `Eres un Abogado Tutor Senior y Asesor Forense de la Corporación de Asistencia Judicial (CAJ) en Chile, experto en litigación laboral, de familia y civil.

Tu misión es emitir un DICTAMEN FORENSE DE ESTRATEGIA Y VIABILIDAD estructurado rigurosamente en las siguientes 3 Fases de la técnica procesal chilena:

======================================================================
FASE 1: FICHA DE COMPARECENCIA E INDIVIDUALIZACIÓN PROCESAL
(Art. 254 N° 2 y 3 CPC / Art. 57 Ley 19.968 / Art. 446 Código del Trabajo)
======================================================================
Extrae exhaustivamente todos los datos de los incumbentes (tanto del relato como de los documentos adjuntos):
1. PARTE DEMANDANTE (ACTOR):
   - Nombre completo:
   - RUT:
   - Profesión u oficio:
   - Domicilio completo y Comuna:
   - Contacto (teléfono y correo):
2. PARTE DEMANDADA (CONTRAPARTE O EMPLEADOR):
   - Nombre o Razón Social:
   - RUT:
   - Representante legal (si es persona jurídica) y RUT:
   - Domicilio para notificaciones y Comuna:
3. HIJOS / CARGAS / BENEFICIARIOS VINCULADOS:
   - Nombres, RUTs, edades y situación de dependencia.

======================================================================
FASE 2: RECONSTRUCCIÓN CRONOLÓGICA Y CORRELACIÓN FÁCTICA
======================================================================
Cruza el relato del usuario con la evidencia de los documentos y construye una línea de tiempo ordenada:
- Hito 1: Origen de la relación jurídica (Fecha y lugar de inicio de relación laboral, matrimonio o nacimiento).
- Hito 2: Desarrollo fáctico y acuerdos previos.
- Hito 3: Hecho detonante o incumplimiento (Despido, cese de pagos de pensión, cese de convivencia).
- Hito 4: Consecuencias y perjuicio económico actual (Cesantía, montos adeudados, vulnerabilidad).

======================================================================
FASE 3: DICTAMEN EN DERECHO Y HOJA DE RUTA PARA EL POSTULANTE
======================================================================
1. CALIFICACIÓN JURÍDICA DE LA ACCIÓN:
   - Tipo exacto de demanda o acción a interponer y Tribunal Competente con jurisdicción territorial.
2. MARCO LEGAL APLICABLE:
   - Artículos específicos del Código del Trabajo, Código Civil, Ley N° 19.968 o Ley N° 14.908.
3. TRÁMITES PREVIOS Y REQUISITOS DE ADMISIBILIDAD:
   - Si es Familia: ¿Requiere acta de Mediación Frustrada previa obligatoria?
   - Si es Laboral: ¿Se presentó reclamo en la Inspección del Trabajo para suspender la caducidad de 60 días?
4. MEDIDAS CAUTELARES URGENTES:
   - Peticiones previas o accesorias necesarias (alimentos provisorios, retención de sueldo, arraigo, embargo).
5. CHECK-LIST DE PRUEBA FALTANTE:
   - Lista concreta de documentos que el usuario todavía debe aportar para asegurar el juicio.`;

    const promptUsuario = `ANTECEDENTES DEL EXPEDIENTE REGISTRADOS EN BD:
RUT Titular: ${caso.rut_titular || caso.usuario_rut || 'S/R'}
Materia referencial: ${caso.materia || 'Determinar según documentos'}
Tribunal referencial: ${caso.tribunal || caso.datos_causa?.tribunal || 'Determinar según documentos'}
Usuario informado: ${caso.usuario_nombre || caso.usuario?.nombre || 'No informado'} (RUT: ${caso.usuario_rut || caso.usuario?.rut || 'S/R'})
Domicilio informado: ${caso.usuario?.domicilio || 'No informado'} (${caso.usuario?.comuna || ''})
Contraparte informada: ${caso.contraparte_nombre || caso.contraparte?.nombre || 'No informada'}
Relato manual y de WhatsApp:
${Array.isArray(caso.hechos) ? caso.hechos.join('. ') : (caso.hechos || caso.relato_hechos || 'Sin relato manual')}

EVIDENCIA Y DOCUMENTACIÓN ADJUNTA (FUENTE PRINCIPAL DE DATOS):
${documentosTexto}

Emite el dictamen forense completo con las Fases 1, 2 y 3.`;

    try {
        const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
            model: MODELO,
            messages: [
                { role: 'system', content: promptSistema },
                { role: 'user', content: promptUsuario }
            ],
            temperature: 0.1
        }, {
            headers: obtenerHeadersOpenRouter()
        });

        return response.data.choices[0].message.content.trim();
    } catch (error) {
        const detalle = error.response ? JSON.stringify(error.response.data) : error.message;
        throw new Error(`Error al generar dictamen forense: ${detalle}`);
    }
}

/**
 * PRODUCTO 2: Confecciona el Borrador Forense formal para la OJV (Fase 4)
 */
async function confeccionarEscritoJudicial(caso, tipoEscritoSolicitado, informePrevio) {
    const documentosTexto = formatearDocumentosAdjuntos(caso.documentos_probatorios);

    const promptSistema = `Eres un Redactor Forense Senior de la Corporación de Asistencia Judicial (CAJ) en Chile.
Tu misión es redactar la FASE 4: EL BORRADOR FORMAL DE ESCRITO JUDICIAL para ser ingresado electrónicamente a la Oficina Judicial Virtual (OJV) del Poder Judicial chileno.

REGLAS DE CONFECCIÓN FORENSE ESTRICTAS:
1. SUMA Y TRIBUNAL:
   - Suma formal completa (EN LO PRINCIPAL: Demanda...; PRIMER OTROSÍ: Documentos que se acompañan; SEGUNDO OTROSÍ: Medida cautelar si procede; TERCER OTROSÍ: Privilegio de pobreza y patrocinio).
   - Presidido ante el Tribunal competente (S. J. L. de Letras del Trabajo, S. J. L. de Familia, etc.).
2. COMPARECENCIA IMPECABLE (Utiliza los datos exactos individualizados en la Fase 1 del informe previo):
   - "[Nombre Demandante], [profesión u oficio], cédula nacional de identidad N° [RUT], con domicilio en [dirección completa, comuna], a US., respetuosamente digo:"
3. EXPOSICIÓN DE HECHOS:
   - Redacción formal numerada derivada de la cronología de la Fase 2, fundamentada en los documentos.
4. FUNDAMENTOS DE DERECHO:
   - Articulación jurídica sustantiva y adjetiva de la Fase 3.
5. PETITORIO LÍQUIDO Y CONCLUSIVO:
   - Peticiones precisas, expresas y cuantitativas si procede.
6. PRIMER OTROSÍ (DOCUMENTOS ACOMPAÑADOS):
   - Incorpora cada documento probatorio adjunto acompañado con su glosa judicial formal, explicitando qué hecho acredita.
7. OTROSÍES ACCESORIOS:
   - Medida cautelar o provisoria si corresponde.
   - Privilegio de pobreza y patrocinio y poder de la CAJ (Ley N° 17.995 y art. 6 Ley N° 18.120), fijando domicilio procesal y correo de la Corporación.`;

    const promptUsuario = `EXPEDIENTE JUDICIAL:
RUT Titular: ${caso.rut_titular || caso.usuario_rut || 'S/R'}
Tipo de escrito solicitado: ${tipoEscritoSolicitado || 'Demanda correspondiente según antecedentes'}
Materia: ${caso.materia || 'Determinar según documentos'}
Tribunal: ${caso.tribunal || caso.datos_causa?.tribunal || 'Determinar según documentos'}

DATOS DE LOS DOCUMENTOS ADJUNTOS:
${documentosTexto}

ANÁLISIS PREVIO DEL INFORME (FASES 1, 2 Y 3):
${informePrevio || 'Sin informe previo'}

Redacta el borrador formal de escrito judicial completo para la OJV.`;

    try {
        const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
            model: MODELO,
            messages: [
                { role: 'system', content: promptSistema },
                { role: 'user', content: promptUsuario }
            ],
            temperature: 0.1
        }, {
            headers: obtenerHeadersOpenRouter()
        });

        return response.data.choices[0].message.content.trim();
    } catch (error) {
        const detalle = error.response ? JSON.stringify(error.response.data) : error.message;
        throw new Error(`Error al confeccionar escrito judicial: ${detalle}`);
    }
}

module.exports = {
    aplicarPlantillaEncabezadoCAJ,
    analizarMensajeWhatsAppCAJ,
    generarInformeJuridico,
    confeccionarEscritoJudicial,
    generarDictamenYEscrito: async (caso, tipo) => {
        const inf = await generarInformeJuridico(caso);
        const esc = await confeccionarEscritoJudicial(caso, tipo, inf);
        return { informe: inf, escrito: esc };
    }
};