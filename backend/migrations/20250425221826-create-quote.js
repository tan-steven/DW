'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('quotes', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.BIGINT,
        autoIncrement:true,
      },
      quote_no:{
        unique: true,
        type: Sequelize.BIGINT,
      },
      date: {
        type: Sequelize.DATE
      },
      customer: {
        type: Sequelize.STRING
      },
      total: {
        type: Sequelize.DOUBLE
      },
      sub_total: {
        type: Sequelize.DOUBLE
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('quotes');
  }
};