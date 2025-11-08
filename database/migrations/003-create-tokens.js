const { QueryInterface, DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('tokens', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      subject: {
        type: DataTypes.ENUM('PASSWORD_RESET', 'SIGN_UP_PHONE', 'SIGN_UP_EMAIL', 'NEW_DEVICE_LOGIN_OTP', 'RESET_PASSCODE'),
        allowNull: false,
      },
      token: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isEmail: true,
        },
      },
      phoneNo: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      tokenType: {
        type: DataTypes.ENUM('OTP', 'JWT', 'REFRESH'),
        allowNull: false,
      },
      expiry: {
        type: DataTypes.DATE,
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
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('tokens');
  },
};
