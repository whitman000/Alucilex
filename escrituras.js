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

module.exports = router;