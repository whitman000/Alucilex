'use strict';

const { db } = require('./firebase_caj');
const { tieneRol } = require('./usuarios_auth_caj');

function puedeAccederExpediente(caso, uid) {
    if (!caso || !uid) return false;

    if (caso.propietario_uid === uid) return true;

    const colaboradores = Array.isArray(caso.colaboradores_uids)
        ? caso.colaboradores_uids
        : [];

    return colaboradores.includes(uid);
}

function puedeAdministrarExpediente(caso, uid) {
    return Boolean(
        caso &&
        uid &&
        caso.propietario_uid === uid
    );
}

function usuarioCAJAutorizado(perfil) {
    return tieneRol(perfil, 'coordinador') ||
           tieneRol(perfil, 'asesor');
}

async function obtenerCasoAutorizado(id, uid) {
    if (!db || !id || !uid) return null;

    const documento = await db.collection('casos_caj').doc(id).get();

    if (!documento.exists) return null;

    const caso = {
        id: documento.id,
        ...documento.data()
    };

    return puedeAccederExpediente(caso, uid)
        ? caso
        : null;
}

module.exports = {
    puedeAccederExpediente,
    puedeAdministrarExpediente,
    usuarioCAJAutorizado,
    obtenerCasoAutorizado
};