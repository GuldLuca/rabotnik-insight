'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("projects", [{
      titel: "Ny Hjemmeside",
      description: "Der skal laves en ny wordpress i Gutenberg",
      price: "300000",
      deadline: "03-03-21",
      createdAt: "02-02-19",
      updatedAt: "03-03-19",
      clientId: "1"
    },
    {
      titel: "Longread",
      price: "30000",
      description: "Longread til fagbladets Drupal",
      deadline: "05-05-21",
      createdAt: "02-02-19",
      updatedAt: "03-03-19",
      clientId: "2"
    }
  ]);
    
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("projects", null, {});
  }
};