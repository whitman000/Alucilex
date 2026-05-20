// =========================================================================
// ALUCILEX - EMPAQUETADOR LOCAL DE PLANTILLAS LEGALES (FORMATO JSON)
// Archivo: empaquetador_plantillas.js
// =========================================================================
const fs = require('fs-extra');
const path = require('path');

// ========== CONFIGURACIÓN DE RUTAS LOCALES ==========
// Busca la carpeta "02_Planillas_Depuradas" directamente en C:\Alucilex\
const carpetaOrigen = path.join(__dirname, '02_Planillas_Depuradas'); 
const archivoSalida = path.join(__dirname, 'plantillas_procesadas_drive.json');
// ====================================================

async function empaquetarPlantillasLocalesJSON() {
    console.log("=================================================");
    console.log("📦 INICIANDO EMPAQUETADO DE ESCRITURAS ALUCILEX (JSON)");
    console.log("=================================================");

    // Verificar de forma estricta que la carpeta exista localmente
    if (!fs.existsSync(carpetaOrigen)) {
        console.error(`❌ No se encontró la carpeta física en: ${carpetaOrigen}`);
        process.exit(1);
    }

    const archivos = await fs.readdir(carpetaOrigen);
    
    // Filtrar estrictamente archivos .json, ignorando nuestra propia caja de salida por seguridad
    const jsonFiles = archivos.filter(file => file.toLowerCase().endsWith('.json') && file !== 'plantillas_procesadas_drive.json');

    if (jsonFiles.length === 0) {
        console.log(`❌ No se encontraron archivos .json de plantillas dentro de la carpeta.`);
        return;
    }

    console.log(`📄 Detectados ${jsonFiles.length} contratos locales en JSON. Iniciando extracción heurística...\n`);
    const plantillasFinales = [];

    for (const archivo of jsonFiles) {
        const rutaCompleta = path.join(carpetaOrigen, archivo);
        
        // Limpiar el nombre del archivo para que sea el título estético del contrato
        const tituloContrato = archivo.replace(/_planilla\.json$/i, '').replace(/\.json$/i, '').trim();
        console.log(`⚙️ Analizando: ${tituloContrato}`);

        try {
            const rawContent = await fs.readFile(rutaCompleta, 'utf-8');
            let cuerpoMatriz = "";

            try {
                // Algoritmo para parsear el JSON y extraer el bloque de texto más largo (el contrato)
                const parsedData = JSON.parse(rawContent);
                let longestString = "";
                
                const extractLongestString = (obj) => {
                    for (let key in obj) {
                        if (typeof obj[key] === 'string') {
                            if (obj[key].length > longestString.length) {
                                longestString = obj[key];
                            }
                        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                            extractLongestString(obj[key]);
                        }
                    }
                };
                
                extractLongestString(parsedData);
                cuerpoMatriz = longestString;

            } catch (parseError) {
                // Si falla el parseo, asumimos que es texto puro guardado con extensión .json
                cuerpoMatriz = rawContent;
            }

            cuerpoMatriz = cuerpoMatriz.trim();
            if (cuerpoMatriz.length < 50) {
                console.log(`   ⚠️ Omitido: El archivo no contiene texto legal suficiente.`);
                continue;
            }

            // Motor de escaneo para detectar variables encerradas en corchetes ej: [RUT_VENDEDOR]
            const regex = /\[([A-Z0-9_]+)\]/g;
            let match;
            const variablesUnicas = new Set();
            
            while ((match = regex.exec(cuerpoMatriz)) !== null) {
                variablesUnicas.add(match[1]);
            }

            // Construir metadatos de configuración para el formulario visual
            const camposConfig = Array.from(variablesUnicas).map(variable => {
                return {
                    id: variable,
                    tipo: "text",
                    label: variable.replace(/_/g, ' '), 
                    required: true
                };
            });

            // Ensamblar objeto listo para Supabase
            plantillasFinales.push({
                titulo: tituloContrato,
                categoria: 'Escrituras Públicas', 
                cuerpo_matriz: cuerpoMatriz,
                campos_config: JSON.stringify(camposConfig) 
            });

            console.log(`   ✅ Procesado con éxito: ${camposConfig.length} variables detectadas.`);

        } catch (err) {
            console.error(`   ❌ Error al abrir o leer ${archivo}:`, err.message);
        }
    }

    // Exportar el consolidado a la "caja de datos" .json
    await fs.writeJson(archivoSalida, plantillasFinales, { spaces: 2 });
    console.log(`\n🏆 ¡Empaquetado exitoso! Se procesaron ${plantillasFinales.length} escrituras.`);
    console.log(`📂 Caja de datos guardada en: ${archivoSalida}`);
    console.log(`\n=================================================`);
    console.log(`Siguiente paso: En tu terminal, ejecuta:`);
    console.log(`node inyector_plantillas_definitivo.js`);
    console.log(`=================================================\n`);
}

empaquetarPlantillasLocalesJSON().catch(console.error);
// =========================================================================