const sequelize = require('../config/database');
const { DataTypes, Sequelize } = require('sequelize');

// ── Rol ──────────────────────────────────────────────────
const Rol = sequelize.define('Rol', {
  id:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre:      { type: DataTypes.STRING(50), allowNull: false, unique: true },
  descripcion: { type: DataTypes.STRING(255) }
}, { tableName: 'roles' });

// ── Cliente ───────────────────────────────────────────────
const Cliente = sequelize.define('Cliente', {
  id:         { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre:     { type: DataTypes.STRING(100), allowNull: false },
  email:      { type: DataTypes.STRING(100), allowNull: false, unique: true,
                validate: { isEmail: true } },
  telefono:   { type: DataTypes.STRING(20) },
  creado_en:  { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'clientes' });

// ── Usuario ───────────────────────────────────────────────
const Usuario = sequelize.define('Usuario', {
  id:           { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  rol_id:       { type: DataTypes.INTEGER, allowNull: false },
  email:        { type: DataTypes.STRING(100), allowNull: false, unique: true },
  password:     { type: DataTypes.STRING(255), allowNull: false },
  cliente_id:   { type: DataTypes.INTEGER, allowNull: true },
  activo: { 
  type: DataTypes.BOOLEAN,
  allowNull: false,
  defaultValue: Sequelize.literal('false')
},
  ultimo_login: { type: DataTypes.DATE, allowNull: true },
  creado_en:    { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'usuarios' });

// ── Cuenta ────────────────────────────────────────────────
const Cuenta = sequelize.define('Cuenta', {
  id:            { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  cliente_id:    { type: DataTypes.INTEGER },
  numero_cuenta: { type: DataTypes.STRING(20), allowNull: false, unique: true },
  tipo_cuenta:   { type: DataTypes.ENUM('Ahorro', 'Corriente'), defaultValue: 'Ahorro' },
  saldo:         { type: DataTypes.DECIMAL(15, 2), defaultValue: 0.00 },
  estado:        { type: DataTypes.ENUM('Activa', 'Bloqueada', 'Inactiva'), defaultValue: 'Activa' }
}, { tableName: 'cuentas' });

// ── Transaccion ───────────────────────────────────────────
const Transaccion = sequelize.define('Transaccion', {
  id:                { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  cuenta_origen_id:  { type: DataTypes.INTEGER, allowNull: true },
  cuenta_destino_id: { type: DataTypes.INTEGER, allowNull: true },
  monto:             { type: DataTypes.DECIMAL(15, 2), allowNull: false,
                       validate: { min: 0.01 } },
  tipo_movimiento:   { type: DataTypes.ENUM('Deposito', 'Retiro', 'Transferencia'), allowNull: false },
  fecha_hora:        { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'transacciones' });

// ── AuditoriaSaldo ────────────────────────────────────────
const AuditoriaSaldo = sequelize.define('AuditoriaSaldo', {
  id:             { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  cuenta_id:      { type: DataTypes.INTEGER },
  saldo_anterior: { type: DataTypes.DECIMAL(15, 2) },
  saldo_nuevo:    { type: DataTypes.DECIMAL(15, 2) },
  usuario_cambio: { type: DataTypes.STRING(50) },
  fecha_cambio:   { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'auditoria_saldos' });

// ── Asociaciones ──────────────────────────────────────────
Usuario.belongsTo(Rol,     { foreignKey: 'rol_id' });
Rol.hasMany(Usuario,       { foreignKey: 'rol_id' });

Usuario.belongsTo(Cliente, { foreignKey: 'cliente_id' });
Cliente.hasOne(Usuario,    { foreignKey: 'cliente_id' });

Cliente.hasMany(Cuenta,    { foreignKey: 'cliente_id' });
Cuenta.belongsTo(Cliente,  { foreignKey: 'cliente_id' });

Transaccion.belongsTo(Cuenta, { as: 'cuentaOrigen',  foreignKey: 'cuenta_origen_id' });
Transaccion.belongsTo(Cuenta, { as: 'cuentaDestino', foreignKey: 'cuenta_destino_id' });

AuditoriaSaldo.belongsTo(Cuenta, { foreignKey: 'cuenta_id' });

module.exports = { sequelize, Rol, Cliente, Usuario, Cuenta, Transaccion, AuditoriaSaldo };
