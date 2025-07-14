'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('order_details', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      order_id: {
        type: Sequelize.BIGINT,
        references:{
          model: 'orders',
          key: 'quote_no',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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
    await queryInterface.dropTable('order_details');
  }
};