require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./src/models');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de la API
app.use('/api/auth',          require('./src/routes/auth.routes'));
app.use('/api/clientes',      require('./src/routes/clientes.routes'));
app.use('/api/cuentas',       require('./src/routes/cuentas.routes'));
app.use('/api/transacciones', require('./src/routes/transacciones.routes'));

// Health check
app.get('/', (_req, res) => res.json({
  status: 'ok',
  message: 'Banco Avanzado API v1.0',
  timestamp: new Date().toISOString()
}));

// Manejador de rutas no encontradas
app.use((_req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

// Manejador global de errores
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Arrancar servidor
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conectado a PostgreSQL');
    // alter:false para no modificar tablas existentes; cambia a true solo en dev
    return sequelize.sync({ force: true });
  })
  .then(() => {
    app.listen(PORT, () =>
      console.log(`🚀 Servidor en http://localhost:${PORT}`)
    );
  })
  .catch(err => {
    console.error('❌ Error al conectar BD:', err.message);
    process.exit(1);
  });
