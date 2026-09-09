const { QueryInterface, DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('students', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      phone: {
        type: DataTypes.STRING(100),
        allowNull: true, // Marked as optional on whiteboard
      },
      guardianPhoneOrEmail: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING(1000),
        allowNull: false,
      },
      gender: {
        type: DataTypes.STRING(50),
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

    await queryInterface.addIndex('students', ['email', 'name']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('students');
  },
};
