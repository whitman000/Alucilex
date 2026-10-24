'use strict';

// CAJ_CONTROL_ENTREVISTA_DETERMINISTA_V1
// Este módulo solo determina preguntas.
// No accede a WhatsApp, Firebase ni OpenRouter.

const PREGUNTAS_PERSONALES = Object.freeze([
    ['nombres', '¿Cuáles son sus nombres?'],
    ['apellido1', '¿Cuál es su primer apellido?'],
    ['apellido2', '¿Cuál es su segundo apellido?'],
    ['usuario_rut', '¿Cuál es su RUT?'],
    ['sexo', '¿Cuál es su sexo registrado?'],
    ['fecha_nacimiento', '¿Cuál es su fecha de nacimiento?'],
    ['genero', '¿Con qué género se identifica?'],
    ['domicilio', '¿Cuál es su dirección de residencia?'],
    ['region', '¿En qué región reside?'],
    ['comuna', '¿En qué comuna reside?'],
    ['telefono_fijo', '¿Tiene teléfono fijo?'],
    ['telefono_recado', '¿Tiene un teléfono de recado?'],
    ['email', '¿Cuál es su correo electrónico?'],
    ['nacionalidad', '¿Cuál es su nacionalidad?'],
    ['estado_civil', '¿Cuál es su estado civil?'],
    ['profesion', '¿Cuál es su profesión u oficio?'],
    ['etnia', '¿Desea informar pertenencia a algún pueblo indígena?'],
    ['representante_legal', '¿Actúa mediante representante legal?'],
    ['forma_ingreso', '¿Cuál fue su forma de ingreso al servicio?']
]);

const RESPUESTAS_NO_APLICABLES = new Set([
    'no corresponde',
    'no aplica',
    'no tengo',
    'no posee',
    'prefiero no informar',
    'prefiero no responder',
    'desconocido',
    'no sé'
]);

function tieneRespuesta(valor) {
    if (valor === null || valor === undefined) {
        return false;
    }

    if (typeof valor === 'number') {
        return Number.isFinite(valor);
    }

    return typeof valor === 'string' &&
        valor.trim().length > 0;
}

function obtenerDato(ficha, campo) {
    const personal = ficha.ficha_personal || {};

    if (tieneRespuesta(personal[campo])) {
        return personal[campo];
    }

    if (campo === 'usuario_rut') {
        return ficha.usuario_rut;
    }

    if (campo === 'domicilio') {
        return ficha.domicilio;
    }

    if (['comuna', 'profesion', 'email'].includes(campo)) {
        return ficha[campo];
    }

    return '';
}

function siguientePreguntaPersonal(ficha = {}, opciones = {}) {
    const resueltos = new Set(
        Array.isArray(opciones.camposResueltos)
            ? opciones.camposResueltos
            : []
    );

    for (const [campo, pregunta] of PREGUNTAS_PERSONALES) {
        const valor = obtenerDato(ficha, campo);

        if (tieneRespuesta(valor) || resueltos.has(campo)) {
            continue;
        }

        return {
            campo,
            pregunta,
            etapa: 'ficha_personal'
        };
    }

    return null;
}

function estaRespondidoSinDato(respuesta) {
    const texto = String(respuesta || '')
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

    return RESPUESTAS_NO_APLICABLES.has(texto);
}

function registrarRespuestaCampo(ficha = {}, estado = {}, campo, respuesta) {
    const permitidos = new Set(
        PREGUNTAS_PERSONALES.map(item => item[0])
    );

    if (!permitidos.has(campo)) {
        throw new Error(`Campo de entrevista no permitido: ${campo}`);
    }

    const texto = String(respuesta ?? '').trim();

    if (!texto) {
        return {
            ficha,
            estado,
            aceptada: false,
            motivo: 'respuesta_vacia'
        };
    }

    const resueltos = new Set(
        Array.isArray(estado.camposResueltos)
            ? estado.camposResueltos
            : []
    );

    if (estaRespondidoSinDato(texto)) {
        resueltos.add(campo);

        return {
            ficha,
            estado: {
                ...estado,
                camposResueltos: Array.from(resueltos)
            },
            aceptada: true,
            motivo: 'sin_dato_aplicable'
        };
    }

    // Las respuestas ordinarias deben ser interpretadas y
    // validadas por el extractor antes de guardarse en la ficha.
    // Evita asignar una frase arbitraria al campo equivocado.
    return {
        ficha,
        estado,
        aceptada: false,
        motivo: 'requiere_extraccion_validada'
    };
}
// CAJ_CUESTIONARIO_JURIDICO_V1
// Determina preguntas; no escribe en Firebase ni envia WhatsApp.
function siguientePreguntaJuridica(ficha = {}, estado = {}) {
    const juridico = ficha.antecedentes_juridicos || {};
    const resueltos = new Set(
        Array.isArray(estado.camposResueltos)
            ? estado.camposResueltos
            : []
    );

    function pendiente(campo, valor, pregunta) {
        if (resueltos.has(campo) || tieneRespuesta(valor)) {
            return null;
        }
        return { etapa: 'antecedentes_juridicos', campo, pregunta };
    }

    const iniciales = [
        [
            'consulta_juridica',
            juridico.consulta_juridica,
            '¿Cuál es el problema jurídico por el que solicita atención?'
        ],
        [
            'relato_hechos',
            ficha.relato_hechos,
            '¿Qué ocurrió y cuándo sucedieron los hechos principales?'
        ],
        [
            'contraparte_nombre',
            ficha.contraparte_nombre &&
                !['Por determinar', 'S/R'].includes(ficha.contraparte_nombre)
                ? ficha.contraparte_nombre
                : '',
            '¿Quién es la otra persona o entidad involucrada?'
        ],
        [
            'objetivo_consulta',
            juridico.objetivo_consulta,
            '¿Qué solución o resultado espera obtener con nuestra ayuda?'
        ]
    ];

    for (const [campo, valor, pregunta] of iniciales) {
        const siguiente = pendiente(campo, valor, pregunta);
        if (siguiente) return siguiente;
    }

    const existeCausa = estado.existeCausaJudicial;

    if (existeCausa !== true && existeCausa !== false) {
        return {
            etapa: 'antecedentes_juridicos',
            campo: 'existeCausaJudicial',
            pregunta: '¿Actualmente existe una causa judicial iniciada sobre este asunto?'
        };
    }

    if (existeCausa === true) {
        const judiciales = [
            ['numero_causa', juridico.numero_causa,
                '¿Cuál es el RIT o número de la causa judicial?'],
            ['tribunal', ficha.tribunal && ficha.tribunal !== 'Por determinar'
                ? ficha.tribunal : '',
                '¿En qué tribunal se tramita la causa?'],
            ['calidad_procesal', juridico.calidad_procesal,
                '¿En qué calidad participa usted en la causa?'],
            ['estado_procesal', juridico.estado_procesal,
                '¿En qué etapa se encuentra actualmente el procedimiento?'],
            ['fecha_audiencia', juridico.fecha_audiencia,
                '¿Existe una audiencia próxima? Si es así, ¿cuándo será?']
        ];

        for (const [campo, valor, pregunta] of judiciales) {
            const siguiente = pendiente(campo, valor, pregunta);
            if (siguiente) return siguiente;
        }

        // RUC solamente si corresponde al procedimiento.
        if (
            estado.requiereRuc === true
        ) {
            const siguiente = pendiente(
                'ruc',
                juridico.ruc,
                '¿Cuál es el RUC de la causa?'
            );
            if (siguiente) return siguiente;
        }
    }

    return null;
}
function interpretarExistenciaCausa(respuesta) {
    const texto = String(respuesta || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[.,;!?¿¡]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    if (!texto) return null;

    const negativas = [
        /^no$/,
        /^no tengo (una )?causa$/,
        /^no tengo juicio$/,
        /^no hay (una )?causa$/,
        /^no he presentado (una )?demanda$/,
        /^todavia no he presentado (una )?demanda$/,
        /^aun no he presentado (una )?demanda$/,
        /^no existe (una )?causa judicial$/
    ];

    const afirmativas = [
        /^si$/,
        /^si tengo (una )?causa$/,
        /^si tengo (un )?juicio$/,
        /^tengo (una )?causa judicial$/,
        /^tengo (un )?juicio$/,
        /^ya presente (una )?demanda$/,
        /^hay (una )?causa judicial$/
    ];

    if (negativas.some(patron => patron.test(texto))) {
        return false;
    }

    if (afirmativas.some(patron => patron.test(texto))) {
        return true;
    }

    return null;
}
module.exports = {
    PREGUNTAS_PERSONALES,
    siguientePreguntaPersonal,
    estaRespondidoSinDato,
    registrarRespuestaCampo,
    siguientePreguntaJuridica,
    interpretarExistenciaCausa
};