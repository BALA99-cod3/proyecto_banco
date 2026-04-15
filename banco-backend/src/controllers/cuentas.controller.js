const { Cuenta, Cliente } = require('../models');

exports.getAll = async (_req, res) => {
  try {
    const cuentas = await Cuenta.findAll({
      include: [{ model: Cliente, attributes: ['id', 'nombre', 'email'] }],
      order: [['id', 'ASC']]
    });
    res.json(cuentas);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getById = async (req, res) => {
  try {
    const cuenta = await Cuenta.findByPk(req.params.id, {
      include: [{ model: Cliente }]
    });
    if (!cuenta) return res.status(404).json({ error: 'Cuenta no encontrada' });
    res.json(cuenta);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const { cliente_id, numero_cuenta, tipo_cuenta, saldo, estado } = req.body;
    if (!cliente_id || !numero_cuenta)
      return res.status(400).json({ error: 'cliente_id y numero_cuenta son obligatorios' });

    const existe = await Cuenta.findOne({ where: { numero_cuenta } });
    if (existe) return res.status(409).json({ error: 'El número de cuenta ya existe' });

    const cuenta = await Cuenta.create({ cliente_id, numero_cuenta, tipo_cuenta, saldo: saldo || 0, estado: estado || 'Activa' });
    res.status(201).json(cuenta);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const cuenta = await Cuenta.findByPk(req.params.id);
    if (!cuenta) return res.status(404).json({ error: 'Cuenta no encontrada' });
    // No permitir cambiar numero_cuenta a uno ya existente
    if (req.body.numero_cuenta && req.body.numero_cuenta !== cuenta.numero_cuenta) {
      const dup = await Cuenta.findOne({ where: { numero_cuenta: req.body.numero_cuenta } });
      if (dup) return res.status(409).json({ error: 'Número de cuenta ya en uso' });
    }
    await cuenta.update(req.body);
    res.json(cuenta);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.remove = async (req, res) => {
  try {
    const cuenta = await Cuenta.findByPk(req.params.id);
    if (!cuenta) return res.status(404).json({ error: 'Cuenta no encontrada' });
    await cuenta.destroy();
    res.json({ message: 'Cuenta eliminada' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
