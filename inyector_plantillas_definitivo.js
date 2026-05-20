// =========================================================================
// ALUCILEX - MOTOR DE INYECCIÓN MASIVA DE PLANTILLAS A SUPABASE
// Archivo: inyector_plantillas_definitivo.js
// =========================================================================
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. Inicialización del Cliente Supabase con privilegios de administrador
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ ERROR CRÍTICO: Faltan las credenciales de Supabase en el archivo .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 2. Ruta del archivo JSON con los datos extraídos de Drive/Word
// DEBES colocar el archivo JSON generado por tu script en la misma carpeta con este nombre exacto:
const RUTA_ARCHIVO_JSON = path.join(__dirname, 'plantillas_procesadas_drive.json');

async function inyectarPlantillas() {
    console.log("=================================================");
    console.log("🚀 INICIANDO PROTOCOLO DE INYECCIÓN MASIVA ALUCILEX");
    console.log("=================================================");

    // Verificar que el archivo con los datos exista
    if (!fs.existsSync(RUTA_ARCHIVO_JSON)) {
        console.error(`❌ No se encontró el archivo de datos en: ${RUTA_ARCHIVO_JSON}`);
        console.log("⚠️ Asegúrate de que tu script de Drive haya guardado el resultado con el nombre 'plantillas_procesadas_drive.json'.");
        process.exit(1);
    }

    // Leer y parsear el archivo
    let plantillasRaw;
    try {
        const rawData = fs.readFileSync(RUTA_ARCHIVO_JSON, 'utf8');
        plantillasRaw = JSON.parse(rawData);
        console.log(`✅ Archivo JSON leído correctamente. Contiene ${plantillasRaw.length} documentos.`);
    } catch (error) {
        console.error("❌ Error al leer o parsear el archivo JSON:", error.message);
        process.exit(1);
    }

    let exito = 0;
    let errores = 0;

    // 3. Proceso de inserción iterativa para evitar saturación del pool de conexiones
    for (const plantilla of plantillasRaw) {
        try {
            // Estructura de mapeo estricta hacia la tabla plantillas_legales
            const payload = {
                titulo: plantilla.titulo || plantilla.title,
                categoria: plantilla.categoria || plantilla.category || 'Escrituras Públicas',
                cuerpo_matriz: plantilla.cuerpo_matriz || plantilla.content,
                // Si campos_config viene como objeto, lo transformamos a string para JSONB, si ya es string lo dejamos
                campos_config: typeof plantilla.campos_config === 'object' 
                                ? JSON.stringify(plantilla.campos_config) 
                                : (plantilla.campos_config || plantilla.fields || '[]')
            };

            // Validar que el cuerpo de la matriz no esté vacío
            if (!payload.cuerpo_matriz || payload.cuerpo_matriz.trim() === '') {
                console.warn(`⚠️ OMITIDO: La plantilla "${payload.titulo}" no tiene cuerpo matriz de texto.`);
                errores++;
                continue;
            }

            const { error } = await supabase
                .from('plantillas_legales')
                .insert([payload]);

            if (error) {
                console.error(`[❌ ERROR DE INSERCIÓN] Fallo en "${payload.titulo}":`, error.message);
                errores++;
            } else {
                console.log(`[✅ INYECTADO] Instrumento alojado: ${payload.titulo}`);
                exito++;
            }
        } catch (err) {
            console.error(`[❌ EXCEPCIÓN] En plantilla "${plantilla.titulo}":`, err.message);
            errores++;
        }
    }

    // 4. Reporte Final de Auditoría de Inyección
    console.log("\n=================================================");
    console.log("📊 REPORTE FINAL DE INYECCIÓN A SUPABASE");
    console.log("=================================================");
    console.log(`Instrumentos inyectados correctamente : ${exito}`);
    console.log(`Errores o documentos omitidos         : ${errores}`);
    console.log("=================================================\n");
    process.exit(0);
}

// Ejecutar el motor
inyectarPlantillas();
// =========================================================================