
async function enviarRespuestaWhatsApp(telefonoDestino, texto) {
    const phoneId = process.env.WHATSAPP_PHONE_ID || '1333646283173512';
    const token = process.env.WHATSAPP_TOKEN || 'EAAaEAiblWC8BSlHlD6kJkLmZB2KwwrkA6iK0oPZCilifINtlLOeDnUYACPxWZBZBaXP6nBHdOegSDb0hvIn9d2VCtZAmAEZA3XG1opq2wdobNIEj4HM8AZAL5uwxZCIMFuqXvTPW29FK2ZB0kbscer1G3XqYQxsjCiRl2VHTwu66zqOWetfjgMTRPmrXwe97axIPWq5jRXBzyEdkrlHrkvKQ9NngfdbvCYwRYZCsq9J9DqoKncOHhbrh5n87ogoEFzlqAqn4FXFJKVZCccZCgQnJlTCPfgZDZD';
    if (!token) {
        console.warn('⚠️ No hay WHATSAPP_TOKEN configurado.');
        return null;
    }
    const to = telefonoDestino.replace(/[^0-9]/g, '');
    try {
        const res = await axios.post(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: to,
            type: 'text',
            text: { body: texto }
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        console.log(`✉️ Mensaje enviado exitosamente a WhatsApp: ${to}`);
        return res.data;
    } catch (err) {
        console.error('❌ Error enviando a Meta Graph API:', err.response?.data || err.message);
        return null;
    }
}

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
Una persona te está contactando por WhatsApp solicitando orientación socio-jurídica.

REGLAS INVIOLABLES DE RESPUESTA:
1. CONTENCIÓN HUMANA Y EMPATÍA: Responde con máxima calidez, respeto y contención institucional.
2. INDIVIDUALIZACIÓN COMPLETA (FICHA DE COMPARECENCIA):
   En tu mensaje de respuesta confirma expresamente los antecedentes individualizados que la persona entregó:
   - Nombre de quien comparece (o solicítalo si no lo indicó).
   - RUT y domicilio si los mencionó.
   - Contraparte individualizada (empleador, empresa o demandado).
   - Materia del conflicto (Laboral, Alimentos, Cuidado Personal, etc.).
   Indícale con claridad: "Sus datos han quedado debidamente individualizados e ingresados en el expediente de la CAJ Puente Alto".
3. SIN ASESORÍA NI PROMESAS: Prohibido dar consejos legales de fondo o citar artículos de leyes; la asesoría corresponde exclusivamente al abogado tutor y postulante.
4. TRANQUILIDAD INSTITUCIONAL: Hazle saber que la Coordinación del Centro (Carlos Rosas) y el equipo jurídico ya tienen sus antecedentes a la vista para asignación procesal.`;

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