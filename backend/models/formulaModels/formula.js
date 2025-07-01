'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Formula extends Model {
    static associate(models) {}
  }
  Formula.init({
    name: DataTypes.STRING,
    material: DataTypes.STRING,
    product_type: DataTypes.STRING,
    CL: DataTypes.STRING,
    unit: DataTypes.INTEGER,
    width: DataTypes.DOUBLE,
    height: DataTypes.DOUBLE,
    at: DataTypes.INTEGER,
    GL: DataTypes.STRING,
    GRD: DataTypes.BOOLEAN,
    SC: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Formula',
    tableName: 'formulas',
    timestamps: false,
  });
  return Formula;
};
