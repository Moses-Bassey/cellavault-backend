const { QueryInterface, DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('vehicle_registrations', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      driverId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'drivers',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
      vinNumber: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      registerationExpiryDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      plateNumberUrl: {
        type: DataTypes.STRING(1000),
        allowNull: true,
      },
      plateNo: {
        type: DataTypes.STRING(50),
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

    // Add index on driverId for better query performance
    await queryInterface.addIndex('vehicle_registrations', ['driverId']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('vehicle_registrations');
  },
};

