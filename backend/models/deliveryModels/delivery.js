'use strict';
module.exports = (sequelize, DataTypes) => {
  const Delivery = sequelize.define('Delivery', {
    invoice_no: DataTypes.STRING,
    customer: DataTypes.STRING,
    total: DataTypes.DOUBLE,
    sub_total: DataTypes.DOUBLE,
    delivery_date: DataTypes.DATE,
  }, {
    tableName: 'deliveries',
    modelName: 'Delivery',
    timestamps: false,
  });
  return Delivery;
};
