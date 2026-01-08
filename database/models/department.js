'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Department extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Department.init({
    deptName: {
          type: DataTypes.STRING,
        },
    deptCode: {
          type: DataTypes.STRING,
        },
    hodName: {
          type: DataTypes.STRING,
        },
    hodContact: {
          type: DataTypes.STRING,
        },
    hodEmail: {
          type: DataTypes.STRING,
        },
    deptType: {
          type: DataTypes.STRING,
        }
  }, {
    sequelize,
    modelName: 'Department',
        tableName: "tbl_departments",
    paranoid: true,

  });
  return Department;
};