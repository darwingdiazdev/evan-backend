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
    const { zona, desde, hasta } = req.query;

    console.log(zona, desde, hasta);

    const match = {};

    if (zona && zona !== 'Todas') {
      match.region = zona;
    }

    // Filtrar por rango de fechas si están presentes
    if (desde || hasta) {
      match.fecha = {};
      
      if (desde) {
        const desdeDate = new Date(desde);
        desdeDate.setUTCHours(4, 0, 0, 0); // Venezuela es UTC-4
        match.fecha.$gte = desdeDate;
      }

      if (hasta) {
        const hastaDate = new Date(hasta);
        hastaDate.setUTCHours(3, 59, 59, 999); // fin del día en UTC-4
        hastaDate.setDate(hastaDate.getDate() + 1); // avanzar 1 día
        match.fecha.$lte = hastaDate;
      }
    }


    const pipeline = [];

    if (Object.keys(match).length > 0) {
      pipeline.push({ $match: match });
    }

    pipeline.push({
      $group: {
        _id: null,
        evangelizados: { $sum: "$evangelizados" },
        sanidades: { $sum: "$sanidades" },
        convertidos: { $sum: "$convertidos" },
        discipulados: { $sum: "$discipulados" },
        ofrendas: { $sum: "$ofrendas" },
      },
    });

    const totales = await Report.aggregate(pipeline);


    if (totales.length === 0) {
      return res.json({
        evangelizados: 0,
        sanidades: 0,
        convertidos: 0,
        discipulados: 0,
        ofrendas: 0,
      });
    }

    res.json(totales[0]);

  } catch (err) {
    console.error('Error en totales:', err);
    res.status(500).json({
      error: 'Error interno del servidor',
    });
  }
});


module.exports = router;