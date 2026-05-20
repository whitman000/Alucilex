require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const openai = new OpenAI({ 
    apiKey: process.env.OPENROUTER_API_KEY, 
    baseURL: 'https://openrouter.ai/api/v1' 
});

async function generarVectoresPerfecto() {
    console.log("\n🚀 INICIANDO CREACIÓN DE CEREBRO VECTORIAL (768 Dimensiones)...\n");
    let totalProcesados = 0;
    const LIMITE = 50;

    // Usamos un while(true) SIN offset, porque al actualizar el embedding, 
    // automáticamente salen de la lista de "pendientes".
    while (true) {
        // 1. Buscar registros que tengan la columna "embedding" vacía
        const { data: fragmentos, error } = await supabase
            .from('fragmentos_legales')
            .select('id, contenido, metadatos')
            .is('embedding', null)
            .limit(LIMITE);

        if (error) {
            console.error("❌ Error conectando a Supabase:", error.message);
            break;
        }

        if (!fragmentos || fragmentos.length === 0) {
            console.log("\n🎉 ¡PROCESO COMPLETADO! Todos los 4149 fragmentos tienen su vector.");
            break;
        }

        console.log(`📦 Procesando lote de ${fragmentos.length} fragmentos (Total listos: ${totalProcesados})...`);

        for (const frag of fragmentos) {
            try {
                // 2. Usar el texto enriquecido de los metadatos si existe, si no, el contenido normal
                let textoAProcesar = frag.metadatos?.contenido_para_embedding || frag.contenido;

                // Si por alguna razón el texto está vacío, le ponemos un texto genérico para que no falle
                if (!textoAProcesar || textoAProcesar.trim() === '') {
                    textoAProcesar = "Documento sin contenido legal.";
                }

                // 3. Crear el vector con OpenRouter
                const response = await openai.embeddings.create({
                    model: 'openai/text-embedding-3-small',
                    input: textoAProcesar.substring(0, 8000), // Límite de seguridad
                    dimensions: 768 // Dimensión exacta de tu base de datos
                });

                // 4. Guardar el vector en Supabase
                await supabase
                    .from('fragmentos_legales')
                    .update({ embedding: response.data[0].embedding })
                    .eq('id', frag.id);

                totalProcesados++;
                console.log(`  ✅ ID ${frag.id} vectorizado.`);
                
            } catch (err) {
                console.error(`  ❌ Error en ID ${frag.id}:`, err.message);
                // Si falla uno, le ponemos un texto de error en "contenido" para que en la próxima no tranque el sistema
                await supabase
                    .from('fragmentos_legales')
                    .update({ contenido: 'ERROR_API_OMITIR' })
                    .eq('id', frag.id);
            }
            
            // 5. Pausa táctica de 200ms para no saturar a OpenRouter
            await new Promise(r => setTimeout(r, 200)); 
        }
    }
}

generarVectoresPerfecto();