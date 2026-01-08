'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Auth extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Auth.init({
    userId: {
      type: DataTypes.STRING,
    },
    user_name: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    code: {
      type: DataTypes.STRING,
    },
    user_code: {
      type: DataTypes.STRING,
    },
    is_employee: {
      type: DataTypes.STRING,
    }
    
  }, {
    sequelize,
    modelName: 'Auth',
    tableName: "tbl_auths",
    paranoid: true
  });
  return Auth;
};