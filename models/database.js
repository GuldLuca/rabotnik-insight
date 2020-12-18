const Sequelize = require("sequelize");

//DB password
const rawPass = require("../variables/db-pass.json");

//Setting up database with sequelize and mysql
const sequelize = new Sequelize("rabotnik-insight", "root", rawPass.home.password, {
  dialect: "mysql",
  host: "localhost"
});

module.exports = sequelize;