// motor_caj.js - Motor de Diagnóstico Jurídico y Redacción Forense Integral (Derecho Chileno General)
require('dotenv').config();
const axios = require('axios');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODELO = process.env.MODELO_LEGAL || 'openai/gpt-4o-mini';

/**
 * Normaliza y extrae el contenido completo de los documentos probatorios adjuntos
 */
function formatearDocumentosAdjuntos(documentos) {
    if (!documentos || documentos.length === 0) return 'No se han adjuntado documentos.';

    return documentos.map((doc, idx) => {
        let d = doc;
        if (typeof doc === 'string' && doc.startsWith('{')) {
            try { d = JSON.parse(doc); } catch (e) {}
        }

        const nombre = d.nombre_archivo || d.nombreArchivo || d.nombre || 'Archivo adjunto';
        const tipo = d.tipo_documento || d.tipo || 'Documento';
        const resumen = d.resumen_probatorio || d.resumen || d.glosa_para_otrosi || d.glosaOtrosi || 'Sin resumen';
        const glosa = d.glosa_para_otrosi || d.glosaOtrosi || 'S/G';
        const textoCompleto = d.texto_extraido || d.textoExtraido || '';

        return `=======================================================
[DOCUMENTO ADJUNTO ${idx + 1}]: ${tipo} (${nombre})
- RESUMEN PROBATORIO Y DATOS EXTRAÍDOS:
${resumen}

- GLOSA FORENSE SUGERIDA PARA EL OTROSÍ:
${glosa}
${textoCompleto ? `\n- TEXTO ÍNTEGRO DEL DOCUMENTO:\n${textoCompleto.slice(0, 3000)}` : ''}
=======================================================`;
    }).join('\n\n');
}

/**
 * 1. Genera el Dictamen Técnico de Viabilidad Jurídica bajo el ordenamiento chileno general
 */
async function generarInformeJuridico(caso) {
    const documentosTexto = formatearDocumentosAdjuntos(caso.documentos_probatorios);

    const promptSistema = `Eres un Abogado Consultor Senior y Asesor Forense de la Corporación de Asistencia Judicial (CAJ) en Chile, experto en todo el ordenamiento jurídico nacional (Derecho del Trabajo, Derecho Civil, Derecho de Familia y Policía Local).

REGLA DE ORO DE EXTRACCIÓN DOCUMENTAL (CRÍTICO):
- Revisa exhaustivamente los DOCUMENTOS ADJUNTOS aportados al caso.
- Si el relato de hechos ingresado manualmente es breve, genérico o de prueba, DEBES extraer y utilizar prioritariamente los hechos reales, las partes reales (Demandante, Demandado/Empleador, RUTs), las fechas, montos e incumplimientos que constan dentro de los DOCUMENTOS ADJUNTOS.
- Determina autónomamente la materia real del caso a partir de lo que acreditan los documentos (ej: si hay una demanda laboral o carta de despido, encuadra en DERECHO DEL TRABAJO ante Juzgado de Letras del Trabajo, ignorando clasificaciones de prueba).

ESTRUCTURA OBLIGATORIA DEL DICTAMEN:
I. SÍNTESIS DE ANTECEDENTES Y DETERMINACIÓN DE LA MATERIA JURÍDICA
- Identificación de la rama del derecho aplicable y tribunal competente según los documentos.
- Individualización real de las partes según los documentos analizados.

II. MARCO LEGAL APLICABLE (DERECHO CHILENO)
- Normativa positiva chilena aplicable (Código del Trabajo, Código Civil, Ley 19.968, etc.) con sus artículos exactos.

III. CONTROL DE PERTINENCIA PROBATORIA Y VALORACIÓN DOCUMENTAL
- Examen detallado de cada documento acompañado y su valor para sustentar la demanda.

IV. ESTRATEGIA PROCESAL, FORTALEZAS Y RIESGOS
- Plazos de caducidad o prescripción aplicables.
- Vía procedimental idónea.

V. CHECK-LIST DE ANTECEDENTES PENDIENTES`;

    const promptUsuario = `ANTECEDENTES REGISTRADOS:
Materia indicada: ${caso.materia || 'Determinar según documentos'}
Tribunal indicado: ${caso.tribunal || caso.datos_causa?.tribunal || 'Determinar según documentos'}
Usuario: ${caso.usuario_nombre || caso.usuario?.nombre || 'No informado'} (RUT: ${caso.usuario_rut || caso.usuario?.rut || 'S/R'})
Contraparte: ${caso.contraparte_nombre || caso.contraparte?.nombre || 'No informado'}
Relato manual:
${Array.isArray(caso.hechos) ? caso.hechos.join('. ') : (caso.hechos || caso.relato_hechos || 'Sin relato manual')}

DOCUMENTACIÓN Y EVIDENCIA ADJUNTA (FUENTE PRINCIPAL DE ANÁLISIS):
${documentosTexto}

Emite el dictamen fundado en el derecho chileno que corresponda rigurosamente a estos antecedentes y documentos.`;

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
        throw new Error(`Error al generar informe jurídico: ${detalle}`);
    }
}

/**
 * 2. Confecciona el Borrador de Escrito Judicial según la sede y materia detectadas
 */
async function confeccionarEscritoJudicial(caso, tipoEscritoSolicitado, informePrevio) {
    const documentosTexto = formatearDocumentosAdjuntos(caso.documentos_probatorios);

    const promptSistema = `Eres un Redactor Forense Especialista de la Corporación de Asistencia Judicial (CAJ) en Chile.
Tu misión es redactar el borrador formal del escrito judicial para la tramitación electrónica del Poder Judicial chileno (Oficina Judicial Virtual).

REGLAS FORENSES FUNDAMENTALES:
1. PRIORIDAD DE LOS ANTECEDENTES DOCUMENTALES:
   - Incorpora las partes reales, RUTs, fechas, relación contractual o hechos que consten en los DOCUMENTOS ADJUNTOS y en el informe previo, ignorando cualquier texto genérico de prueba.
2. ADAPTACIÓN A LA SEDE JUDICIAL REAL:
   - Si los documentos versan sobre materia laboral: Encabezar ante "S. J. L. DEL TRABAJO", estructurar demanda laboral (Despido Injustificado, Cobro de Prestaciones, Nulidad del Despido), citar Código del Trabajo y formular petitorio con indemnizaciones.
   - Si versan sobre civil o familia: Adaptar a S. J. L. en lo Civil o Familia correspondientemente.
3. ESTRUCTURA FORENSE CHILENA COMPLETA:
   - Suma: EN LO PRINCIPAL, OTROSÍES.
   - Tribunal competente.
   - Individualización completa de demandante y demandado.
   - Hechos detallados y fundantes derivados de los documentos.
   - Fundamentos de Derecho.
   - Petitorio formal con montos o pretensiones líquidas.
   - PRIMER OTROSÍ: Documentos acompañados con su respectiva glosa procesal justificada.
   - OTROSÍES ACCESORIOS: Medidas cautelares o diligencias; Privilegio de Pobreza y Patrocinio CAJ (Ley N° 17.995 y art. 6 Ley N° 18.120).`;

    const promptUsuario = `ANTECEDENTES DEL EXPEDIENTE:
Materia: ${caso.materia || 'Determinar según documentos'}
Tribunal: ${caso.tribunal || caso.datos_causa?.tribunal || 'Determinar según documentos'}
Usuario: ${caso.usuario_nombre || caso.usuario?.nombre || 'No informado'} (RUT: ${caso.usuario_rut || caso.usuario?.rut || 'S/R'})
Contraparte: ${caso.contraparte_nombre || caso.contraparte?.nombre || 'No informado'}
Relato manual:
${Array.isArray(caso.hechos) ? caso.hechos.join('. ') : (caso.hechos || caso.relato_hechos || '')}

DOCUMENTOS ADJUNTOS EN LA CAUSA (DATOS REALES A UTILIZAR):
${documentosTexto}

DIAGNÓSTICO DEL INFORME PREVIO:
${informePrevio || 'Sin informe previo'}

TIPO DE ESCRITO: ${tipoEscritoSolicitado && tipoEscritoSolicitado !== 'Demanda de Alimentos y Liquidación' ? tipoEscritoSolicitado : 'Demanda idónea según los documentos acompañados'}`;

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