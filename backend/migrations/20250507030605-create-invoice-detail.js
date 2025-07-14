'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('invoiceDetails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      invoice_id: {
        type: Sequelize.BIGINT,
        references:{
          model: 'invoice',
          key: 'quote_no',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      material: {
        type: Sequelize.STRING
      },
      product_line: {
        type: Sequelize.STRING
      },
      product_type: {
        type: Sequelize.STRING
      },
      CL: {
        type: Sequelize.STRING
      },
      width: {
        type: Sequelize.DOUBLE
      },
      height: {
        type: Sequelize.DOUBLE
      },
      GL: {
        type: Sequelize.STRING
      },
      GRD: {
        type: Sequelize.STRING
      },
      SC: {
        type: Sequelize.STRING
      },
      quantity: {
        type: Sequelize.INTEGER
      },
      price: {
        type: Sequelize.DOUBLE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('invoiceDetails');
  }
};