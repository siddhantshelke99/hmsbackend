'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
      // define association here
    }
  }
  Employee.init({
    name: {
      type: DataTypes.STRING,
    },
    empId: {
    type: DataTypes.STRING,
  },
    email: {
      type: DataTypes.STRING,
    },
    department: {
      type: DataTypes.STRING,
    },
    position: {
      type: DataTypes.STRING,
    },
    joinDate: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    salary: {
      type: DataTypes.STRING,
    },
    manager: {
      type: DataTypes.STRING,
    },
    
  }, {
    sequelize,
    modelName: 'Employee',
      tableName: "tbl_employees",
      paranoid: true,
  });
  return Employee;
};