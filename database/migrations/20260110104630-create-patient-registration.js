'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PatientRegistrations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      patientId: {
        type: Sequelize.STRING
      },
      firstName: {
        type: Sequelize.STRING
      },
      middleName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      dateOfBirth: {
        type: Sequelize.DATE
      },
      gender: {
        type: Sequelize.STRING
      },
      bloodGroup: {
        type: Sequelize.STRING
      },
      mobileNumber: {
        type: Sequelize.STRING
      },
      alternateNumber: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.TEXT
      },
      city: {
        type: Sequelize.STRING
      },
      state: {
        type: Sequelize.STRING
      },
      pincode: {
        type: Sequelize.STRING
      },
      aadharNumber: {
        type: Sequelize.STRING
      },
      emergencyContactName: {
        type: Sequelize.JSON
      },
      emergencyContactNumber: {
        type: Sequelize.JSON
      },
      emergencyContactRelation: {
        type: Sequelize.JSON
      },
      allergies: {
        type: Sequelize.TEXT
      },
      chronicConditions: {
        type: Sequelize.TEXT
      },
      currentMedications: {
        type: Sequelize.TEXT
      },
      remarks: {
        type: Sequelize.TEXT
      },
      photofileName: {
        type: Sequelize.STRING
      },
      photofilePath: {
        type: Sequelize.STRING
      },
      aadharfileName: {
        type: Sequelize.STRING
      },
      aadharfilePath: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PatientRegistrations');
  }
};