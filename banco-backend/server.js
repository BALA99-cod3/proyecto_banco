require('dotenv').config();
const express = require('express');
const cors = require('cors');

// 👇 IMPORTANTE
const { sequelize, Rol } = require('./src/models');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', require('./src/routes/auth.routes'));
app.use('/api/clientes', require('./src/routes/clientes.routes'));
app.use('/api/cuentas', require('./src/routes/cuentas.routes'));
app.use('/api/transacciones', require('./src/routes/transacciones.routes'));

// Health check
app.get('/', (_req, res) => res.json({
  status: 'ok',
  message: 'Banco Avanzado API',
}));

// 🔥 CONEXIÓN + ROLES + SERVIDOR
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conectado a PostgreSQL');
    return sequelize.sync({ force: true });
  })
  .then(async () => {

    // 🔥 Crear roles
    await Rol.findOrCreate({
      where: { id: 1 },
      defaults: { nombre: 'Admin', descripcion: 'Administrador' }
    });

    await Rol.findOrCreate({
      where: { id: 2 },
      defaults: { nombre: 'Cliente', descripcion: 'Usuario normal' }
    });

    console.log('✅ Roles creados');

    app.listen(PORT, () =>
      console.log(`🚀 Servidor en puerto ${PORT}`)
    );
  })
  .catch(err => {
    console.error('❌ Error al conectar BD:', err.message);
    process.exit(1);
  });