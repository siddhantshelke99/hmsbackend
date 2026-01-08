'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class emp_role_assignment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  emp_role_assignment.init({
    role_id: {
      type: DataTypes.STRING,
    },
    emp_id:  {
      type: DataTypes.STRING,
    },
    emp_dept:  {
      type: DataTypes.STRING,
    },
    emp_designation:  {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
    },
    user_code: {
    type: DataTypes.STRING,
  },
  }, {
    sequelize,
    modelName: 'emp_role_assignment',
    tableName: "tbl_emp_role_assignment",
    paranoid: true,
  });
  return emp_role_assignment;
};