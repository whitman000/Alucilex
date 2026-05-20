require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Error Crítico: Faltan credenciales de Supabase en el archivo .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function ejecutarIngestionLeyes() {
    console.log(`\n==========================================`);
    console.log(`🚀 INICIANDO INGESTIÓN DE CÓDIGO CIVIL`);
    console.log(`==========================================`);

    try {
        if (!fs.existsSync('./data/leyes.json')) {
            throw new Error("No se encuentra el archivo ./data/leyes.json.");
        }
        
        const rawData = fs.readFileSync('./data/leyes.json', 'utf8');
        const articulos = JSON.parse(rawData);
        console.log(`✅ Se encontraron ${articulos.length} artículos en el JSON.`);

        // Mapeo a la columna "metadatos"
        const registros = articulos.map(art => {
            let libro = null;
            let titulo = null;
            let articulo_numero = null;

            const libroMatch = art.titulo.match(/\[Libro\s+([^\]]+)\]/i);
            if (libroMatch) libro = libroMatch[1].trim();

            const tituloMatch = art.titulo.match(/\[Título\s+([^\]]+)\]/i);
            if (tituloMatch) titulo = tituloMatch[1].trim();

            const artNumMatch = art.titulo.match(/Art\.?\s*(\d+[a-zA-Zº°]*)/i);
            if (artNumMatch) articulo_numero = artNumMatch[1].trim();

            const prefijoLey = "Código Civil de Chile. ";
            const contenidoEnriquecido = `${prefijoLey} Artículo: ${articulo_numero || 'General'}. Texto: ${art.contenido}`;

            return {
                contenido: art.contenido,
                // TODA LA IDENTIDAD VA DENTRO DE METADATOS
                metadatos: {
                    tipo: 'ley',
                    libro: libro,
                    titulo: titulo,
                    articulo: articulo_numero, // CLAVE PARA EL SABUESO
                    numero_limpio: articulo_numero ? articulo_numero.replace(/[^0-9]/g, '') : null,
                    articulo_titulo_completo: art.titulo,
                    fuente: 'BCN',
                    contenido_para_embedding: contenidoEnriquecido
                }
            };
        });

        // Inserción por lotes
        const TAMAÑO_LOTE = 200;
        let lotesExitosos = 0;
        let totalInsertados = 0;
        
        for (let i = 0; i < registros.length; i += TAMAÑO_LOTE) {
            const lote = registros.slice(i, i + TAMAÑO_LOTE);
            const { error: insertError } = await supabase.from('fragmentos_legales').insert(lote);
            if (insertError) throw new Error(`Fallo en lote: ${insertError.message}`);
            
            lotesExitosos++;
            totalInsertados += lote.length;
            console.log(`   ✅ Lote ${lotesExitosos} insertado (${totalInsertados}/${registros.length} artículos)`);
        }

        console.log(`\n🏆 ¡INGESTIÓN DE LEY COMPLETA! ${totalInsertados} artículos insertados.`);
    } catch (error) {
        console.error("\n❌ ERROR CRÍTICO:", error.message);
    }
}

ejecutarIngestionLeyes();