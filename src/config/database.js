const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, 
    },
  },
});

sequelize.authenticate()
.then(() => {
  console.log('Conexión a la base de datos establecida correctamente.');
})
.catch(err => {
    console.error('No se pudo conectar a la base de datos:', err);
})
 
sequelize.sync({ force: true }).then(() => {
  console.log('🔁 Tablas recreadas desde los modelos.');

module.exports = sequelize;
