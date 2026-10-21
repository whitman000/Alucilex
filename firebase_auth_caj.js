
'use strict';

import { initializeApp, getApps } from 'https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js';
import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js';

const firebaseConfig = {
    apiKey: "AIzaSyCLWUUEaeywyPJWZR5y26RdsmtlRZDbZNw",
    authDomain: "alucinet-lex.firebaseapp.com",
    projectId: "alucinet-lex",
    storageBucket: "alucinet-lex.firebasestorage.app",
    messagingSenderId: "391160345338",
    appId: "1:391160345338:web:a9de04dee8a9995f84cf43"
};

const app = getApps().length
    ? getApps()[0]
    : initializeApp(firebaseConfig);

const auth = getAuth(app);

export async function iniciarSesionFirebase(correo, contrasena) {
    const credencial = await signInWithEmailAndPassword(
        auth,
        correo,
        contrasena
    );

    return {
        uid: credencial.user.uid,
        email: credencial.user.email,
        token: await credencial.user.getIdToken()
    };
}

export async function obtenerTokenFirebase() {
    const usuario = auth.currentUser;

    if (!usuario) {
        return null;
    }

    return usuario.getIdToken();
}

export async function cerrarSesionFirebase() {
    await signOut(auth);
}

export function observarSesionFirebase(callback) {
    return onAuthStateChanged(auth, callback);
}

// Invitaciones CAJ: Firebase envia el correo de establecimiento de contrasena.
export async function enviarCorreoActivacionAsesorCAJ(correo) {
    if (!auth.currentUser) throw new Error('Debe iniciar sesion el coordinador');
    await sendPasswordResetEmail(auth, correo);
}