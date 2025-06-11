'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Order.init({
    quote_no: DataTypes.INTEGER,
    date: DataTypes.DATE,
    customer: DataTypes.STRING,
    sub_total: DataTypes.DECIMAL,
    total: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
    timestamps: false,
  });
  return Order;
};