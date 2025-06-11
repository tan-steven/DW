'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('invoice', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      quote_no: {
        type: Sequelize.BIGINT
      },
      date: {
        type: Sequelize.DATE
      },
      customer: {
        type: Sequelize.STRING
      },
      sub_total: {
        type: Sequelize.DECIMAL
      },
      total: {
        type: Sequelize.DECIMAL
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('invoice');
  }
};