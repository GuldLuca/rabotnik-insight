const Sequelize = require('sequelize');

const sequelize = new Sequelize('rabotnik-insight', 'root', 'password', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;