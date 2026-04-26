// generar_embeddings_pendientes_768.js
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const openai = new OpenAI({ 
    apiKey: process.env.OPENROUTER_API_KEY, 
    baseURL: 'https://openrouter.ai/api/v1' 
});

async function generar() {
    console.log("🔄 Generando embeddings con Contexto Enriquecido (dimensión 768)...\n");
    
    const limite = 50;
    let totalProcesados = 0;

    while (true) {
        // SOLUCIÓN: Quitamos el 'range/offset' y usamos 'limit'. 
        // Siempre tomará los siguientes 50 que sigan en null.
        const { data: fragmentos, error } = await supabase
            .from('fragmentos_legales')
            .select('id, contenido_para_embedding')
            .is('embedding', null)
            .limit(limite);
        
        if (error) throw error;
        if (!fragmentos || fragmentos.length === 0) break;

        console.log(`📦 Procesando lote de ${fragmentos.length} fragmentos (total procesados: ${totalProcesados})...`);

        for (const frag of fragmentos) {
            try {
                const textoParaVectorizar = frag.contenido_para_embedding;

                if (!textoParaVectorizar) {
                    console.log(`⚠️ Advertencia: El ID ${frag.id} no tiene contenido_para_embedding. Saltando...`);
                    continue;
                }

                const response = await openai.embeddings.create({
                    model: 'text-embedding-3-small',
                    input: textoParaVectorizar.substring(0, 8000),
                    dimensions: 768
                });

                await supabase
                    .from('fragmentos_legales')
                    .update({ embedding: response.data[0].embedding })
                    .eq('id', frag.id);
                    
                totalProcesados++;
                console.log(`✅ ID ${frag.id} (${totalProcesados} procesados)`);
            } catch (err) {
                console.error(`❌ Error en ID ${frag.id}:`, err.message);
            }
            await new Promise(r => setTimeout(r, 200)); 
        }
    }
    console.log(`\n🎉 Proceso completado. Total de embeddings generados en esta sesión: ${totalProcesados}`);
}

generar();