// procesador_documentos.js - Lector Inteligente de Evidencia Documental (PDF e Imágenes)
require('dotenv').config();
const fs = require('fs');
const pdfParse = require('pdf-parse');
const OpenAI = require('openai');
const { db } = require('./firebase_caj');
const { FieldValue } = require('firebase-admin/firestore');

const openai = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1'
});

const MODELO_VISION = process.env.MODELO_VISION || 'openai/gpt-4o-mini';

/**
 * Analiza un archivo adjunto (PDF o Foto) y extrae sus datos jurídicos probatorios.
 */
async function analizarDocumento(bufferArchivo, mimeType, nombreOriginal) {
    try {
        let textoExtraido = '';

        // 1. Si es PDF: extracción de texto digital con pdf-parse
        if (mimeType === 'application/pdf') {
            console.log(`📄 Extrayendo texto digital del PDF: ${nombreOriginal}...`);
            const dataPdf = await pdfParse(bufferArchivo);
            textoExtraido = dataPdf.text;
        }

        // 2. Prompt forense para clasificar y redactar la glosa del Otrosí
        const promptSistema = `
Eres un Perito y Asistente Forense de la Corporación de Asistencia Judicial (CAJ) en Chile.
Tu misión es examinar el documento acompañado, clasificarlo y redactar la glosa formal para el "Otrosí de Documentos" de una demanda ante tribunales chilenos.

Debes responder OBLIGATORIAMENTE en formato JSON con la siguiente estructura:
{
  "tipo_documento": "Certificado de Nacimiento | Acta de Mediación | Liquidación de Sueldo | Comprobante de Gasto | Resolución Judicial | Cédula de Identidad",
  "datos_clave": {
    "rut_identificados": ["..."],
    "personas_mencionadas": ["..."],
    "fechas_relevantes": ["..."],
    "montos_o_cifras": ["..."]
  },
  "resumen_probatorio": "Breve explicación de qué hecho de la demanda acredita este documento.",
  "glosa_para_otrosi": "Texto formal para la suma y el cuerpo del escrito (Ej: Certificado de nacimiento de don Mateo Pérez, emitido por el SRCeI con fecha 05 de octubre de 2026, con el que acredito el parentesco y filiación con el demandado)."
}
`;

        let mensajes = [{ role: 'system', content: promptSistema }];

        // Si fue PDF, mandamos el texto extraído
        if (mimeType === 'application/pdf') {
            mensajes.push({
                role: 'user',
                content: `Analiza este texto extraído del documento PDF (${nombreOriginal}):\n\n"""${textoExtraido.substring(0, 10000)}"""`
            });
        } 
        // Si es imagen (JPG / PNG): lectura visual directa
        else {
            console.log(`📸 Analizando imagen mediante visión artificial: ${nombreOriginal}...`);
            const base64Image = bufferArchivo.toString('base64');
            mensajes.push({
                role: 'user',
                content: [
                    { type: 'text', text: `Examina esta fotografía de documento chileno (${nombreOriginal}):` },
                    {
                        type: 'image_url',
                        image_url: { url: `data:${mimeType};base64,${base64Image}` }
                    }
                ]
            });
        }

        const respuesta = await openai.chat.completions.create({
            model: MODELO_VISION,
            messages: mensajes,
            response_format: { type: "json_object" },
            temperature: 0.1
        });

        const analisis = JSON.parse(respuesta.choices[0].message.content);
        analisis.nombre_archivo = nombreOriginal;
        analisis.fecha_analisis = new Date().toISOString();

        return analisis;

    } catch (error) {
        console.error("❌ Error al analizar documento probatorio:", error.message);
        throw error;
    }
}

/**
 * Guarda los antecedentes extraídos dentro del caso correspondiente en Firestore.
 */
async function guardarDocumentoEnCaso(idCaso, infoDocumento) {
    try {
        await db.collection('casos_caj').doc(idCaso).update({
            documentos_probatorios: FieldValue.arrayUnion(infoDocumento),
            fecha_actualizacion: FieldValue.serverTimestamp()
        });
        console.log(`✅ Evidencia documental anexada exitosamente al caso ${idCaso}`);
    } catch (error) {
        console.error("❌ Error al anexar documento en Firebase:", error.message);
        throw error;
    }
}

module.exports = {
    analizarDocumento,
    guardarDocumentoEnCaso
};