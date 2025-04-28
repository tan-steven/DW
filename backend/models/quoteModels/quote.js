'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Quote extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Quote.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    customer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    total: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    sub_total: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    material:{
      type: DataTypes.STRING,
    },
    product_type:{
      type: DataTypes.STRING,
    },
    CL:{
      type: DataTypes.STRING,
    },
    unit:{
      type: DataTypes.INTEGER,
    },
    width:{
      type: DataTypes.DOUBLE,
    },
    height:{
      type: DataTypes.DOUBLE,
    },
    at:{
      type: DataTypes.INTEGER,
    },
    GL:{
      type: DataTypes.STRING,
    },
    GRD:{
      type: DataTypes.BOOLEAN,
    },
    SC:{
      type: DataTypes.STRING,
    },
    status:{
      type:DataTypes.STRING,
    },
  }, {
    sequelize,
    modelName: 'Quote',
    tableName: 'quotes',
    timestamps: false
  });
  return Quote;
};