'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  OrderDetail.init({
    order_id: DataTypes.INTEGER,
    material: DataTypes.STRING,
    product_line: DataTypes.STRING,
    product_type: DataTypes.STRING,
    CL: DataTypes.STRING,
    width: DataTypes.DOUBLE,
    height: DataTypes.DOUBLE,
    GL: DataTypes.STRING,
    GRD: DataTypes.STRING,
    SC: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    price: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'OrderDetail',
    tableName: 'order_details',
    timestamps: false,
  });
  return OrderDetail;
};