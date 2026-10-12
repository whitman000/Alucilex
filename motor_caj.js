// motor_caj.js - Motor de Diagnóstico Jurídico y Redacción Forense Integral (Derecho Chileno General)
require('dotenv').config();
const axios = require('axios');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODELO = process.env.MODELO_LEGAL || 'openai/gpt-4o-mini';

/**
 * 1. Genera el Dictamen Técnico de Viabilidad Jurídica bajo el ordenamiento chileno general
 */
async function generarInformeJuridico(caso) {
    // Procesar todos los antecedentes y texto extraído de los documentos adjuntos
    const documentosTexto = (caso.documentos_probatorios || []).map((doc, idx) => {
        return `[Documento ${idx + 1}]:
- Archivo: ${doc.nombreArchivo || 'S/N'}
- Tipo o materia identificada: ${doc.tipo || 'No especificado'}
- Resumen y datos extraídos: ${doc.resumen || doc.textoExtraido || 'Sin detalle'}
- Glosa probatoria: ${doc.glosaOtrosi || 'S/G'}`;
    }).join('\n\n');

    const promptSistema = `Eres un Abogado Consultor Senior y Asesor Forense de la Corporación de Asistencia Judicial (CAJ) en Chile, experto en todo el ordenamiento jurídico nacional (Derecho del Trabajo, Derecho Civil, Derecho de Familia y Policía Local).

Tu misión es analizar integralmente los hechos y los documentos aportados para determinar con precisión la verdadera rama jurídica y la viabilidad procesal de la pretensión.

REGLAS DE ANÁLISIS JURÍDICO INTEGRAL:
1. DETERMINACIÓN AUTÓNOMA DE LA MATERIA:
   - No te limites a una materia predefinida si los hechos o los documentos apuntan a otra rama.
   - Si los antecedentes o documentos versan sobre una relación laboral (despido, finiquito, remuneraciones impagas), encuadra la causa en el DERECHO DEL TRABAJO (Código del Trabajo, Ley 17.322, Ley 19.631 "Ley Bustos") y competencia de los Juzgados de Letras del Trabajo.
   - Si versan sobre contratos, inmuebles, precario o deudas, encuadra en DERECHO CIVIL (Código Civil, Código de Procedimiento Civil, Ley 18.101).
   - Si versan sobre alimentos, cuidado personal o relación directa, encuadra en DERECHO DE FAMILIA (Ley 19.968, Ley 14.908, Ley 21.484).

2. INTEGRACIÓN TOTAL DEL CONTENIDO DOCUMENTAL:
   - Extrae del texto del documento adjunto las partes reales (Demandante, Demandado/Empleador, RUTs), fechas clave, montos, pretensiones e incumplimientos.
   - Si el documento adjunto es en sí mismo una demanda, finiquito o contrato, utiliza su contenido directo como la base fáctica y jurídica principal del dictamen.

ESTRUCTURA OBLIGATORIA DEL DICTAMEN:
I. SÍNTESIS DE ANTECEDENTES Y DETERMINACIÓN DE LA MATERIA JURÍDICA
- Identificación de la rama del derecho aplicable (Laboral, Civil o Familia) y tribunal competente.
- Individualización completa de las partes según los antecedentes y documentos analizados.

II. MARCO LEGAL APLICABLE (DERECHO CHILENO)
- Normativa positiva chilena aplicable según la materia identificada (Citar Código del Trabajo, Código Civil, CPC o leyes especiales pertinentes con sus artículos exactos).

III. ANÁLISIS DE FONDO Y VIABILIDAD DE LA PRETENSIÓN
- Examen de la procedencia de la acción a la luz de los documentos aportados.
- Valoración probatoria de los documentos acompañados.

IV. ESTRATEGIA PROCESAL, FORTALEZAS Y RIESGOS
- Plazos de prescripción o caducidad aplicables (ej: 60 días hábiles en despido laboral, etc.).
- Vía procedimental idónea (Juicio Ordinario Laboral, Juicio Monitorio, Juicio Sumario Civil, etc.).

V. CHECK-LIST DE ANTECEDENTES INDISPENSABLES PENDIENTES`;

    const promptUsuario = `ANTECEDENTES APORTADOS AL SISTEMA:
Materia indicada inicialmente: ${caso.materia || 'Por clasificar según análisis'}
Tribunal sugerido: ${caso.tribunal || caso.datos_causa?.tribunal || 'Por determinar'}
RIT / Rol previo: ${caso.causa_previa || caso.datos_causa?.rit || 'No registra'}
Usuario: ${caso.usuario_nombre || caso.usuario?.nombre || 'No informado'} (RUT: ${caso.usuario_rut || caso.usuario?.rut || 'S/R'})
Contraparte: ${caso.contraparte_nombre || caso.contraparte?.nombre || 'No informado'} (RUT: ${caso.contraparte_rut || caso.contraparte?.rut || 'S/R'})
Relato fáctico complementario:
${Array.isArray(caso.hechos) ? caso.hechos.join('. ') : (caso.hechos || caso.relato_hechos || caso.relato || 'Sin hechos adicionales')}

DOCUMENTACIÓN Y CONTENIDO DE ARCHIVOS ADJUNTOS:
${documentosTexto || 'No se han adjuntado documentos.'}

Emite el dictamen fundado en el derecho chileno que corresponda rigurosamente a estos antecedentes.`;

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
    const documentosTexto = (caso.documentos_probatorios || []).map((doc, idx) => {
        return `[Doc ${idx + 1}]: ${doc.nombreArchivo || 'S/N'} (${doc.tipo || 'Documento'}) | Datos: ${doc.resumen || doc.textoExtraido || ''}`;
    }).join('\n');

    const promptSistema = `Eres un Redactor Forense Especialista de la Corporación de Asistencia Judicial (CAJ) en Chile.
Tu misión es redactar el borrador formal del escrito judicial para la tramitación electrónica del Poder Judicial chileno (Oficina Judicial Virtual).

REGLAS DE CONFECCIÓN FORENSE MULTIDISCIPLINARIA:
1. ADAPTACIÓN A LA SEDE JUDICIAL PERTINENTE:
   - Si la causa es LABORAL: Encabezar ante "S. J. L. DEL TRABAJO", estructurar demanda laboral (Despido Injustificado, Cobro de Prestaciones, Nulidad del Despido), citar Código del Trabajo y formular petitorio laboral (indemnizaciones por años de servicio, aviso previo, feriado legal, remuneraciones).
   - Si la causa es CIVIL: Encabezar ante "S. J. L. EN LO CIVIL", aplicar normas del Código Civil y CPC.
   - Si la causa es FAMILIA: Encabezar ante "S. J. L. DE FAMILIA", aplicar Ley 19.968 y normativa correspondiente.

2. APROVECHAMIENTO DE LOS DATOS REALES:
   - Incorpora las partes, RUTs, fechas, relación contractual o hechos que consten en el informe previo y en los documentos adjuntos.

3. ESTRUCTURA FORENSE CHILENA COMPLETA:
   - Suma: EN LO PRINCIPAL, OTROSÍES.
   - Tribunal competente.
   - Individualización de las partes.
   - Hechos detallados y fundantes.
   - Fundamentos de Derecho aplicables.
   - Petitorio formal claro y líquido (con montos si se desprenden de los antecedentes).
   - PRIMER OTROSÍ: Documentos fundantes acompañados con su respectiva glosa.
   - OTROSÍES ACCESORIOS: Medidas cautelares o diligencias pertinentes; Privilegio de Pobreza y Patrocinio CAJ (Ley N° 17.995 y art. 6 Ley N° 18.120).`;

    const promptUsuario = `ANTECEDENTES REGISTRADOS:
Materia de la causa: ${caso.materia || 'Determinar según antecedentes'}
Tribunal: ${caso.tribunal || caso.datos_causa?.tribunal || 'Determinar según materia'}
Usuario: ${caso.usuario_nombre || caso.usuario?.nombre || 'No informado'} (RUT: ${caso.usuario_rut || caso.usuario?.rut || 'S/R'})
Contraparte: ${caso.contraparte_nombre || caso.contraparte?.nombre || 'No informado'} (RUT: ${caso.contraparte_rut || caso.contraparte?.rut || 'S/R'})
Hechos:
${Array.isArray(caso.hechos) ? caso.hechos.join('. ') : (caso.hechos || caso.relato_hechos || caso.relato || '')}

CONTENIDO DE DOCUMENTOS ADJUNTOS:
${documentosTexto || 'Ninguno'}

DIAGNÓSTICO Y CONCLUSIONES DEL INFORME PREVIO:
${informePrevio || 'Sin informe previo'}

TIPO DE ESCRITO SOLICITADO: ${tipoEscritoSolicitado && tipoEscritoSolicitado !== 'Demanda de Alimentos y Liquidación' ? tipoEscritoSolicitado : 'Escrito judicial idóneo según los hechos y documentos'}`;

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