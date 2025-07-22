const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  fecha: { type: Date, default: Date.now },
  region: { type: String, required: true },
  iglesia: { type: String, required: true },
  actividad: { type: String, required: true },
  evangelizados: { type: Number, default: 0 },
  sanidades: { type: Number, default: 0 },
  convertidos: { type: Number, default: 0 },
  discipulados: { type: Number, default: 0 },
  ofrendas: { type: Number, default: 0 },
  comentario: { type: String, default: '' },
});

module.exports = mongoose.model('Report', ReportSchema);
