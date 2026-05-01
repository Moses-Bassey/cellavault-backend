// import {
//   Table,
//   Column,
//   Model,
//   DataType,
//   PrimaryKey,
//   Default,
//   CreatedAt,
//   UpdatedAt,
//   AllowNull,
//   Index,
// } from 'sequelize-typescript';

// export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

// @Table({
//   tableName: 'mck_payments',
//   timestamps: true,
// })
// export class Payment extends Model<Payment> {
//   @PrimaryKey
//   @Default(DataType.UUIDV4)
//   @Column(DataType.UUID)
//   declare id: string;

//   @AllowNull(false)
//   @Index('idx_payments_passenger_status_createdAt')
//   @Column(DataType.UUID)
//   declare passengerId: string;

//   /**
//    * Store in minor units (kobo/cents) or major units —
//    * just stay consistent in your system.
//    */
//   @AllowNull(false)
//   @Column(DataType.BIGINT)
//   declare amount: number;

//   @AllowNull(false)
//   @Default('PENDING')
//   @Column(DataType.ENUM('PENDING', 'SUCCESS', 'FAILED'))
//   declare status: PaymentStatus;

//   @CreatedAt
//   declare createdAt: Date;

//   @UpdatedAt
//   declare updatedAt: Date;
// }
