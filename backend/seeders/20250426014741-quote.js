'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('quotes',[
      {
        id: 5020025,
        date: '02/05/2025',
        customer: 'Barnes & Anson Construction',
        total: 125.03,
        sub_total: 1178.39
      },
      {
        id: 5020026,
        date: '02/05/2025',
        customer: 'Barnes & Anson Construction',
        total: 125.03,
        sub_total: 1178.39
      },
      {
        id: 5020027,
        date: '02/05/2025',
        customer: 'Barnes & Anson Construction',
        total: 125.03,
        sub_total: 1178.39
      },
      {
        id: 5020028,
        date: '02/05/2025',
        customer: 'Barnes & Anson Construction',
        total: 125.03,
        sub_total: 1178.39
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('quotes', null, {});
  }
};
