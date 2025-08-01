require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const reportRoutes = require('./routes/reports');
const userRoutes = require('./routes/user');

const app = express();
app.use(cors({ origin: '*' }))
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch((err) => console.error('Error al conectar:', err));

app.get('/health', async (req, res) => {
  res.status(200).json({ ok: 'ok' })
})

app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});
