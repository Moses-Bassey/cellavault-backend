'use strict';
const { QueryInterface, DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('coins', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      passengerId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      delta: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        // defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        // defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Index for your repository query: WHERE passengerId AND createdAt range
    await queryInterface.addIndex('coins', ['passengerId', 'createdAt'], {
      name: 'idx_coins_passenger_createdAt',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('coins');
  },
};
