const express = require('express');
const router = express.Router();

// Ruta para obtener de forma liviana el menú estructurado de categorías y títulos
router.get('/escrituras/menu', async (req, res) => {
    try {
        const supabase = req.app.get('supabase');
        
        const { data, error } = await supabase
            .from('plantillas_legales')
            .select('id, titulo, categoria')
            .order('categoria', { ascending: true })
            .order('titulo', { ascending: true });

        if (error) {
            throw error;
        }
        res.json(data);
    } catch (error) {
        console.error("[ERROR ALUCILEX - MENÚ ESCRITURAS]:", error.message);
        res.status(500).json({ error: "Error de conexión al cargar el menú de escrituras." });
    }
});

// Ruta para obtener la matriz de texto completa y las variables de un escrito específico
router.get('/escrituras/:id', async (req, res) => {
    try {
        const idContrato = req.params.id;
        const supabase = req.app.get('supabase');
        
        const { data, error } = await supabase
            .from('plantillas_legales')
            .select('id, titulo, cuerpo_matriz, campos_config')
            .eq('id', idContrato)
            .single();

        if (error) {
            throw error;
        }
        res.json(data);
    } catch (error) {
        console.error(`[ERROR ALUCILEX - CARGA CONTRATO ${req.params.id}]:`, error.message);
        res.status(500).json({ error: "Error al cargar la matriz legal del contrato solicitado." });
    }
});
// =========================================================================
// NUEVO ENDPOINT: AUDITORÍA DE RIESGO LEGAL CON INTELIGENCIA ARTIFICIAL
// =========================================================================
const OpenAI = require('openai');
const openai = new OpenAI({ 
    apiKey: process.env.OPENROUTER_API_KEY, 
    baseURL: 'https://openrouter.ai/api/v1' 
});

router.post('/escrituras/auditar', async (req, res) => {
    try {
        const { titulo, textoContrato } = req.body;

        if (!textoContrato) {
            return res.status(400).json({ error: "El documento está vacío o no se pudo capturar." });
        }

        const systemPrompt = `Eres Alucilex, el Catedrático Titular de Derecho Civil y Registral más prestigioso de Chile.
Tu misión es AUDITAR con extrema rigurosidad el siguiente borrador de escritura notarial que ha sido redactado por un usuario.

REGLAS INQUEBRANTABLES:
1. Analiza el documento bajo la normativa estricta del Código Civil Chileno y el Reglamento del Registro Conservatorio de Bienes Raíces.
2. Identifica Cláusulas Abusivas o Leoninas que perjudiquen gravemente a una de las partes.
3. Detecta Vacíos Legales u omisiones peligrosas (ej. falta de facultad al portador para requerir inscripciones, ausencia de renuncia a la acción resolutoria, o fallas en el saneamiento de evicción).
4. Advierte sobre Riesgos Registrales que puedan generar un reparo o rechazo de inscripción en el Conservador de Bienes Raíces.
5. Entrega tu dictamen estructurado obligatoriamente en 3 secciones claras: 
   - 🚨 RIESGOS DETECTADOS
   - ⚠️ OMISIONES LEGALES
   - ✅ RECOMENDACIÓN DE REDACCIÓN
6. Sé directo, académico y utiliza terminología jurídica chilena exacta.`;

        const userPrompt = `Tipo de Instrumento: ${titulo}\n\nTexto a auditar:\n${textoContrato}\n\nGenera el informe de auditoría registral ahora.`;

        // Llamada a la IA con baja temperatura (0.3) para asegurar respuestas precisas, deterministas y basadas en la ley, evitando alucinaciones creativas.
        const stream = await openai.chat.completions.create({
            model: "deepseek/deepseek-chat",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            temperature: 0.3, 
            max_tokens: 3000
        });

        const informe = stream.choices[0]?.message?.content || "No se pudo generar el informe de auditoría.";

        res.json({ informeAuditado: informe });

    } catch (error) {
        console.error("[ERROR CRÍTICO ALUCILEX - AUDITORÍA IA]:", error.message);
        res.status(500).json({ error: "Error de conexión con el cerebro de auditoría de Alucilex." });
    }
});
// =========================================================================
module.exports = router;