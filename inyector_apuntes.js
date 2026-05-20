require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function inyectarApuntes(archivoJson) {
    console.log(`\n==========================================`);
    console.log(`🚀 INICIANDO INGESTIÓN DE APUNTES/DOCTRINA`);
    console.log(`==========================================`);

    if (!fs.existsSync(archivoJson)) {
        console.error(`❌ Archivo ${archivoJson} no encontrado.`);
        return;
    }

    const rawData = JSON.parse(fs.readFileSync(archivoJson, 'utf8'));
    console.log(`📦 Leyendo ${rawData.length} registros desde ${archivoJson}`);

    // Formatear correctamente a la estructura de Supabase (metadatos)
    const registrosLimpios = rawData.map(item => {
        return {
            contenido: item.contenido,
            metadatos: {
                tipo: 'doctrina', // ETIQUETA EXACTA QUE BUSCA EL SABUESO
                titulo: item.titulo || "Apunte General",
                autor: item.autor || "Carlos Rosas",
                fuente: item.fuente || "Apunte Personal Word",
                ley_id: item.ley_id || null,
                contenido_para_embedding: item.contenido_para_embedding || item.contenido
            }
        };
    });

    // Insertar en lotes
    const TAMAÑO_LOTE = 200;
    let insertados = 0;
    for (let i = 0; i < registrosLimpios.length; i += TAMAÑO_LOTE) {
        const lote = registrosLimpios.slice(i, i + TAMAÑO_LOTE);
        const { error } = await supabase.from('fragmentos_legales').insert(lote);
        
        if (error) {
            console.error(`❌ Error en lote ${i/TAMAÑO_LOTE + 1}:`, error.message);
        } else {
            insertados += lote.length;
            console.log(`✅ Lote ${i/TAMAÑO_LOTE + 1} insertado (${insertados}/${registrosLimpios.length} registros)`);
        }
    }
    console.log(`\n🏆 ¡INYECCIÓN DE APUNTES COMPLETA! Total insertados: ${insertados}`);
}

const args = process.argv.slice(2);
if (args.length === 0) {
    console.error("Uso: node inyector_apuntes.js <archivo.json>");
    process.exit(1);
}
inyectarApuntes(args[0]);