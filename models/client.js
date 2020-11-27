const Sequelize = require("sequelize");
const DB = require("./database");

//Defining User table in database
const Client = DB.define("client", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING
  },
  cvr:{
    type: Sequelize.STRING
  },
  email:{
    type: Sequelize.STRING,
    allowNull: false
  },
  phone: {
    type: Sequelize.STRING,
    allowNull: false
  },
  contact: {
      type: Sequelize.STRING
  }
});

module.exports = Client;