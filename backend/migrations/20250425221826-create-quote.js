'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('quotes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
      material:{
        type: Sequelize.STRING,
      },
      product_type:{
        type: Sequelize.STRING,
      },
      CL:{
        type: Sequelize.STRING,
      },
      unit:{
        type: Sequelize.INTEGER,
      },
      width:{
        type: Sequelize.DOUBLE,
      },
      height:{
        type: Sequelize.DOUBLE,
      },
      at:{
        type: Sequelize.INTEGER,
      },
      GL:{
        type: Sequelize.STRING,
      },
      GRD:{
        type: Sequelize.BOOLEAN,
      },
      SC:{
        type: Sequelize.STRING,
      },
      status:{
        type:Sequelize.STRING,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('quotes');
  }
};