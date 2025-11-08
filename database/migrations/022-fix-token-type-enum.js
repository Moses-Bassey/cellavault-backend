const { QueryInterface, DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    // Check if tokenType column exists and is not already an ENUM
    const [tokenTypeResults] = await queryInterface.sequelize.query(`
      SELECT COLUMN_TYPE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'tokens' 
      AND COLUMN_NAME = 'tokenType'
    `);

    if (tokenTypeResults.length > 0) {
      const columnType = tokenTypeResults[0].COLUMN_TYPE;
      
      // If it's not already an ENUM, convert it
      if (!columnType.includes('enum')) {
        // First, ensure all existing values are valid
        await queryInterface.sequelize.query(`
          UPDATE tokens 
          SET tokenType = 'OTP' 
          WHERE tokenType NOT IN ('OTP', 'JWT', 'REFRESH') OR tokenType IS NULL
        `);

        // Alter the column to ENUM type
        await queryInterface.sequelize.query(`
          ALTER TABLE tokens 
          MODIFY COLUMN tokenType ENUM('OTP', 'JWT', 'REFRESH') NOT NULL
        `);
      }
    }

    // Check if subject column exists and is not already an ENUM
    const [subjectResults] = await queryInterface.sequelize.query(`
      SELECT COLUMN_TYPE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'tokens' 
      AND COLUMN_NAME = 'subject'
    `);

    if (subjectResults.length > 0) {
      const columnType = subjectResults[0].COLUMN_TYPE;
      
      // If it's not already an ENUM, convert it
      if (!columnType.includes('enum')) {
        // First, ensure all existing values are valid (update any invalid values to a default)
        await queryInterface.sequelize.query(`
          UPDATE tokens 
          SET subject = 'PASSWORD_RESET' 
          WHERE subject NOT IN ('PASSWORD_RESET', 'SIGN_UP_PHONE', 'SIGN_UP_EMAIL', 'NEW_DEVICE_LOGIN_OTP', 'RESET_PASSCODE')
        `);

        // Alter the column to ENUM type
        await queryInterface.sequelize.query(`
          ALTER TABLE tokens 
          MODIFY COLUMN subject ENUM('PASSWORD_RESET', 'SIGN_UP_PHONE', 'SIGN_UP_EMAIL', 'NEW_DEVICE_LOGIN_OTP', 'RESET_PASSCODE') NOT NULL
        `);
      }
    }
  },

  down: async (queryInterface) => {
    // Revert: Change ENUMs back to STRING
    await queryInterface.sequelize.query(`
      ALTER TABLE tokens 
      MODIFY COLUMN tokenType VARCHAR(225) NOT NULL
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE tokens 
      MODIFY COLUMN subject VARCHAR(100) NOT NULL
    `);
  },
};

