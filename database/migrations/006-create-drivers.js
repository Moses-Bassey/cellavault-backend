const { QueryInterface, DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('drivers', {
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
        type: DataTypes.STRING(300),
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      gender: {
        type: DataTypes.ENUM('MALE', 'FEMALE', 'OTHER'),
        allowNull: false,
      },
      kycCompleted: {
        type: DataTypes.ENUM('PERSONAL_INFORMATION', 'IDENTITY_INFORMATION', 'RESIDENTIAL_INFORMATION', 'ALL_COMPLETED', 'NOT_COMPLETED'),
        allowNull: false,
        defaultValue: 'NOT_COMPLETED',
      },
      userType: {
        type: DataTypes.ENUM('USER', 'DRIVER', 'PEPP_ADMIN', 'SUPER_ADMIN'),
        allowNull: false,
        defaultValue: 'DRIVER',
      },
      password: {
        type: DataTypes.STRING(2000),
        allowNull: false,
      },
      profileImageUrl: {
        type: DataTypes.STRING(1000),
        allowNull: true,
      },
      driverShift: {
        type: DataTypes.ENUM('DAY', 'NIGHT', 'NO_SHIFT'),
        allowNull: false,
        defaultValue: 'NO_SHIFT',
      },
      loginType: {
        type: DataTypes.ENUM('NORMAL', 'GOOGLE', 'APPLE'),
        allowNull: false,
      },
      isEmailVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isPhoneVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      verificationStatus: {
        type: DataTypes.ENUM('PENDING', 'IN_PROGRESS', 'VERIFIED', 'REJECTED'),
        allowNull: false,
        defaultValue: 'PENDING',
      },
      latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: true,
      },
      longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: true,
      },
      isAvailable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isPeppcruiseDriver: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      countryId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'countries',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      accountNo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bankName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      accountName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    });

    // Add indexes for better query performance
    await queryInterface.addIndex('drivers', ['countryId']);
    await queryInterface.addIndex('drivers', ['verificationStatus']);
    await queryInterface.addIndex('drivers', ['isAvailable']);
    await queryInterface.addIndex('drivers', ['isActive']);
    await queryInterface.addIndex('drivers', ['driverShift']);
    await queryInterface.addIndex('drivers', ['isPeppcruiseDriver']);
    await queryInterface.addIndex('drivers', ['userType']);
    // Composite index for common queries
    await queryInterface.addIndex('drivers', ['isAvailable', 'isActive', 'verificationStatus']);
    await queryInterface.addIndex('drivers', ['driverShift', 'isAvailable']);
    await queryInterface.addIndex('drivers', ['countryId', 'isAvailable']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('drivers');
  },
};
