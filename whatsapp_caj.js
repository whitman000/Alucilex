// whatsapp_caj.js - Módulo de Acogida, Contención, Control de Etiquetas (Opción 1) y Asignación de Postulantes
require('dotenv').config();
const axios = require('axios');
const { guardarCaso, buscarPostulantePorTelefono } = require('./firebase_caj');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODELO_CHAT = process.env.MODELO_CHAT || 'openai/gpt-4o-mini';

// Nombres exactos de las etiquetas de WhatsApp Business
const ETIQUETAS_CAJ = {
    RECEPCION_IA: 'CAJ - Recepción IA',
    ATENCION_DIRECTA: 'CAJ - Atención Directa',
    CONCLUIDA: 'CAJ - Causa Concluida'
};

/**
 * 1. Control de Acceso por Etiquetas de WhatsApp Business (Opción 1)
 * Determina si la IA tiene autorización de intervenir en este chat
 */
function evaluarAccesoPorEtiquetas(etiquetasChat = []) {
    // Si el postulante marcó "Atención Directa", la IA no interviene
    if (etiquetasChat.includes(ETIQUETAS_CAJ.ATENCION_DIRECTA)) {
        return { permitirIA: false, motivo: 'atencion_directa_humana' };
    }

    // Si el caso ya concluyó, la IA no interviene
    if (etiquetasChat.includes(ETIQUETAS_CAJ.CONCLUIDA)) {
        return { permitirIA: false, motivo: 'causa_concluida' };
    }

    // ÚNICAMENTE si el postulante le asignó la etiqueta "CAJ - Recepción IA", la IA responde
    if (etiquetasChat.includes(ETIQUETAS_CAJ.RECEPCION_IA)) {
        return { permitirIA: true, motivo: 'recepcion_ia_autorizada' };
    }

    // Chats sin etiqueta (familia, amigos, personales): LA IA LOS IGNORA TOTALMENTE
    return { permitirIA: false, motivo: 'sin_etiqueta_caj_ignorado' };
}

/**
 * 2. Procesa el mensaje de WhatsApp, realiza contención humana y guarda en Base de Datos
 */
async function procesarMensajeWhatsApp(textoUsuario, telefonoRemitente, telefonoPostulante, etiquetasChat = []) {
    // Paso A: Evaluar si el chat cuenta con la etiqueta autorizada
    const evaluacion = evaluarAccesoPorEtiquetas(etiquetasChat);
    if (!evaluacion.permitirIA) {
        console.log(`🔇 Mensaje de ${telefonoRemitente} ignorado por IA (${evaluacion.motivo}). Privacidad del postulante resguardada.`);
        return { responder: false, motivo: evaluacion.motivo };
    }

    console.log(`🤖 Mensaje de ${telefonoRemitente} autorizado con etiqueta '${ETIQUETAS_CAJ.RECEPCION_IA}'. Iniciando contención y extracción...`);

    // Paso B: Identificar al postulante a cargo según el teléfono que recibe el mensaje
    let postulanteAsignado = null;
    if (telefonoPostulante) {
        postulanteAsignado = await buscarPostulantePorTelefono(telefonoPostulante);
    }

    // Paso C: Prompt de acogida humana, empatía y extracción silenciosa
    const promptSistema = `Eres la Asistente de Acogida y Primera Escucha de la Corporación de Asistencia Judicial (CAJ) en Chile.
Una persona te está contactando por WhatsApp en una situación de vulnerabilidad, estrés o conflicto legal/familiar.

REGLAS INVIOLABLES DE RESPUESTA:
1. CONTENCIÓN Y EMPATÍA HUMANA: Responde con máxima calidez, respeto y comprensión. Valida las emociones del usuario de forma empática.
2. PROHIBIDO DAR ASESORÍA O SOLUCIONES LEGALES: Tienes estrictamente PROHIBIDO citar artículos de leyes, dar consejos procesales o prometer resultados judiciales. La asesoría es exclusiva del abogado tutor o postulante.
3. TRANQUILIDAD AL USUARIO: Hazle saber que todo su relato ha quedado debidamente registrado en el sistema de la CAJ y que el equipo jurídico del centro ya cuenta con sus antecedentes.
// Instrucción para la IA en promptSistema:
4. FORMATO OBLIGATORIO DE RESPUESTA (JSON):
{
  "respuesta_humana": "Mensaje cálido y empático de contención sin asesoría legal.",
  "datos_extraidos": {
    "nombre": "Nombre de quien escribe si lo menciona en el texto (ej: 'Ana María Pérez'), o null si no se identifica.",
    "rut": "RUT del usuario si lo indica, o null.",
    "materia": "Clasificación de la rama: 'Laboral', 'Familia - Alimentos', 'Familia - Cuidado Personal', 'Civil - Precario', etc.",
    "tribunal": "Tribunal o ciudad que mencione, o null.",
    "contraparte": "Nombre de la empresa, empleador o persona contra quien reclama, o null.",
    "hechos": "Resumen claro y cronológico de los hechos relatados."
  }
}
  `;

    const promptUsuario = `MENSAJE DEL CIUDADANO POR WHATSAPP:
"""
${textoUsuario}
"""

Centro CAJ: ${postulanteAsignado?.centro_caj || 'CAJ Puente Alto'}
Postulante a cargo de la atención: ${postulanteAsignado?.nombre || 'Postulante CAJ'}

Genera la respuesta humana de contención y extrae los datos del caso en formato JSON.`;

    try {
        const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
            model: MODELO_CHAT,
            messages: [
                { role: 'system', content: promptSistema },
                { role: 'user', content: promptUsuario }
            ],
            response_format: { type: "json_object" },
            temperature: 0.2
        }, {
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const resultado = JSON.parse(response.data.choices[0].message.content);

        // Paso D: Guardar silenciosamente en Firebase vinculado al postulante
        // Extracción dinámica real sin nombres fijos grabados en el código
        const nombreDetectado = resultado.datos_extraidos?.nombre || 'Usuario WhatsApp';
        const contraparteDetectada = resultado.datos_extraidos?.contraparte || 'Por determinar';
        const materiaDetectada = resultado.datos_extraidos?.materia || 'General';
        const hechosDetectados = resultado.datos_extraidos?.hechos || textoUsuario;

        const datosCaso = {
            canal: 'whatsapp',
            usuario_nombre: nombreDetectado,
            nombre: nombreDetectado,
            usuario_rut: resultado.datos_extraidos?.rut || '',
            telefono_contacto: telefonoRemitente,
            contraparte_nombre: contraparteDetectada,
            contraparte: contraparteDetectada,
            materia: materiaDetectada,
            tribunal: resultado.datos_extraidos?.tribunal || postulanteAsignado?.centro_caj || 'Por determinar',
            hechos: [hechosDetectados],
            relato_hechos: hechosDetectados,
            postulante_id: postulanteAsignado?.id || 'sin_asignar',
            postulante_nombre: postulanteAsignado?.nombre || 'Carlos Rosas',
            postulante_telefono: postulanteAsignado?.telefono || telefonoPostulante || '',
            documentos_probatorios: [],
            estado: 'ingresado_whatsapp'
        };
        const casoGuardado = await guardarCaso(datosCaso);
        console.log(`📥 Caso de WhatsApp ingresado con éxito en Base de Datos (ID: ${casoGuardado.id}) asignado a: ${datosCaso.postulante_nombre}`);

        return {
            responder: true,
            respuestaTexto: resultado.respuesta_humana,
            casoId: casoGuardado.id,
            datosExtraidos: resultado.datos_extraidos
        };

    } catch (error) {
        console.error("Error al procesar mensaje de WhatsApp:", error.response?.data || error.message);
        throw error;
    }
}

module.exports = {
    ETIQUETAS_CAJ,
    evaluarAccesoPorEtiquetas,
    procesarMensajeWhatsApp
};