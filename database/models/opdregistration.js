'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OPDRegistration extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  OPDRegistration.init({
    firstName: {
          type: DataTypes.STRING,
        },
    lastName: {
          type: DataTypes.STRING,
        },
    age: {
          type: DataTypes.INTEGER,
        },
    gender: {
          type: DataTypes.STRING,
        },
    phone: {
          type: DataTypes.STRING,
        },
    email: {
          type: DataTypes.STRING,
        },
    address: {
          type: DataTypes.TEXT,
        },
    department: {
          type: DataTypes.STRING,
        },
    doctor: {
          type: DataTypes.STRING,
        },
    appointmentDate: {
          type: DataTypes.DATE,
        },
    symptoms: {
          type: DataTypes.TEXT,
        }
  }, {
    sequelize,
    modelName: 'OPDRegistration',
       tableName: "tbl_opdregistrations",
    paranoid: true,

  });
  return OPDRegistration;
};