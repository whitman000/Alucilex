'use strict';
const crypto = require('crypto');
const { getAuth } = require('firebase-admin/auth');
const { db } = require('./firebase_caj');

async function activarAsesor(id, coordinadorUid) {
  if (!db || !id || !coordinadorUid) throw new Error('Datos de activacion incompletos');
  const ref = db.collection('postulantes_caj').doc(id);
  const snap = await ref.get();
  if (!snap.exists) { const e = new Error('Asesor no encontrado'); e.status = 404; throw e; }
  const p = snap.data();
  if (p.duplicado_de || p.estado_vinculacion === 'duplicado') { const e = new Error('Registro duplicado'); e.status = 409; throw e; }
  const correo = String(p.email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) { const e = new Error('Correo invalido'); e.status=400; throw e; }
  const otros = await db.collection('postulantes_caj').where('email','==',correo).get();
  if (otros.docs.some(x => x.id !== id && x.data().activo === true)) { const e = new Error('Correo asociado a otro asesor activo');e.status=409;throw e; }
  const auth = getAuth();
  let usuario;
  if (p.firebase_uid) {
    usuario = await auth.getUser(p.firebase_uid);
    if (usuario.email?.toLowerCase() !== correo) throw new Error('Correo de Auth no corresponde al postulante');
  } else {
    try {
      usuario = await auth.getUserByEmail(correo);
      // Una cuenta preexistente NO se vincula solo por coincidencia del correo.
      const existente = await db.collection('usuarios_alucilex').doc(usuario.uid).get();
      if (!existente.exists || existente.data().postulante_id !== id) {
        const e = new Error('Ya existe cuenta Firebase sin vinculacion comprobada. Requiere validacion de identidad.'); e.status=409;throw e;
      }
    } catch (e) {
      if (e.code !== 'auth/user-not-found') throw e;
      usuario = await auth.createUser({
        email:correo,
        password:crypto.randomBytes(48).toString('base64url'),
        emailVerified:false,
        disabled:false
      });
      // Registrar UID temprano para recuperar reintentos tras errores de red.
      await ref.update({firebase_uid:usuario.uid,estado_vinculacion:'invitacion_pendiente'});
    }
  }
  const perfilRef = db.collection('usuarios_alucilex').doc(usuario.uid);
  await db.runTransaction(async tx => {
    const [pSnap, perfilSnap] = await Promise.all([tx.get(ref),tx.get(perfilRef)]);
    if (!pSnap.exists) throw new Error('Asesor desaparecio durante activacion');
    const actual=pSnap.data();
    if (actual.firebase_uid && actual.firebase_uid !== usuario.uid) throw new Error('Vinculado a otra identidad');
    if (perfilSnap.exists && perfilSnap.data().postulante_id !== id) throw new Error('La cuenta pertenece a otro postulante');
    if (actual.duplicado_de) throw new Error('No se puede activar duplicado');
    const sessionId = perfilSnap.exists && perfilSnap.data().sessionIdWhatsApp
      ? perfilSnap.data().sessionIdWhatsApp
      : 'post_' + usuario.uid.replace(/[^a-zA-Z0-9_-]/g,'');
    tx.set(perfilRef, {
      nombre:actual.nombre || '',email:correo,roles:['asesor'],activo:true,
      postulante_id:id,sessionIdWhatsApp:sessionId,
      fecha_actualizacion:new Date()
    },{merge:true});
    tx.update(ref, {firebase_uid:usuario.uid,estado_vinculacion:'invitacion_pendiente',activo:true,
      email:correo,rol:'asesor',fecha_vinculacion:new Date()});
  });
  // El correo se envia desde Firebase Auth Web mediante sendPasswordResetEmail.
  // No generar ni devolver enlaces privados al navegador del coordinador.
  return {ok:true,postulante_id:id,estado:'invitacion_pendiente',correo};
}
module.exports = { activarAsesor };
