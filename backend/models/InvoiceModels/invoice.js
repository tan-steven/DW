'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Invoice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Invoice.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    quote_no:{
      unique: true,
      type: DataTypes.INTEGER,
    },
    date: DataTypes.DATE,
    customer: DataTypes.STRING,
    sub_total: DataTypes.DECIMAL,
    total: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'Invoice',
    tableName: 'invoice',
    timestamps: false
  });
  return Invoice;
};