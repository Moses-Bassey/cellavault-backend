const { QueryInterface, DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('cng_conversions', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      fullName: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      contactPhone: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
      nin: {
        type: DataTypes.STRING(11),
        allowNull: false,
      },
      vehicleRegisterationNo: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      brandOfVehicle: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      color: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      makeOfVehicle: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      yearOfManufacture: {
        type: DataTypes.STRING(4),
        allowNull: false,
      },
      vinNumber: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      registerationExpiryDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      engineCapacity: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      cylinder: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      engineCondition: {
        type: DataTypes.ENUM('EXCELLENT', 'GOOD', 'FAIR', 'POOR'),
        allowNull: false,
      },
      fuelType: {
        type: DataTypes.ENUM('PETROL', 'DIESEL', 'CNG', 'HYBRID', 'ELECTRIC'),
        allowNull: false,
      },
      transmission: {
        type: DataTypes.ENUM('MANUAL', 'AUTOMATIC'),
        allowNull: false,
      },
      mileage: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      usualRoute: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      operatingMotorPark: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      conversionCenter: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      residentialState: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      lga: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      additionalNote: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
        allowNull: false,
        defaultValue: 'PENDING',
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
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('cng_conversions');
  },
};


