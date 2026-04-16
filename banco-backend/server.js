sequelize.authenticate()
  .then(() => {
    console.log('✅ Conectado a PostgreSQL');
    return sequelize.sync({ force: true });
  })
  .then(async () => {
    const { Rol } = require('./src/models');

    // 🔥 Crear roles
    await Rol.findOrCreate({
      where: { id: 1 },
      defaults: {
        nombre: 'Admin',
        descripcion: 'Administrador'
      }
    });

    await Rol.findOrCreate({
      where: { id: 2 },
      defaults: {
        nombre: 'Cliente',
        descripcion: 'Usuario normal'
      }
    });

    console.log('✅ Roles creados');

    // 🚀 Iniciar servidor
    app.listen(PORT, () =>
      console.log(`🚀 Servidor en http://localhost:${PORT}`)
    );
  })
  .catch(err => {
    console.error('❌ Error al conectar BD:', err.message);
    process.exit(1);
  });