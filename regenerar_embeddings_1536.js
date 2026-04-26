// regenerar_embeddings_1536.js
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const openai = new OpenAI({ 
    apiKey: process.env.OPENROUTER_API_KEY, 
    baseURL: 'https://openrouter.ai/api/v1' 
});

async function regenerar() {
    console.log("🔄 Regenerando embeddings con dimensión 1536...\n");
    
    let offset = 0;
    const limite = 50;
    let totalProcesados = 0;

    while (true) {
        const { data: fragmentos, error } = await supabase
            .from('fragmentos_legales')
            .select('id, contenido')
            .range(offset, offset + limite - 1);
        
        if (error) throw error;
        if (!fragmentos || fragmentos.length === 0) break;

        console.log(`📦 Procesando lote de ${fragmentos.length} fragmentos (total procesados: ${totalProcesados})...`);

        for (const frag of fragmentos) {
            try {
                const response = await openai.embeddings.create({
                    model: 'text-embedding-3-small',
                    input: frag.contenido.substring(0, 8000),
                    dimensions: 1536
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
        offset += limite;
    }
    console.log(`\n🎉 Proceso completado. Total de embeddings regenerados: ${totalProcesados}`);
}

regenerar();cls