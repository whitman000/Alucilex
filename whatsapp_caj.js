const axios = require('axios');
const { guardarCaso, buscarPostulantePorTelefono } = require('./firebase_caj');

const ETIQUETAS_CAJ = {
    RECEPCION_IA: 'CAJ - Recepción IA',
    DERIVADO: 'CAJ - Derivado a Postulante',
    URGENTE: 'CAJ - Audiencia Inminente',
    ATENDIDO: 'CAJ - Atendido'
};

function evaluarAccesoPorEtiquetas(etiquetasChat = []) {
    return { permitirIA: true, motivo: 'acceso_autorizado' };
}

async function enviarRespuestaWhatsApp(telefonoDestino, texto) {
    const phoneId = process.env.WHATSAPP_PHONE_ID || '1333646283173512';
    const token = process.env.WHATSAPP_TOKEN || 'EAAaEAiblWC8BShLjZCZC2HWtZCe6jfyHG0fAnAlrpG8CGrwcojEdkLrz0fxUtIxrSKA7U6fI0F08zk5zIZCrBpsQZAFxY91WMQOsmNg1FzvF06ZA2HHZAlqHZAdtWgyAZBchdPVuuBQBTd2kZBlimTZAh4N9G8LnhZCwqMxbxN3urq73nWABflQSzWJCH5fQAadTegYt5wZDZD';
    const to = telefonoDestino.replace(/[^0-9]/g, '');
    const urlMeta = 'https://graph.facebook.com/v21.0/' + phoneId + '/messages';

    try {
        const res = await axios.post(urlMeta, {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: to,
            type: 'text',
            text: { body: texto }
        }, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        });
        console.log('✉️ ¡MENSAJE ENTREGADO CON ÉXITO A WHATSAPP: ' + to);
        return res.data;
    } catch (err) {
        console.error('❌ Error enviando a Meta Graph API:', err.response?.data || err.message);
        return null;
    }
}

async function procesarMensajeWhatsApp(textoUsuario, telefonoRemitente, telefonoPostulante, etiquetasChat = []) {
    let postulanteAsignado = null;
    if (telefonoPostulante) {
        postulanteAsignado = await buscarPostulantePorTelefono(telefonoPostulante);
    }
    const nombreCoordinador = postulanteAsignado?.nombre || 'Carlos Rosas';
    const centroCAJ = postulanteAsignado?.centro_caj || 'CAJ Puente Alto';

    const promptSistema = `Eres la Asistente de Acogida de la Corporación de Asistencia Judicial (CAJ) en Chile.
Tu función es acoger al ciudadano con empatía, acusar recibo formal de sus antecedentes y extraer los datos del caso.
NO des asesoría legal ni prometas resultados judiciales.

Debes responder OBLIGATORIAMENTE en formato JSON con esta estructura exacta:
{
  "respuesta_humana": "Mensaje formal y empático acusando recibo de la persona (mencionando su nombre si lo dio), confirmando que sus antecedentes quedaron registrados en la ${centroCAJ} bajo la coordinación de ${nombreCoordinador}.",
  "datos_extraidos": {
    "nombre": "Nombre completo extraído o null",
    "rut": "RUT extraído o null",
    "materia": "Materia clasificada (Laboral, Alimentos, Precario, etc.)",
    "contraparte": "Nombre de empresa o demandado o null",
    "domicilio": "Domicilio mencionado o null",
    "hechos": "Resumen cronológico de los hechos"
  }
}`;

    try {
        const apiKey = process.env.OPENROUTER_API_KEY;
        const resAI = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
            model: 'openai/gpt-4o-mini',
            messages: [
                { role: 'system', content: promptSistema },
                { role: 'user', content: textoUsuario }
            ],
            temperature: 0.1
        }, {
            headers: {
                'Authorization': 'Bearer ' + apiKey,
                'Content-Type': 'application/json'
            }
        });

        let contenido = resAI.data.choices[0].message.content.trim();
        if (contenido.startsWith('```json')) {
            contenido = contenido.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (contenido.startsWith('```')) {
            contenido = contenido.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }

        const resultado = JSON.parse(contenido);

        const datosExt = resultado.datos_extraidos || {};
        const nombreFinal = datosExt.nombre || 'Usuario WhatsApp';
        const rutFinal = datosExt.rut || '';
        const materiaFinal = datosExt.materia || 'General';
        const contraparteFinal = datosExt.contraparte || 'Por determinar';
        const hechosFinal = datosExt.hechos || textoUsuario;
        const textoRespuesta = resultado.respuesta_humana || ('Estimado/a ' + nombreFinal + ', hemos recibido sus antecedentes en la ' + centroCAJ + ' bajo la coordinación de ' + nombreCoordinador + '.');

        const datosCaso = {
            canal: 'whatsapp',
            usuario_nombre: nombreFinal,
            nombre: nombreFinal,
            usuario_rut: rutFinal,
            rut: rutFinal,
            telefono_contacto: telefonoRemitente,
            contraparte_nombre: contraparteFinal,
            contraparte: contraparteFinal,
            materia: materiaFinal,
            tribunal: datosExt.tribunal || centroCAJ,
            hechos: [hechosFinal],
            relato_hechos: hechosFinal,
            domicilio: datosExt.domicilio || '',
            postulante_id: postulanteAsignado?.id || 'coordinador_carlos',
            postulante_nombre: nombreCoordinador,
            postulante_telefono: postulanteAsignado?.telefono || telefonoPostulante || '',
            documentos_probatorios: [],
            estado: 'ingresado_whatsapp'
        };

        const casoGuardado = await guardarCaso(datosCaso);
        console.log('📥 Caso guardado con éxito: ' + nombreFinal + ' | RUT: ' + rutFinal + ' | Materia: ' + materiaFinal + ' (ID: ' + casoGuardado.id + ')');

        // Enviar respuesta a WhatsApp
        await enviarRespuestaWhatsApp(telefonoRemitente, textoRespuesta);

        return {
            responder: true,
            respuestaTexto: textoRespuesta,
            casoId: casoGuardado.id,
            datosExtraidos: datosExt
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
