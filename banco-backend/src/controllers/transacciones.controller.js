const { Transaccion, Cuenta, Cliente } = require('../models');

exports.getAll = async (_req, res) => {
  try {
    const transacciones = await Transaccion.findAll({
      include: [
        {
          model: Cuenta, as: 'cuentaOrigen',
          attributes: ['id', 'numero_cuenta'],
          include: [{ model: Cliente, attributes: ['nombre'] }]
        },
        {
          model: Cuenta, as: 'cuentaDestino',
          attributes: ['id', 'numero_cuenta'],
          include: [{ model: Cliente, attributes: ['nombre'] }]
        }
      ],
      order: [['fecha_hora', 'DESC']],
      limit: 100
    });
    res.json(transacciones);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getById = async (req, res) => {
  try {
    const t = await Transaccion.findByPk(req.params.id);
    if (!t) return res.status(404).json({ error: 'Transacción no encontrada' });
    res.json(t);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const { cuenta_origen_id, cuenta_destino_id, monto, tipo_movimiento } = req.body;

    if (!monto || monto <= 0)
      return res.status(400).json({ error: 'El monto debe ser mayor a 0' });
    if (!tipo_movimiento)
      return res.status(400).json({ error: 'El tipo de movimiento es obligatorio' });

    // Validaciones por tipo
    if (tipo_movimiento === 'Retiro' && !cuenta_origen_id)
      return res.status(400).json({ error: 'Retiro requiere cuenta origen' });
    if (tipo_movimiento === 'Deposito' && !cuenta_destino_id)
      return res.status(400).json({ error: 'Depósito requiere cuenta destino' });
    if (tipo_movimiento === 'Transferencia' && (!cuenta_origen_id || !cuenta_destino_id))
      return res.status(400).json({ error: 'Transferencia requiere cuenta origen y destino' });

    const transaccion = await Transaccion.create({
      cuenta_origen_id:  cuenta_origen_id  || null,
      cuenta_destino_id: cuenta_destino_id || null,
      monto,
      tipo_movimiento
    });
    res.status(201).json(transaccion);
  } catch (err) { res.status(500).json({ error: err.message }); }
};
