const { QueryInterface, DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('guarantors', {
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
        validate: {
          isEmail: true,
        },
      },
      identificationImageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      utilityBillImageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      policeClearanceImageUrl: {
        type: DataTypes.STRING,
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

    // Add index on driverId for better query performance
    await queryInterface.addIndex('guarantors', ['driverId']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('guarantors');
  },
};

