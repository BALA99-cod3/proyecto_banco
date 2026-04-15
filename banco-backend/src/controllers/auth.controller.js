const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const { Usuario, Rol, Cliente } = require('../models');

// ── Registro de nuevo usuario ────────────────────────────
exports.register = async (req, res) => {
  try {
    const { nombre, email, telefono, password } = req.body;

    if (!nombre || !email || !password)
      return res.status(400).json({ error: 'Nombre, email y contraseña son obligatorios' });

    const existe = await Usuario.findOne({ where: { email } });
    if (existe)
      return res.status(409).json({ error: 'El email ya está registrado' });

    // Crear cliente y usuario en secuencia
    const cliente = await Cliente.create({ nombre, email, telefono: telefono || null });
    const hash    = await bcrypt.hash(password, 12);
    const usuario = await Usuario.create({
      rol_id: 2, email, password: hash, cliente_id: cliente.id
    });

    res.status(201).json({
      message: 'Usuario registrado correctamente',
      id: usuario.id
    });
  } catch (err) {
    console.error('register error:', err);
    res.status(500).json({ error: err.message });
  }
};

// ── Login ─────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email y contraseña son obligatorios' });

    const usuario = await Usuario.findOne({
      where: { email },
      include: [{ model: Rol }]
    });

    if (!usuario)
      return res.status(404).json({ error: 'Usuario no encontrado' });
    if (!usuario.activo)
      return res.status(403).json({ error: 'Cuenta desactivada. Contacta al administrador' });

    const valida = await bcrypt.compare(password, usuario.password);
    if (!valida)
      return res.status(401).json({ error: 'Contraseña incorrecta' });

    await usuario.update({ ultimo_login: new Date() });

    const token = jwt.sign(
      {
        id:         usuario.id,
        email:      usuario.email,
        rol:        usuario.Rol.nombre,
        cliente_id: usuario.cliente_id
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      usuario: {
        id:    usuario.id,
        email: usuario.email,
        rol:   usuario.Rol.nombre,
        cliente_id: usuario.cliente_id
      }
    });
  } catch (err) {
    console.error('login error:', err);
    res.status(500).json({ error: err.message });
  }
};

// ── Perfil del usuario autenticado ────────────────────────
exports.profile = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Rol }, { model: Cliente }]
    });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
