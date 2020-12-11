'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("clients", [{
      name: "Arbejderen",
      cvr: "5544667788",
      email: "arbejderen@mail.com",
      phone: "33224455",
      contact: "Anders Sørensen",
      createdAt: "02-02-19",
      updatedAt: "03-03-19"
    },
    {
      name: "Fagbladet 3F",
      cvr: "0099227744",
      email: "fagbladet@mail.com",
      phone: "11887755",
      contact: "Relevant Medarbejder",
      createdAt: "02-02-19",
      updatedAt: "03-03-19"
    }
  ]);
    
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("clients", null, {});
  }
};