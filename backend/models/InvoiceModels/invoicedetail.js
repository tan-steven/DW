'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class InvoiceDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  InvoiceDetail.init({
    invoice_id: DataTypes.INTEGER,
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
    price: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'InvoiceDetail',
    tableName: 'invoiceDetails',
    timestamps: false
  });
  return InvoiceDetail;
};