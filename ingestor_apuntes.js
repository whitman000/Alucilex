// inyector_personalizado.js
// Inserta cualquier JSON de fragmentos en la tabla fragmentos_legales
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function inyectar(archivoJson) {
    if (!fs.existsSync(archivoJson)) {
        console.error(`❌ Archivo ${archivoJson} no encontrado.`);
        return;
    }

    const data = JSON.parse(fs.readFileSync(archivoJson, 'utf8'));
    console.log(`📦 Leyendo ${data.length} registros desde ${archivoJson}`);

    // Insertar en lotes
    const TAMAÑO_LOTE = 200;
    let insertados = 0;
    for (let i = 0; i < data.length; i += TAMAÑO_LOTE) {
        const lote = data.slice(i, i + TAMAÑO_LOTE);
        const { error } = await supabase.from('fragmentos_legales').insert(lote);
        if (error) {
            console.error(`❌ Error en lote ${i/TAMAÑO_LOTE + 1}:`, error.message);
        } else {
            insertados += lote.length;
            console.log(`✅ Lote ${i/TAMAÑO_LOTE + 1} insertado (${lote.length} registros)`);
        }
    }
    console.log(`\n✅ Inyección completada. Total insertados: ${insertados}`);
}

// Ejecutar: node inyector_personalizado.js data/apuntes_propios.json
const args = process.argv.slice(2);
if (args.length === 0) {
    console.error("Uso: node inyector_personalizado.js <archivo.json>");
    process.exit(1);
}
inyectar(args[0]);