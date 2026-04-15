const { Cliente, Cuenta, Usuario } = require('../models');

exports.getAll = async (_req, res) => {
  try {
    const clientes = await Cliente.findAll({
      include: [{ model: Cuenta, attributes: ['id', 'numero_cuenta', 'tipo_cuenta', 'saldo', 'estado'] }],
      order: [['nombre', 'ASC']]
    });
    res.json(clientes);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getById = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id, {
      include: [{ model: Cuenta }]
    });
    if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json(cliente);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const { nombre, email, telefono } = req.body;
    if (!nombre || !email)
      return res.status(400).json({ error: 'Nombre y email son obligatorios' });

    const existe = await Cliente.findOne({ where: { email } });
    if (existe) return res.status(409).json({ error: 'El email ya existe' });

    const cliente = await Cliente.create({ nombre, email, telefono });
    res.status(201).json(cliente);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
    await cliente.update(req.body);
    res.json(cliente);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.remove = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
    await cliente.destroy(); // CASCADE elimina cuentas y usuario asociados
    res.json({ message: 'Cliente eliminado correctamente' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
