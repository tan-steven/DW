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
    product_type: DataTypes.STRING,
    CL: DataTypes.STRING,
    unit: DataTypes.INTEGER,
    width: DataTypes.DOUBLE,
    height: DataTypes.DOUBLE,
    at: DataTypes.INTEGER,
    GL: DataTypes.STRING,
    GRD: DataTypes.BOOLEAN,
    SC: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'OrderDetail',
    tableName: 'order_details',
    timestamps: false,
  });
  return OrderDetail;
};