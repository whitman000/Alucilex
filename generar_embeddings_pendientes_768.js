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
    console.log("🔄 Generando embeddings a los pendientes (dimensión 768)...\n");
    
    const limite = 50;
    let totalProcesados = 0;

    while (true) {
        // SOLUCIÓN: Le decimos a Supabase que directamente ignore los que están vacíos
        const { data: fragmentos, error } = await supabase
            .from('fragmentos_legales')
            .select('id, contenido_para_embedding')
            .is('embedding', null)
            .not('contenido_para_embedding', 'is', null) // Filtro 1: Que no sea nulo
            .neq('contenido_para_embedding', '')         // Filtro 2: Que no sea texto vacío
            .limit(limite);
        
        if (error) throw error;
        
        if (!fragmentos || fragmentos.length === 0) {
            console.log("\n✅ Ya no quedan fragmentos con texto válido por vectorizar. ¡Terminado!");
            break;
        }

        console.log(`📦 Procesando lote de ${fragmentos.length} fragmentos (total procesados: ${totalProcesados})...`);

        for (const frag of fragmentos) {
            try {
                const response = await openai.embeddings.create({
                    model: 'openai/text-embedding-3-small', // SOLUCIÓN 3: Prefijo para OpenRouter
                    input: frag.contenido_para_embedding.substring(0, 8000),
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
                
                // Si la API de OpenRouter falla con uno, le ponemos un texto para que no nos haga un bucle infinito
                await supabase
                    .from('fragmentos_legales')
                    .update({ contenido_para_embedding: 'ERROR_API' })
                    .eq('id', frag.id);
            }
            await new Promise(r => setTimeout(r, 200)); 
        }
    }
    console.log(`\n🎉 Proceso completado con éxito. Total generados: ${totalProcesados}`);
}

generar();