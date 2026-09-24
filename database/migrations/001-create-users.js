const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('users', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },

      emailVerifiedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      phoneNo: {
        type: DataTypes.STRING(30),
        allowNull: true,
        unique: true,
      },

      phoneNoVerifiedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      password: {
        type: DataTypes.STRING(1000),
        allowNull: false,
      },

      role: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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

    await queryInterface.sequelize.query(`
      ALTER TABLE "users"
      ADD CONSTRAINT "users_email_or_phone_required"
      CHECK ("email" IS NOT NULL OR "phoneNo" IS NOT NULL);
    `);

    await queryInterface.addIndex('users', ['email']);
    await queryInterface.addIndex('users', ['phoneNo']);
    await queryInterface.addIndex('users', ['role']);

  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE "users"
      DROP CONSTRAINT IF EXISTS "users_email_or_phone_required";
    `);

    await queryInterface.dropTable('users');
  },
};