    'use strict';
    /** @type {import('sequelize-cli').Migration} */
    module.exports = {
      async up(queryInterface, Sequelize) {
        await queryInterface.createTable('emp_role_assignments', {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
          role_id: {
            type: Sequelize.STRING
          },
          emp_id: {
            type: Sequelize.STRING
          },
          emp_dept: {
            type: Sequelize.STRING
          },
          emp_designation: {
            type: Sequelize.STRING
          },
          status: {
            type: Sequelize.STRING
          },
            : {
    type: Sequelize.STRING,
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
        await queryInterface.dropTable('emp_role_assignments');
      }
    };  