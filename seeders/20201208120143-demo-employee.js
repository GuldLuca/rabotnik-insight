'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("employees", [{
      firstName: "Luca",
      lastName: "Bastholm",
      email: "bastholm.luca@gmail.com",
      password: "hejhejhej",
      createdAt: "02-02-19",
      updatedAt: "03-03-19"
    },
    {
      firstName: "Rune",
      lastName: "Bødker",
      email: "rb@rabotnik.coop",
      password: "nejnejnej",
      createdAt: "02-02-19",
      updatedAt: "03-03-19"
    }
  ]);
    
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("employees", null, {});
  }
};