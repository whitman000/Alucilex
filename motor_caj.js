// motor_caj.js - Matriz Forense CAJ en 4 Fases (Derecho Chileno Integral)
require('dotenv').config();
const axios = require('axios');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODELO = process.env.MODELO_LEGAL || 'openai/gpt-4o-mini';

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
Contraparte informada: ${caso.contraparte_nombre || caso.contraparte?.nombre || 'No informada'}
Relato manual:
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
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json'
            }
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
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data.choices[0].message.content.trim();
    } catch (error) {
        const detalle = error.response ? JSON.stringify(error.response.data) : error.message;
        throw new Error(`Error al confeccionar escrito judicial: ${detalle}`);
    }
}

module.exports = {
    generarInformeJuridico,
    confeccionarEscritoJudicial,
    generarDictamenYEscrito: async (caso, tipo) => {
        const inf = await generarInformeJuridico(caso);
        const esc = await confeccionarEscritoJudicial(caso, tipo, inf);
        return { informe: inf, escrito: esc };
    }
};