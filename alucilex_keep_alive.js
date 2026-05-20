// =========================================================================
// ALUCILEX - HEARTBEAT (MANTENIMIENTO DE CONEXIÓN)
// Archivo: alucilex_keep_alive.js
// =========================================================================
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Conexión básica a tu proyecto
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function latidoAlucilex() {
    console.log("=================================================");
    console.log("💓 ENVIANDO LATIDO DE MANTENIMIENTO...");
    console.log("=================================================");

    try {
        // Ejecutamos una consulta mínima que no consume recursos: contar registros
        const { count, error } = await supabase
            .from('alucinet_plantillas')
            .select('*', { count: 'exact', head: true });

        if (error) throw error;

        console.log(`✅ ¡Éxito! Base de datos respondida correctamente.`);
        console.log(`📊 Estado actual: ${count} plantillas detectadas.`);
        console.log(`⏰ Hora: ${new Date().toLocaleTimeString()}`);

    } catch (err) {
        console.error(`❌ Error en el latido:`, err.message);
        console.log("⚠️ Asegúrate de que el proyecto no esté pausado manualmente en el dashboard.");
    }
    console.log("=================================================");
}

latidoAlucilex();
// =========================================================================