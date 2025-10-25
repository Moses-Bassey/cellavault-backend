const { QueryInterface, DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('users', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      fullName: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      phoneNo: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(1000),
        allowNull: false,
      },
      userType: {
        type: DataTypes.ENUM('SUPER_ADMIN', 'PEPP_ADMIN', 'USER'),
        allowNull: false,
      },
      loginType: {
        type: DataTypes.ENUM('NORMAL', 'GOOGLE', 'APPLE'),
        allowNull: true,
      },
      isEmailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      isPhoneVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      countryId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'countries',
          key: 'id',
        },
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

    await queryInterface.addIndex('users', ['fullName']);
    await queryInterface.addIndex('users', ['email']);
    await queryInterface.addIndex('users', ['phoneNo']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('users');
  },
};
