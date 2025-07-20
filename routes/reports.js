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

  try {

    const { zona } = req.query;

    const match = {};

    if (zona && zona !== 'Todas') {
      match.region = zona; 
    }

    const pipeline = [];

    if (Object.keys(match).length > 0) {
      pipeline.push({ $match: match });
    }

    pipeline.push({
      $group: {
        _id: null,
        milagros: { $sum: "$milagros" },
        salvaciones: { $sum: "$salvaciones" },
        sanidades: { $sum: "$sanidades" },
        ofrendas: { $sum: "$ofrendas" },
      },
    });

    const totales = await Report.aggregate(pipeline);


    if (totales.length === 0) {
      return res.json({
        milagros: 0,
        salvaciones: 0,
        sanidades: 0,
        ofrendas: 0,
      });
    }

    res.json(totales[0]);

  } catch (err) {
    console.error('❌ Error en /totales:', err);
    res.status(500).json({
      error: 'Error interno del servidor',
    });
  }
});


module.exports = router;