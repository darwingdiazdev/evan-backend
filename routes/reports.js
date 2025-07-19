const express = require('express');
const router = express.Router();
const Report = require('../models/Report');

// Crear nuevo reporte
router.post('/', async (req, res) => {
  try {
    const report = new Report(req.body);
    await report.save();
    res.status(201).json(report);
  } catch (err) {
    res.status(500).json({ error: 'Error al guardar el reporte' });
  }
});

// Obtener todos los reportes
router.get('/', async (req, res) => {
  try {
    const reports = await Report.find().sort({ fecha: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los reportes' });
  }
});

router.get('/totales', async (req, res) => {
  console.log('Query:', req.query);
  try {
    const { zona, desde, hasta } = req.query;

    const filtro = {};
    if (zona) filtro.region = zona;

    if (desde && hasta) {
      // Para incluir todo el día "hasta", se suma 1 día y se usa $lt
      const desdeDate = new Date(desde);
      const hastaDate = new Date(hasta);
      hastaDate.setHours(23, 59, 59, 999);

      filtro.fecha = {
        $gte: desdeDate,
        $lte: hastaDate
      };
    }

    const documentos = await Report.find(filtro).sort({ fecha: 1 });

    console.log(`Documentos encontrados: ${documentos.length}`);

    res.json(documentos);
  } catch (err) {
    console.error('Error en /totales:', err);
    res.status(500).json({
      error: 'Error interno del servidor',
    });
  }
});


module.exports = router;