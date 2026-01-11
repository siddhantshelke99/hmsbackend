'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PatientRegistration extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PatientRegistration.init({
    patientId: {
          type: DataTypes.STRING,
        },
    firstName: {
          type: DataTypes.STRING,
        },
    middleName: {
          type: DataTypes.STRING,
        },
    lastName: {
          type: DataTypes.STRING,
        },
    dateOfBirth: {
          type: DataTypes.DATE,
        },
    gender: {
          type: DataTypes.STRING,
        },
    bloodGroup: {
          type: DataTypes.STRING,
        },
    mobileNumber: {
          type: DataTypes.STRING,
        },
    alternateNumber: {
          type: DataTypes.STRING,
        },
    email: {
          type: DataTypes.STRING,
        },
    address: {
          type: DataTypes.TEXT,
        },
    city: {
          type: DataTypes.STRING,
        },
    state: {
          type: DataTypes.STRING,
        },
    pincode: {
          type: DataTypes.STRING,
        },
    aadharNumber: {
          type: DataTypes.STRING,
        },
    emergencyContactName: {
          type: DataTypes.STRING,
        },
    emergencyContactNumber: {
          type: DataTypes.STRING,
        },
    emergencyContactRelation: {
          type: DataTypes.STRING,
        },
    allergies: {
          type: DataTypes.JSON,
        },
    chronicConditions: {
          type: DataTypes.JSON,
        },
    currentMedications: {
          type: DataTypes.JSON,
        },
    remarks: {
          type: DataTypes.TEXT,
        },
    photofileName: {
          type: DataTypes.STRING,
        },
    photofilePath: {
          type: DataTypes.STRING,
        },
    aadharfileName: {
          type: DataTypes.STRING,
        },
    aadharfilePath: {
          type: DataTypes.STRING,
        },
        deletedAt: {
          type: DataTypes.DATE,
          allowNull:true,
        }
  }, {
    sequelize,
    tableName: 'tbl_patientRegistrations',
    paranoid: true,
    modelName: 'PatientRegistration',
  });
  return PatientRegistration;
};