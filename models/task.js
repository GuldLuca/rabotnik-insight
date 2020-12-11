const Sequelize = require("sequelize");
const DB = require("./database");

//Defining Project table in database
const Task = DB.define("task", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  titel: {
    type: Sequelize.STRING
  },
  description:{
    type: Sequelize.STRING
  },
  done:{
    type: Sequelize.BOOLEAN
  },
  time:{
    type: Sequelize.DOUBLE
  }
});

module.exports = Task;