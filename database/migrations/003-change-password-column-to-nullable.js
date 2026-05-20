'use strict';
const { QueryInterface, DataTypes } = require('sequelize');

module.exports = {
  async up(queryInterface) {
    await queryInterface.changeColumn(
      'admins',
      'password',
      {
        type: DataTypes.STRING(1000),
        allowNull: true,
      },
    );
  },

  async down(queryInterface) {
    await queryInterface.changeColumn(
      'admins',
      'password',
      {
        type: DataTypes.STRING(1000),
        allowNull: false,
      },
    );
  },
};