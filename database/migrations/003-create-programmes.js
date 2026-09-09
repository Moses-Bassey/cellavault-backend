const { QueryInterface, DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('programmes', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      hours: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    });

    await queryInterface.addIndex('programmes', ['name']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('programmes');
  },
};
