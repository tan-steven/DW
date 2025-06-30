'use strict';

const { sequelize } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('deliveries', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      invoice_no: {
        type: Sequelize.STRING
      },
      customer:{
        type: Sequelize.STRING
      },
      total: {
        type: Sequelize.DOUBLE
      },
      sub_total: {
        type: Sequelize.DOUBLE
      },
      delivery_date: {
        type: Sequelize.DATE
      }
    });
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.dropTable('deliveries');
  }
};
