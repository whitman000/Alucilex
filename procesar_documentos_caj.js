
'use strict';

const crypto = require('crypto');
const sharp = require('sharp');
const { storageBucket } = require('./firebase_caj');

const LIMITE_BYTES = 15 * 1024 * 1024;

const TIPOS_PERMITIDOS = {
    'image/jpeg': { extension: 'jpg', imagen: true },
    'image/png': { extension: 'png', imagen: true },
    'image/webp': { extension: 'webp', imagen: true },
    'application/pdf': { extension: 'pdf', imagen: false },
    'application/msword': { extension: 'doc', imagen: false },
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
        extension: 'docx',
        imagen: false
    }
};


function validarIdentificador(valor, nombre) {
    const original = String(valor || '').trim();

    if (!original || original.length > 200) {
        throw new Error(`${nombre} invalido`);
    }

    // Evita caracteres incompatibles con rutas de Storage.
    const limpio = original.replace(/[^a-zA-Z0-9_-]/g, '_');

    if (!limpio || limpio.length > 100) {
        throw new Error(`${nombre} invalido`);
    }

    return limpio;
}


async function guardarDocumentoCAJ({
    expedienteId,
    sessionId,
    mensajeId,
    buffer,
    mimeType,
    nombreArchivo = ''
}) {
    if (!storageBucket) {
        throw new Error('Firebase Storage no configurado');
    }

    const expediente = validarIdentificador(
        expedienteId,
        'Expediente'
    );

    const sesion = validarIdentificador(
        sessionId,
        'Sesion'
    );

    const mensaje = validarIdentificador(
        mensajeId,
        'Mensaje'
    );

    const tipo = TIPOS_PERMITIDOS[mimeType];

    if (!tipo) {
        throw new Error('Tipo de archivo no permitido');
    }

    if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
        throw new Error('Archivo vacio');
    }

    if (buffer.length > LIMITE_BYTES) {
        throw new Error('Archivo superior a 15 MB');
    }

    const hash = crypto
        .createHash('sha256')
        .update(buffer)
        .digest('hex');

    const base = `expedientes/${expediente}/originales/${sesion}_${mensaje}`;

    const rutaOriginal = `${base}.${tipo.extension}`;


    const original = storageBucket.file(rutaOriginal);

    // No sobrescribir documentos originales.
    // Si el mensaje ya fue procesado, verificar su integridad.
    try {
        await original.save(buffer, {
            resumable: false,
            validation: 'crc32c',
            preconditionOpts: {
                ifGenerationMatch: 0
            },
            metadata: {
                contentType: mimeType,
                metadata: {
                    sessionId: sesion,
                    mensajeId: mensaje,
                    sha256: hash
                }
            }
        });

        console.log(
            `[CAJ STORAGE] Original guardado: ${rutaOriginal}`
        );

    } catch (error) {
        if (Number(error.code) !== 412) {
            throw error;
        }

        // El archivo ya existe. Verificar que sea el mismo.
        const [metadata] = await original.getMetadata();
        const hashExistente = metadata.metadata?.sha256;

        if (!hashExistente || hashExistente !== hash) {
            throw new Error(
                'Conflicto de integridad: existe otro archivo en la misma ruta'
            );
        }

        console.log(
            `[CAJ STORAGE] Documento existente verificado: ${rutaOriginal}`
        );
    }


    let rutaOptimizada = null;

    if (tipo.imagen) {
        try {
            const optimizada = await sharp(buffer, {
                limitInputPixels: 40000000
            })
                .rotate()
                .resize({
                    width: 1800,
                    height: 1800,
                    fit: 'inside',
                    withoutEnlargement: true
                })
                .jpeg({
                    quality: 82,
                    mozjpeg: true
                })
                .toBuffer();

            rutaOptimizada =
                `expedientes/${expediente}/imagenes_optimizadas/${sesion}_${mensaje}.jpg`;

            await storageBucket.file(rutaOptimizada).save(
                optimizada,
                {
                    resumable: false,
                    validation: 'crc32c',
                    metadata: {
                        contentType: 'image/jpeg'
                    }
                }
            );
        } catch (error) {
            console.error(
                '[CAJ DOCUMENTOS] No se pudo optimizar imagen:',
                error.message
            );

            rutaOptimizada = null;
        }
    }

    return {
        id_archivo: `${sesion}_${mensaje}`,
        id_whatsapp: mensaje,
        nombre_archivo: String(nombreArchivo || ''),
        tipo_documento: mimeType,
        tamano_bytes: buffer.length,
        sha256: hash,

        storage_path: rutaOriginal,
        storage_path_optimizado: rutaOptimizada,

        // El original permanece intacto en Cloud Storage.
        original_conservado: true,
        integridad_sha256: hash,

        // Clasificación preliminar.
        // No atribuye valor probatorio automáticamente.
        clasificacion_probatoria: 'pendiente_revision',
        clasificacion_ia: 'sin_analizar',
        motivo_clasificacion: '',
        relevancia_juridica: '',
        texto_extraido: '',

        // La decisión definitiva corresponde al asesor.
        revision_asesor: 'pendiente',
        clasificacion_confirmada: false,

        estado_analisis: 'pendiente',
        fecha_recepcion: new Date().toISOString()

    };
}

module.exports = {
    guardarDocumentoCAJ
};
