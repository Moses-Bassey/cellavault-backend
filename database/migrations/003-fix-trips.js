const { QueryInterface, DataTypes } = require('sequelize');

module.exports = {
  async up(queryInterface) {
    /* -------------------------------------------------------------------------- */
    /*                    REMOVE OLD/OBSOLETE COLUMNS                             */
    /* -------------------------------------------------------------------------- */

    await queryInterface.removeColumn(
      'trips',
      'vehicleRegistrationId',
    );

    await queryInterface.removeColumn(
      'trips',
      'cancellationStatus',
    );

    /* -------------------------------------------------------------------------- */
    /*                    RENAME arrivalTime -> driverArrivalTime                 */
    /* -------------------------------------------------------------------------- */

    await queryInterface.renameColumn(
      'trips',
      'arrivalTime',
      'driverArrivalTime',
    );

    /* -------------------------------------------------------------------------- */
    /*                         ADD MISSING COLUMNS                                */
    /* -------------------------------------------------------------------------- */

    await queryInterface.addColumn('trips', 'paymentStatus', {
      type: DataTypes.ENUM('UNPAID', 'PAID'),
      allowNull: false,
      defaultValue: 'UNPAID',
    });

    await queryInterface.addColumn('trips', 'stopLocation', {
      type: DataTypes.STRING(1000),
      allowNull: true,
    });

    await queryInterface.addColumn('trips', 'stopLongitude', {
      type: DataTypes.STRING(1000),
      allowNull: true,
    });

    await queryInterface.addColumn('trips', 'stopLatitude', {
      type: DataTypes.STRING(1000),
      allowNull: true,
    });

    await queryInterface.addColumn('trips', 'distanceToPickup', {
      type: DataTypes.STRING(20),
      allowNull: true,
    });

    await queryInterface.addColumn('trips', 'distanceCovered', {
      type: DataTypes.STRING(20),
      allowNull: true,
    });

    await queryInterface.addColumn('trips', 'stopCompletedTime', {
      type: DataTypes.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('trips', 'tax', {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    });

    /* -------------------------------------------------------------------------- */
    /*                       UPDATE paymentType ENUM                              */
    /* -------------------------------------------------------------------------- */

    await queryInterface.sequelize.query(`
      ALTER TABLE trips
      MODIFY COLUMN paymentType ENUM(
        'PEPP_COIN',
        'CASH',
        'PI_COIN',
        'CARD',
        'WALLET',
        'BANK_TRANSFER'
      ) DEFAULT 'CASH';
    `);

    /* -------------------------------------------------------------------------- */
    /*                    MIGRATE EXISTING STATUS VALUES                          */
    /* -------------------------------------------------------------------------- */

    await queryInterface.sequelize.query(`
        UPDATE trips
        SET status =
            CASE
            WHEN status = 'PENDING' THEN 'TRIP_BOOKED'
            WHEN status = 'ASSIGNED' THEN 'TRIP_ASSIGNED'
            WHEN status = 'ARRIVED' THEN 'DRIVER_ARRIVED'
            WHEN status = 'ACCEPTED' THEN 'DRIVER_ACCEPTED'
            WHEN status = 'ON_THE_WAY' THEN 'TRIP_STARTED'
            WHEN status = 'COMPLETED' THEN 'TRIP_COMPLETED'
            WHEN status = 'CANCELLED' THEN 'TRIP_CANCELLED'
            ELSE status
            END;
    `);

    /* -------------------------------------------------------------------------- */
    /*                          UPDATE status ENUM                                */
    /* -------------------------------------------------------------------------- */

    await queryInterface.sequelize.query(`
      ALTER TABLE trips
      MODIFY COLUMN status ENUM(
        'TRIP_BOOKED',
        'TRIP_ASSIGNED',
        'DRIVER_ARRIVED',
        'DRIVER_ACCEPTED',
        'DRIVER_DECLINED',
        'TRIP_RE_ASSIGN',
        'TRIP_STARTED',
        'TRIP_COMPLETED',
        'TRIP_CANCELLED_BY_USER',
        'TRIP_CANCELLED_BY_DRIVER',
        'TRIP_CANCELLED',
        'SYSTEM_CANCELLED'
      ) NOT NULL;
    `);
  },

  async down(queryInterface) {
    /* -------------------------------------------------------------------------- */
    /*                        RE-ADD REMOVED COLUMNS                              */
    /* -------------------------------------------------------------------------- */

    await queryInterface.addColumn(
      'trips',
      'vehicleRegistrationId',
      {
        type: DataTypes.UUID,
        allowNull: true,
      },
    );

    await queryInterface.addColumn(
      'trips',
      'cancellationStatus',
      {
        type: DataTypes.ENUM(
          'USER_CANCELLED',
          'DRIVER_CANCELLED',
          'SYSTEM_CANCELLED',
        ),
        allowNull: true,
      },
    );

    /* -------------------------------------------------------------------------- */
    /*                 RENAME driverArrivalTime -> arrivalTime                    */
    /* -------------------------------------------------------------------------- */

    await queryInterface.renameColumn(
      'trips',
      'driverArrivalTime',
      'arrivalTime',
    );

    /* -------------------------------------------------------------------------- */
    /*                     REMOVE NEWLY ADDED COLUMNS                             */
    /* -------------------------------------------------------------------------- */

    await queryInterface.removeColumn('trips', 'paymentStatus');

    await queryInterface.removeColumn('trips', 'stopLocation');

    await queryInterface.removeColumn('trips', 'stopLongitude');

    await queryInterface.removeColumn('trips', 'stopLatitude');

    await queryInterface.removeColumn('trips', 'distanceToPickup');

    await queryInterface.removeColumn('trips', 'distanceCovered');

    await queryInterface.removeColumn('trips', 'stopCompletedTime');

    await queryInterface.removeColumn('trips', 'tax');

    /* -------------------------------------------------------------------------- */
    /*                      REVERT paymentType ENUM                               */
    /* -------------------------------------------------------------------------- */

    await queryInterface.sequelize.query(`
      ALTER TABLE trips
      MODIFY COLUMN paymentType ENUM(
        'PEPP_COIN',
        'CASH',
        'PI_COIN',
        'CARD',
        'WALLET'
      ) DEFAULT 'CASH';
    `);

    /* -------------------------------------------------------------------------- */
    /*                         REVERT status ENUM                                 */
    /* -------------------------------------------------------------------------- */

    await queryInterface.sequelize.query(`
      ALTER TABLE trips
      MODIFY COLUMN status ENUM(
        'PENDING',
        'ASSIGNED',
        'ACCEPTED',
        'COMPLETED',
        'CANCELLED',
        'ON_THE_WAY',
        'ARRIVED'
      ) NOT NULL DEFAULT 'PENDING';
    `);
  },
};