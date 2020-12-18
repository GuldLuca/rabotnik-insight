const Sequelize = require("sequelize");
const DB = require("./database");

//Defining employee table in database with attributes
const Employee = DB.define("employee", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  firstName: {
    type: Sequelize.STRING
  },
  lastName:{
    type: Sequelize.STRING
  },
  email:{
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Employee;