// models/userrole.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserRoles extends Model {
    static associate(models) {}
  }
  UserRoles.init({}, {
    sequelize,
    modelName: 'UserRoles',
    tableName: 'UserRoles'
  });
  return UserRoles;
};
