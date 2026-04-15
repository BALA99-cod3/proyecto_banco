const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD, // 👈 IMPORTANTE
  {
    host: process.env.DB_HOST,
    port: 5432, // 👈 PostgreSQL
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    define: { timestamps: false },
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }
  }
);

module.exports = sequelize;