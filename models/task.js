const Sequelize = require("sequelize");
const DB = require("./database");

//Defining task table in database with attributes
const Task = DB.define("task", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  title: {
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