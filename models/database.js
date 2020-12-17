const Sequelize = require("sequelize");
const fs = require("fs");
const rawPass = require("../variables/db-pass.json");

const sequelize = new Sequelize("rabotnik-insight", "root", rawPass.home.password, {
  dialect: "mysql",
  host: "localhost"
});

module.exports = sequelize;