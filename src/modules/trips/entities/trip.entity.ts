import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  Default,
  AllowNull,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from 'sequelize-typescript';
import { User } from '../../users/entities/user.entity';
import { Driver } from '../../drivers/entities/driver.entity';
import { PaymentType } from 'src/enums/trip-payment-type.enum';
import { TripStatus } from 'src/enums/ride-status.enum';
import { TripPaymentStatus } from 'src/enums/trip-payment-status.enum';
import { PeppcruiseFees } from '../../fees/entities/peppcruise-fees.entity';

// export enum PaymentType {
//   PEPP_COIN = 'PEPP_COIN',
//   CASH = 'CASH',
//   PI_COIN = 'PI_COIN',
//   CARD = 'CARD',
//   WALLET = 'WALLET',
// }

// export enum TripStatus {
//   PENDING = 'PENDING',
//   ASSIGNED = 'ASSIGNED',
//   ACCEPTED = 'ACCEPTED',
//   COMPLETED = 'COMPLETED',
//   CANCELLED = 'CANCELLED',
//   ON_THE_WAY = 'ON_THE_WAY',
//   ARRIVED = 'ARRIVED',
// }

@Table({
  tableName: 'trips',
  timestamps: true,
  paranoid: true, // enables deletedAt for soft deletes
  defaultScope: {
    attributes: {
      exclude: ['deletedAt'],
    },
  },
})
export class Trip extends Model<Trip> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
  })
  declare userId: string;

  @BelongsTo(() => User)
  declare user: User;

  @ForeignKey(() => PeppcruiseFees)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
  })
  declare feeId: string;

  @BelongsTo(() => PeppcruiseFees)
  declare fee: PeppcruiseFees;

  @ForeignKey(() => Driver)
  @AllowNull(true)
  @Column({
    type: DataType.UUID,
  })
  declare driverId?: string;

  @BelongsTo(() => Driver)
  declare driver?: Driver;

  /** Tax amount (money) for the trip, when applicable. */
  @AllowNull(true)
  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  declare tax?: number;

  @AllowNull(false)
  @Column({
    type: DataType.DECIMAL(10, 2),
  })
  declare estimatedFee: number;

  @AllowNull(true)
  @Column({
    type: DataType.DECIMAL(10, 2),
  })
  declare finalFee: number;

  @AllowNull(true)
  @Column({
    type: DataType.DATE,
  })
  declare startTime?: Date;

  @AllowNull(true)
  @Column({
    type: DataType.DATE,
  })
  declare endTime?: Date;

  @AllowNull(true)
  @Column({
    type: DataType.DATE,
  })
  declare driverArrivalTime?: Date;


  @Default(PaymentType.CASH)
  @AllowNull(true)
  @Column({
    type: DataType.ENUM(...Object.values(PaymentType)),
  })
  declare paymentType?: PaymentType;


  @Column({
    type: DataType.STRING(5000),
    allowNull: true,
  })
  declare dropoffAddress?: string;

  @Column({
    type: DataType.STRING(5000),
    allowNull: true,
  })
  declare pickupAddress?: string;

  @Column({
    type: DataType.STRING(1000),
    allowNull: true,
  })
  declare pickupLocation?: string;

  @Column({
    type: DataType.STRING(1000),
    allowNull: true,
  })
  declare dropoffLocation?: string;

  @Column({
    type: DataType.STRING(1000),
    allowNull: true,
  })
  declare stopLocation?: string;

  @Column({
    type: DataType.DECIMAL(9, 6),
    allowNull: true,
  })
  declare stopLongitude?: string;

  @Column({
    type: DataType.DECIMAL(9, 6),
    allowNull: true,
  })
  declare stopLatitude?: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare stopCompletedTime?: Date;

  @Column({
    type: DataType.DECIMAL(9, 6),
    allowNull: true,
  })
  declare distanceToPickup?: string;

  @Column({
    type: DataType.DECIMAL(9, 6),
    allowNull: true,
  })
  declare distanceCovered?: string;


  @Column({
    type: DataType.DECIMAL(9, 6),
    allowNull: true,
  })
  declare pickupLatitude?: number;

  @Column({
    type: DataType.DECIMAL(9, 6),
    allowNull: true,
  })
  declare pickupLongitude?: number;

  @Column({
    type: DataType.DECIMAL(9, 6),
    allowNull: true,
  })
  declare dropoffLatitude?: number;

  @Column({
    type: DataType.DECIMAL(9, 6),
    allowNull: true,
  })
  declare dropoffLongitude?: number;

  @Default(TripPaymentStatus.UNPAID)
  @AllowNull(false)
  @Column({
    type: DataType.ENUM(...Object.values(TripPaymentStatus)),
  })
  declare paymentStatus: TripPaymentStatus;

  @Default(TripStatus.TRIP_BOOKED)
  @AllowNull(false)
  @Column({
    type: DataType.ENUM(...Object.values(TripStatus)),
  })
  declare status: TripStatus;

  @CreatedAt
  @AllowNull(false)
  @Column({
    type: DataType.DATE,
  })
  declare createdAt: Date;

  @AllowNull(true)
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare cancelledAt?: Date;

  @Column({
    type: DataType.DATE,
  })
  declare completedAt?: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare updatedAt: Date;

  @DeletedAt
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare deletedAt: Date | null;
}

// import {
//   Table,
//   Column,
//   Model,
//   DataType,
//   ForeignKey,
//   BelongsTo,
//   Default,
//   AllowNull,
//   CreatedAt,
//   UpdatedAt,
//   DeletedAt,
// } from 'sequelize-typescript';
// import { User } from '../../users/entities/user.entity';
// import { Driver } from '../../drivers/entities/driver.entity';
// import { PeppcruiseFees } from '../../fees/entities/peppcruise-fees.entity';
// import { VehicleRegistration } from '../../vehicles/entities/vehicle-registration.entity';
// import { PaymentType } from 'src/enums/payment-type.enum';
// import { CancellationStatus, TripStatus } from 'src/enums/ride-status.enum';

// @Table({
//   tableName: 'trips',
//   timestamps: true,
//   paranoid: true, // enables deletedAt for soft deletes
//   defaultScope: {
//     attributes: {
//       exclude: ['deletedAt'],
//     },
//   },
// })
// export class Trip extends Model<Trip> {
//   @Column({
//     type: DataType.UUID,
//     defaultValue: DataType.UUIDV4,
//     primaryKey: true,
//   })
//   declare id: string;

//   @ForeignKey(() => User)
//   @AllowNull(false)
//   @Column({
//     type: DataType.UUID,
//   })
//   declare userId: string;

//   @BelongsTo(() => User)
//   declare user: User;

//   @ForeignKey(() => PeppcruiseFees)
//   @AllowNull(false)
//   @Column({
//     type: DataType.UUID,
//   })
//   declare feeId: string;

//   @BelongsTo(() => PeppcruiseFees)
//   declare fee: PeppcruiseFees;

//   @ForeignKey(() => Driver)
//   @AllowNull(true)
//   @Column({
//     type: DataType.UUID,
//   })
//   declare driverId?: string;

//   @BelongsTo(() => Driver)
//   declare driver?: Driver;

//   @ForeignKey(() => VehicleRegistration)
//   @AllowNull(true)
//   @Column({
//     type: DataType.UUID,
//   })
//   declare vehicleRegistrationId?: string;

//   @BelongsTo(() => VehicleRegistration)
//   declare vehicleRegistration?: VehicleRegistration;

//   @AllowNull(false)
//   @Column({
//     type: DataType.DECIMAL(10, 2),
//   })
//   declare estimatedFee: number;

//   @AllowNull(true)
//   @Column({
//     type: DataType.DECIMAL(10, 2),
//   })
//   declare finalFee: number;

//   @AllowNull(true)
//   @Column({
//     type: DataType.DATE,
//   })
//   declare startTime?: Date;

//   @AllowNull(true)
//   @Column({
//     type: DataType.DATE,
//   })
//   declare endTime?: Date;

//   @AllowNull(true)
//   @Column({
//     type: DataType.DATE,
//   })
//   declare arrivalTime?: Date;

//   @Default(PaymentType.CASH)
//   @AllowNull(true)
//   @Column({
//     type: DataType.ENUM(...Object.values(PaymentType)),
//   })
//   declare paymentType?: PaymentType;

//   @Column({
//     type: DataType.STRING(5000),
//     allowNull: true,
//   })
//   declare dropoffAddress?: string;

//   @Column({
//     type: DataType.STRING(5000),
//     allowNull: true,
//   })
//   declare pickupAddress?: string;

//   @Column({
//     type: DataType.STRING(1000),
//     allowNull: true,
//   })
//   declare pickupLocation?: string;

//   @Column({
//     type: DataType.STRING(1000),
//     allowNull: true,
//   })
//   declare dropoffLocation?: string;

//   @Column({
//     type: DataType.DECIMAL(9, 6),
//     allowNull: true,
//   })
//   declare pickupLatitude?: number;

//   @Column({
//     type: DataType.DECIMAL(9, 6),
//     allowNull: true,
//   })
//   declare pickupLongitude?: number;

//   @Column({
//     type: DataType.DECIMAL(9, 6),
//     allowNull: true,
//   })
//   declare dropoffLatitude?: number;

//   @Column({
//     type: DataType.DECIMAL(9, 6),
//     allowNull: true,
//   })
//   declare dropoffLongitude?: number;
  

//   @Default(TripStatus.PENDING)
//   @AllowNull(false)
//   @Column({
//     type: DataType.ENUM(...Object.values(TripStatus)),
//   })
//   declare status: TripStatus;

//   @CreatedAt
//   @AllowNull(false)
//   @Column({
//     type: DataType.DATE,
//   })
//   declare createdAt: Date;

//   @AllowNull(true)
//   @Column({
//     type: DataType.DATE,
//     allowNull: true,
//   })
//   declare cancelledAt?: Date;

//   @AllowNull(true)
//   @Column({
//     type: DataType.ENUM(...Object.values(CancellationStatus)),
//   })
//   declare cancellationStatus?: CancellationStatus;
  
//   @Column({
//     type: DataType.DATE,
//   })
//   declare completedAt?: Date;

//   @UpdatedAt
//   @Column({
//     type: DataType.DATE,
//     allowNull: true,
//   })
//   declare updatedAt: Date;

//   @DeletedAt
//   @Column({
//     type: DataType.DATE,
//     allowNull: true,
//   })
//   declare deletedAt: Date | null;
// }