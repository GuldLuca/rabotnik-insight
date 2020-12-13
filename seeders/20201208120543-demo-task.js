'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("tasks", [{
      title: "Send mail",
      description: "Der skal sendes en mail med status",
      done: "1",
      time: "1",
      createdAt: "02-02-19",
      updatedAt: "03-03-19",
      projectId: "2"
    },
    {
      title: "Udviklingsmiljø ",
      description: "Der sættes et udviklingsmiljø op til Luca og Adrian",
      done: "0",
      time: "3",
      createdAt: "02-02-19",
      updatedAt: "03-03-19",
      projectId: "1"
    }
  ]);
    
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("tasks", null, {});
  }
};