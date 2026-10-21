
'use strict';

const { getAuth } = require('firebase-admin/auth');
const { db } = require('./firebase_caj');

const coleccionUsuarios = db
    ? db.collection('usuarios_alucilex')
    : null;

const ROLES_PERMITIDOS = Object.freeze([
    'coordinador',
    'asesor'
]);

async function obtenerPerfilUsuario(uid) {
    if (!coleccionUsuarios || !uid) {
        throw new Error('Usuario o Firestore no disponible');
    }

    const doc = await coleccionUsuarios.doc(uid).get();

    if (!doc.exists) {
        return null;
    }

    return {
        uid: doc.id,
        ...doc.data()
    };
}

async function verificarUsuarioAutenticado(token) {
    if (!token || typeof token !== 'string') {
        throw new Error('Token requerido');
    }

    const identidad = await getAuth().verifyIdToken(token, true);

    const perfil = await obtenerPerfilUsuario(identidad.uid);

    return {
        uid: identidad.uid,
        email: identidad.email || '',
        perfil,
        vinculado: Boolean(perfil)
    };
}

function tieneRol(perfil, rol) {
    if (!perfil || perfil.activo !== true) {
        return false;
    }

    if (!ROLES_PERMITIDOS.includes(rol)) {
        return false;
    }

    return Array.isArray(perfil.roles) &&
        perfil.roles.includes(rol);
}

module.exports = {
    ROLES_PERMITIDOS,
    obtenerPerfilUsuario,
    verificarUsuarioAutenticado,
    tieneRol
};
