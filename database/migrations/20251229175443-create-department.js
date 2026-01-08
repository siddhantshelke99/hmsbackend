'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Departments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      deptName: {
        type: Sequelize.STRING
      },
      deptCode: {
        type: Sequelize.STRING
      },
      hodName: {
        type: Sequelize.STRING
      },
      hodContact: {
        type: Sequelize.STRING
      },
      hodEmail: {
        type: Sequelize.STRING
      },
      deptType: {
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
    await queryInterface.dropTable('Departments');
  }
};