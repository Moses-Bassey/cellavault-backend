'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('guarantors', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      driverId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'drivers',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      fullName: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      phoneNo: {
        type: Sequelize.STRING(15),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      relationship: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      occupation: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      homeAddress: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      workAddress: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      identificationType: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      identificationNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      additionalInfo: {
        type: Sequelize.TEXT,
        allowNull: true,
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

    // Add constraint to ensure max 3 guarantors per driver
    // Note: This constraint is enforced at application level
    // MySQL doesn't support partial unique constraints easily
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('guarantors');
  },
};

