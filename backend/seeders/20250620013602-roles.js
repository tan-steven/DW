// seeders/20250617-seed-roles.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Roles', [
      { name: 'admin', createdAt: new Date(), updatedAt: new Date() },
      { name: 'quote', createdAt: new Date(), updatedAt: new Date() },
      { name: 'invoice', createdAt: new Date(), updatedAt: new Date() },
      { name: 'order', createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Roles', null, {});
  }
};
