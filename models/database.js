const Sequelize = require('sequelize');

const sequelize = new Sequelize('rabotnik-insight', 'root', '32Ankler', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;