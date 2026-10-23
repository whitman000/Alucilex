'use strict';

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const crypto = require('crypto');

const { cifrar, descifrar } = require('./cifrado_sesiones_caj');

const MAX_ARCHIVOS = 20000;
const MAX_BYTES = 20 * 1024 * 1024;

function validarNombre(nombre) {
    if (
        typeof nombre !== 'string' ||
        !/^[a-zA-Z0-9_-]+$/.test(nombre)
    ) {
        throw new Error('Identificador de sesion invalido');
    }

    return nombre;
}

function empaquetar(carpeta, clave) {
    const archivos = {};
    let cantidad = 0;
    let totalBytes = 0;

    function recorrer(directorio, relativo = '') {
        for (const entrada of fs.readdirSync(
            directorio,
            { withFileTypes: true }
        )) {
            if (entrada.isSymbolicLink()) {
                throw new Error('Enlaces simbolicos no permitidos');
            }

            const ruta = path.join(directorio, entrada.name);
            const nombre = relativo
                ? `${relativo}/${entrada.name}`
                : entrada.name;

            if (entrada.isDirectory()) {
                recorrer(ruta, nombre);
                continue;
            }

            if (!entrada.isFile()) {
                throw new Error('Tipo de archivo no permitido');
            }

            cantidad++;

            if (cantidad > MAX_ARCHIVOS) {
                throw new Error('Demasiados archivos');
            }

            const contenido = fs.readFileSync(ruta);
            totalBytes += contenido.length;

            if (totalBytes > MAX_BYTES) {
                throw new Error('Tamano maximo excedido');
            }

            archivos[nombre] = contenido.toString('base64');
        }
    }

    recorrer(carpeta);

    if (!Object.prototype.hasOwnProperty.call(archivos, 'creds.json')) {
        throw new Error('No existe creds.json');
    }

    const paquete = {
        version: 1,
        archivos
    };

    const comprimido = zlib.gzipSync(
        Buffer.from(JSON.stringify(paquete))
    );

    return cifrar(comprimido, clave);
}

function restaurar(paquete, carpetaDestino, clave) {
    const comprimido = descifrar(paquete, clave);
    const contenido = zlib.gunzipSync(comprimido, {
        maxOutputLength: MAX_BYTES * 3
    });

    const datos = JSON.parse(contenido.toString('utf8'));

    if (
        datos.version !== 1 ||
        !datos.archivos ||
        typeof datos.archivos !== 'object' ||
        Array.isArray(datos.archivos)
    ) {
        throw new Error('Respaldo incompatible');
    }

    const entradas = Object.entries(datos.archivos);

    if (entradas.length > MAX_ARCHIVOS) {
        throw new Error('Demasiados archivos');
    }

    if (fs.existsSync(carpetaDestino)) {
        throw new Error('La carpeta destino ya existe');
    }

    let totalBytes = 0;
    const preparados = [];

    for (const [nombre, base64] of entradas) {
        const segmentos = nombre.split('/');

        if (
            segmentos.length === 0 ||
            segmentos.some(s =>
                !s ||
                s === '.' ||
                s === '..' ||
                !/^[a-zA-Z0-9_.-]+$/.test(s)
            )
        ) {
            throw new Error('Ruta de archivo invalida');
        }

        if (typeof base64 !== 'string') {
            throw new Error('Contenido invalido');
        }

        const buffer = Buffer.from(base64, 'base64');

        totalBytes += buffer.length;

        if (totalBytes > MAX_BYTES) {
            throw new Error('Tamano maximo excedido');
        }

        preparados.push({ segmentos, buffer });
    }

    if (!entradas.some(([nombre]) => nombre === 'creds.json')) {
        throw new Error('Respaldo sin credenciales');
    }

    fs.mkdirSync(carpetaDestino, { recursive: false });

    try {
        for (const archivo of preparados) {
            const destino = path.join(
                carpetaDestino,
                ...archivo.segmentos
            );

            fs.mkdirSync(path.dirname(destino), {
                recursive: true
            });

            fs.writeFileSync(destino, archivo.buffer, {
                flag: 'wx',
                mode: 0o600
            });
        }
    } catch (error) {
        fs.rmSync(carpetaDestino, {
            recursive: true,
            force: true
        });

        throw error;
    }

    return preparados.length;
}

module.exports = {
    empaquetar,
    restaurar,
    validarNombre
};
