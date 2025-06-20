'use strict';

const { faker } = require('@faker-js/faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const quotes = [];

  for (let i = 0; i < 100; i++) {
    const id = i + 2;
    const quote_no = 1000 + i;
    const date = faker.date.past();
    const customer = faker.person.fullName();  // ✅ FIXED HERE
    const sub_total = faker.number.int({ min: 100, max: 1000 });
    const total = sub_total + faker.number.int({ min: 10, max: 100 });

    quotes.push({
      id,
      quote_no,
      date,
      customer,
      total,
      sub_total,
    });
  }

    await queryInterface.bulkInsert('quotes', quotes, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('quotes', {
      id: {
        [Sequelize.Op.gte]: 2
      }
    }, {});
  }
};
