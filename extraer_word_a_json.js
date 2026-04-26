// extraer_word_a_json.js
// Extractor inteligente de apuntes con reconocimiento heurístico de contexto
const fs = require('fs-extra');
const path = require('path');
const mammoth = require('mammoth');

// ========== CONFIGURACIÓN ==========
const carpetaOrigen = path.join('C:', 'Proyectos Alucilex', 'derecho 2026');
const carpetaDestino = path.join('C:', 'Alucilex', 'data');
const archivoSalida = path.join(carpetaDestino, 'apuntes_propios.json');

const AUTOR = "Carlos Rosas";
const FUENTE = "Apunte Personal Word";
const MAX_CARACTERES = 1200; 
// ==================================

function extraerMateriaDeArchivo(nombreArchivo) {
    return nombreArchivo
        .replace(/\.docx$/i, '')
        .replace(/^\d+\.\s*/, '') 
        .replace(/^RESUMEN\s*/i, '') 
        .trim();
}

async function procesarArchivos() {
    await fs.ensureDir(carpetaDestino);
    
    let archivos = [];
    try {
        archivos = await fs.readdir(carpetaOrigen);
    } catch (err) {
        console.error(`❌ No se pudo leer la carpeta: ${carpetaOrigen}`);
        return;
    }

    const docxFiles = archivos.filter(file => file.toLowerCase().endsWith('.docx'));
    if (docxFiles.length === 0) {
        console.log(`❌ No se encontraron archivos .docx`);
        return;
    }

    console.log(`📄 Encontrados ${docxFiles.length} apuntes. Iniciando extracción heurística...\n`);
    const todosLosFragmentos = [];

    for (const archivo of docxFiles) {
        const rutaCompleta = path.join(carpetaOrigen, archivo);
        const materia = extraerMateriaDeArchivo(archivo);
        console.log(`⚙️ Analizando Materia: ${materia}...`);

        try {
            const rawText = await mammoth.extractRawText({ path: rutaCompleta });
            const lineas = rawText.value.split('\n').map(l => l.trim()).filter(l => l.length > 0);

            let subtituloActual = "Conceptos Generales";
            let acumuladorTexto = "";
            let fragmentosArchivo = 0;

            for (let i = 0; i < lineas.length; i++) {
                const linea = lineas[i];

                const esPosibleTitulo = linea.length < 80 && !linea.endsWith('.') && !linea.endsWith(';');

                if (esPosibleTitulo) {
                    if (acumuladorTexto.length > 200) {
                        guardarFragmento();
                    }
                    subtituloActual = linea; 
                    continue;
                }

                acumuladorTexto += linea + "\n";

                if (acumuladorTexto.length >= MAX_CARACTERES) {
                    guardarFragmento();
                }
            }

            if (acumuladorTexto.length > 50) {
                guardarFragmento();
            }

            function guardarFragmento() {
                // AQUÍ ESTÁ LA MARCA VITAL PARA LA IA
                const prefijoDocumento = "Documento: Apunte de Estudio Universitario. ";
                const prefijoMateria = `Materia: ${materia}. `;
                const prefijoTema = `Tema Específico: ${subtituloActual}. `;
                const contextoEnriquecido = `${prefijoDocumento}${prefijoMateria}${prefijoTema}Texto: ${acumuladorTexto.trim()}`;

                todosLosFragmentos.push({
                    contenido: acumuladorTexto.trim(),
                    tipo: 'apunte_personal',
                    libro: null,
                    titulo: subtituloActual, 
                    articulo_numero: null,
                    numero_limpio: null,
                    articulo_titulo_completo: `${materia} - ${subtituloActual}`,
                    autor: AUTOR,
                    fuente: FUENTE,
                    ley_id: `Apunte_${materia.replace(/\s+/g, '_')}`,
                    contenido_para_embedding: contextoEnriquecido 
                });
                
                acumuladorTexto = ""; 
                fragmentosArchivo++;
            }

            console.log(`   ✅ Generados ${fragmentosArchivo} fragmentos inteligentes.`);

        } catch (err) {
            console.error(`   ❌ Error al procesar ${archivo}:`, err.message);
        }
    }

    await fs.writeJson(archivoSalida, todosLosFragmentos, { spaces: 2 });
    console.log(`\n🏆 ¡Extracción completada! Se generaron ${todosLosFragmentos.length} fragmentos en total.`);
    console.log(`📂 Archivo guardado en: ${archivoSalida}`);
}

procesarArchivos().catch(console.error);