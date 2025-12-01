const { QueryInterface, DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.addColumn(
      'driver_kyc_3_residential_information',
      'streetAddress',
      {
        type: DataTypes.STRING(500),
        allowNull: true,
      }
    );

    await queryInterface.addColumn(
      'driver_kyc_3_residential_information',
      'landmark',
      {
        type: DataTypes.STRING(255),
        allowNull: true,
      }
    );

    await queryInterface.addColumn(
      'driver_kyc_3_residential_information',
      'postalOrZipCode',
      {
        type: DataTypes.STRING(20),
        allowNull: true,
      }
    );

    await queryInterface.addColumn(
      'driver_kyc_3_residential_information',
      'proofOfAddressType',
      {
        type: DataTypes.ENUM(
          'UTILITY_BILL',
          'BANK_STATEMENT',
          'RENTAL_AGREEMENT',
          'GOVERNMENT_LETTER',
          'TAX_DOCUMENT',
          'INSURANCE_DOCUMENT',
          'OTHER'
        ),
        allowNull: true,
      }
    );

    await queryInterface.addColumn(
      'driver_kyc_3_residential_information',
      'proofOfAddressImage',
      {
        type: DataTypes.STRING(1000),
        allowNull: true,
      }
    );
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn(
      'driver_kyc_3_residential_information',
      'streetAddress'
    );
    await queryInterface.removeColumn(
      'driver_kyc_3_residential_information',
      'landmark'
    );
    await queryInterface.removeColumn(
      'driver_kyc_3_residential_information',
      'postalOrZipCode'
    );
    await queryInterface.removeColumn(
      'driver_kyc_3_residential_information',
      'proofOfAddressType'
    );
    await queryInterface.removeColumn(
      'driver_kyc_3_residential_information',
      'proofOfAddressImage'
    );
  },
};


