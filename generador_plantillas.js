// =========================================================================
// ALUCILEX - MOTOR DE GENERACIÓN DE DOCUMENTOS (BACKEND ENGINE)
// Archivo: generador_plantillas.js
// Responsabilidad: Recuperar plantilla, mapear variables y renderizar.
// =========================================================================
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs-extra');
const path = require('path');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

/**
 * Motor de renderizado: Sustituye los placeholders [VAR] por datos reales
 * @param {string} cuerpoMatriz - El texto base con placeholders
 * @param {object} datosCliente - Objeto con los valores del usuario
 */
function renderizarContrato(cuerpoMatriz, datosCliente) {
    let documentoFinal = cuerpoMatriz;
    
    // Iterar sobre las variables del cliente y reemplazar en la matriz
    for (const [key, value] of Object.entries(datosCliente)) {
        const regex = new RegExp(`\\[${key}\\]`, 'g');
        documentoFinal = documentoFinal.replace(regex, value || `[${key}]`);
    }
    
    return documentoFinal;
}

async function generarDocumento(idPlantilla, datosParaRellenar) {
    console.log(`\n⚙️ INICIANDO GENERACIÓN: ID #${idPlantilla}`);

    // 1. Recuperar plantilla desde Supabase
    const { data, error } = await supabase
        .from('plantillas_legales')
        .select('*')
        .eq('id', idPlantilla)
        .single();

    if (error || !data) {
        console.error("❌ Error al recuperar la plantilla:", error ? error.message : "Plantilla no encontrada");
        return;
    }

    console.log(`📄 Plantilla cargada: "${data.titulo}"`);
    
    // 2. Ejecutar motor de renderizado
    const resultadoFinal = renderizarContrato(data.cuerpo_matriz, datosParaRellenar);

    // 3. Guardar el documento generado localmente
    const rutaSalida = path.join(__dirname, `CONTRATO_GENERADO_${data.titulo.replace(/\s+/g, '_')}.txt`);
    await fs.writeFile(rutaSalida, resultadoFinal, 'utf-8');

    console.log(`\n🏆 ¡Documento generado con éxito!`);
    console.log(`📂 Guardado en: ${rutaSalida}`);
    return resultadoFinal;
}

// =========================================================================
// EJECUCIÓN DE PRUEBA (SIMULACIÓN DE INTERFAZ)
// Aquí simulamos que el usuario rellenó los campos detectados
// =========================================================================
const datosSimuladosUsuario = {
    "RUT_VENDEDOR": "12.345.678-9",
    "NOMBRE_COMPRADOR": "JUAN PEREZ",
    "FECHA_ACTUAL": "20 DE MAYO DE 2026",
    // Agrega aquí todas las variables que detectó tu script anterior
};

// Llamada al motor (Asumimos que el ID es 1 por la inyección anterior)
generarDocumento(1, datosSimuladosUsuario).catch(console.error);
// =========================================================================