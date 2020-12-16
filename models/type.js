const Sequelize = require("sequelize");
const DB = require("./database");

//Defining User table in database
const Type = DB.define("type", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING
  }
});

module.exports = Type;