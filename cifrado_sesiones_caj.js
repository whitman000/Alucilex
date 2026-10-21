'use strict';

const crypto = require('crypto');

function validarClave(clave) {
    if (!Buffer.isBuffer(clave) || clave.length !== 32) {
        throw new Error('Se requiere una clave de 32 bytes');
    }
}

function cifrar(datos, clave) {
    validarClave(clave);

    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(
        'aes-256-gcm',
        clave,
        iv
    );

    const contenido = Buffer.from(datos);

    const cifrado = Buffer.concat([
        cipher.update(contenido),
        cipher.final()
    ]);

    return {
        version: 1,
        algoritmo: 'aes-256-gcm',
        iv: iv.toString('base64'),
        tag: cipher.getAuthTag().toString('base64'),
        datos: cifrado.toString('base64')
    };
}

function descifrar(paquete, clave) {
    validarClave(clave);

    if (
        !paquete ||
        paquete.version !== 1 ||
        paquete.algoritmo !== 'aes-256-gcm'
    ) {
        throw new Error('Formato cifrado no compatible');
    }

    const iv = Buffer.from(paquete.iv, 'base64');
    const tag = Buffer.from(paquete.tag, 'base64');
    const datos = Buffer.from(paquete.datos, 'base64');

    if (iv.length !== 12 || tag.length !== 16) {
        throw new Error('Parametros de cifrado invalidos');
    }

    const decipher = crypto.createDecipheriv(
        'aes-256-gcm',
        clave,
        iv
    );

    decipher.setAuthTag(tag);

    return Buffer.concat([
        decipher.update(datos),
        decipher.final()
    ]);
}

module.exports = { cifrar, descifrar };
