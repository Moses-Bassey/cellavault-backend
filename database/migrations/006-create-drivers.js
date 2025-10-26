'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('drivers', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      fullName: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      phoneNo: {
        type: Sequelize.STRING(15),
        allowNull: false,
        unique: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      userType: {
        type: Sequelize.ENUM('USER', 'DRIVER', 'PEPP_ADMIN', 'SUPER_ADMIN'),
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING(1000),
        allowNull: true,
      },
      loginType: {
        type: Sequelize.ENUM('NORMAL', 'GOOGLE', 'APPLE'),
        allowNull: false,
      },
      isEmailVerified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isPhoneVerified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      isVerified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      verificationStatus: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      licenseNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      vehicleModel: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      vehicleColor: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      vehiclePlateNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      vehicleYear: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      vehicleType: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      latitude: {
        type: Sequelize.DECIMAL(10, 8),
        allowNull: true,
      },
      longitude: {
        type: Sequelize.DECIMAL(11, 8),
        allowNull: true,
      },
      isAvailable: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      rating: {
        type: Sequelize.DECIMAL(3, 2),
        allowNull: true,
      },
      totalTrips: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      countryId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'countries',
          key: 'id',
        },
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('drivers');
  },
};

