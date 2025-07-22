const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');  // para hashear contraseñas

// Registrar nuevo usuario
router.post('/register', async (req, res) => {
    
  try {
    const { username, password, zona, role } = req.body;

    // Validar campos mínimos
    if (!username || !password || !zona || !role) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    // Verificar que no exista usuario igual
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Usuario ya existe' });
    }

    // Hashear la contraseña antes de guardar
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      zona,
      role,
    });

    await newUser.save();
    res.status(201).json({ message: 'Usuario registrado correctamente' });

  } catch (err) {
    console.error('Error al registrar usuario:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const users = await User.find().sort({ username: 1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
});

// Login básico (validar usuario y contraseña)
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Faltan datos' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'Usuario o contraseña incorrectos' });
    }

    // Comparar contraseña con hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Usuario o contraseña incorrectos' });
    }

    // Aquí podrías generar un token JWT para sesiones, pero dejo simple:
    res.json({ message: 'Login exitoso', user: { id: user._id, username: user.username, zona: user.zona, role: user.role } });

  } catch (err) {
    res.status(500).json({ error: 'Error del servidor' });
  }
});

module.exports = router;
