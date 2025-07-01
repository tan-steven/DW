'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('formulas', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      name: Sequelize.STRING,
      material: Sequelize.STRING,
      product_type: Sequelize.STRING,
      CL: Sequelize.STRING,
      unit: Sequelize.INTEGER,
      width: Sequelize.DOUBLE,
      height: Sequelize.DOUBLE,
      at: Sequelize.INTEGER,
      GL: Sequelize.STRING,
      GRD: Sequelize.BOOLEAN,
      SC: Sequelize.STRING,
      quantity: Sequelize.INTEGER,
      price: Sequelize.INTEGER,
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('formulas');
  },
};
