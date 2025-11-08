const { QueryInterface, DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('passcodes', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      userType: {
        type: DataTypes.ENUM('SUPER_ADMIN', 'PEPP_ADMIN', 'USER', 'DRIVER'),
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING(1000),
        allowNull: false,
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

    // Add indexes for better performance
    await queryInterface.addIndex('passcodes', ['userId', 'userType']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('passcodes');
  },
};

