
'use strict';

const axios = require('axios');

const URL_TRANSCRIPCION =
    'https://openrouter.ai/api/v1/audio/transcriptions';

const MODELO_AUDIO =
    process.env.MODELO_TRANSCRIPCION_CAJ ||
    'openai/whisper-large-v3';

const MAX_AUDIO_BYTES = 15 * 1024 * 1024;

async function transcribirAudioCAJ(audioBuffer, formato = 'ogg') {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
        throw new Error('OPENROUTER_API_KEY no configurada');
    }

    if (!Buffer.isBuffer(audioBuffer) || audioBuffer.length === 0) {
        throw new Error('El audio recibido esta vacio');
    }

    if (audioBuffer.length > MAX_AUDIO_BYTES) {
        throw new Error('El audio supera el limite de 15 MB');
    }

    const formatosPermitidos = [
        'ogg', 'mp3', 'wav', 'm4a',
        'webm', 'flac', 'aac'
    ];

    if (!formatosPermitidos.includes(formato)) {
        throw new Error(`Formato no permitido: ${formato}`);
    }

    console.log(
        `[CAJ AUDIO] Iniciando transcripcion: ${audioBuffer.length} bytes`
    );

    const respuesta = await axios.post(
        URL_TRANSCRIPCION,
        {
            model: MODELO_AUDIO,
            input_audio: {
                data: audioBuffer.toString('base64'),
                format: formato
            },
            language: 'es'
        },
        {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer':
                    process.env.RENDER_EXTERNAL_URL ||
                    'https://alucilex.onrender.com',
                'X-Title': 'Alucilex CAJ'
            },
            timeout: 120000,
            maxBodyLength: 25 * 1024 * 1024
        }
    );

    const texto = String(
        respuesta.data?.text || ''
    ).trim();

    if (!texto) {
        throw new Error('El servicio devolvio una transcripcion vacia');
    }

    console.log('[CAJ AUDIO] Transcripcion completada');

    return texto;
}

module.exports = {
    transcribirAudioCAJ
};
