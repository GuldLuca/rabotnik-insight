const Sequelize = require("sequelize");
const DB = require("./database");

//Defining Project table in database
const Project = DB.define("project", {
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
  price:{
    type: Sequelize.INTEGER
  },
  deadline: {
    type: Sequelize.DATE
  }
});

module.exports = Project;