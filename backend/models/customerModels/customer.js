'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Customer.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    email: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Customer',
    tableName: 'Customers',
    timestamps: false,
  });
  return Customer;
};