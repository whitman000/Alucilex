// auditoria_db.js - Escáner de Identidad Documental en Supabase
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Error: Faltan credenciales en .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function auditarBaseDeDatos() {
    console.log(`\n==========================================`);
    console.log("🔍 Iniciando Auditoría de Identidad en Supabase...");
    console.log(`==========================================\n`);

    try {
        // 1. Auditar Leyes (Código Civil)
        const { data: leyes, error: errorLeyes, count: countLeyes } = await supabase
            .from('fragmentos_legales')
            .select('tipo, fuente, ley_id, articulo_numero', { count: 'exact', head: false })
            .eq('tipo', 'ley')
            .limit(1);

        if (errorLeyes) throw errorLeyes;

        console.log(`⚖️  CLASE 1: LEYES (Código Civil)`);
        console.log(`   - Total de registros: ${countLeyes}`);
        if (leyes && leyes.length > 0) {
            console.log(`   - Huella detectada -> tipo: "${leyes[0].tipo}", fuente: "${leyes[0].fuente}", ley_id: "${leyes[0].ley_id}"`);
        } else {
            console.log(`   - ⚠️ No se encontraron registros de leyes.`);
        }

        console.log("\n--------------------------------------------------\n");

        // 2. Auditar Apuntes Personales
        const { data: apuntes, error: errorApuntes, count: countApuntes } = await supabase
            .from('fragmentos_legales')
            .select('tipo, fuente, ley_id, titulo', { count: 'exact', head: false })
            .eq('tipo', 'apunte_personal')
            .limit(1);

        if (errorApuntes) throw errorApuntes;

        console.log(`📚 CLASE 2: APUNTES DE ESTUDIO`);
        console.log(`   - Total de registros: ${countApuntes}`);
        if (apuntes && apuntes.length > 0) {
            console.log(`   - Huella detectada -> tipo: "${apuntes[0].tipo}", fuente: "${apuntes[0].fuente}", ley_id: "${apuntes[0].ley_id}"`);
        } else {
            console.log(`   - ⚠️ No se encontraron registros de apuntes.`);
        }

        console.log(`\n==========================================`);
        console.log("✅ Auditoría finalizada. Listo para configurar server.js.");
        console.log(`==========================================\n`);

    } catch (error) {
        console.error("❌ Error crítico durante la auditoría:", error.message);
    }
}

auditarBaseDeDatos();