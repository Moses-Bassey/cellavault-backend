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

// export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
// export type PaymentProvider = 'PAYSTACK' | 'FLUTTERWAVE' | 'STRIPE' | 'CASH' | 'WALLET';
// export type PaymentPurpose = 'RIDE_FARE' | 'TOPUP' | 'PENALTY' | 'SUBSCRIPTION' | 'OTHER';

// @Table({
//   tableName: 'payments',
//   timestamps: true,
// })
// export class Payment extends Model<Payment> {
//   @PrimaryKey
//   @Default(DataType.UUIDV4)
//   @Column(DataType.UUID)
//   declare id: string;

//   /**
//    * The passenger who made the payment (or who the payment is associated with).
//    * Index for fast per-passenger queries in admin.
//    */
//   @AllowNull(false)
//   @Index('idx_payments_passenger_createdAt')
//   @Column(DataType.UUID)
//   declare passengerId: string;

//   /**
//    * Optional: driver involved in a payment (tips, adjustments, etc.)
//    */
//   @AllowNull(true)
//   @Column(DataType.UUID)
//   declare driverId: string | null;

//   /**
//    * Optional: ride linked to this payment
//    */
//   @AllowNull(true)
//   @Index('idx_payments_rideId')
//   @Column(DataType.UUID)
//   declare rideId: string | null;

//   /**
//    * Store money in minor units (kobo/cents) for accuracy.
//    */
//   @AllowNull(false)
//   @Column({
//     type: DataType.BIGINT,
//     get() {
//       const raw = this.getDataValue('amountMinor') as unknown as string | number;
//       return typeof raw === 'string' ? Number(raw) : raw;
//     },
//   })
//   declare amountMinor: number;

//   @AllowNull(false)
//   @Default('NGN')
//   @Column(DataType.STRING(3))
//   declare currency: string;

//   @AllowNull(false)
//   @Default('PENDING')
//   @Index('idx_payments_status_createdAt')
//   @Column(DataType.ENUM('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'))
//   declare status: PaymentStatus;

//   @AllowNull(false)
//   @Default('OTHER')
//   @Column(DataType.ENUM('RIDE_FARE', 'TOPUP', 'PENALTY', 'SUBSCRIPTION', 'OTHER'))
//   declare purpose: PaymentPurpose;

//   @AllowNull(false)
//   @Default('PAYSTACK')
//   @Column(DataType.ENUM('PAYSTACK', 'FLUTTERWAVE', 'STRIPE', 'CASH', 'WALLET'))
//   declare provider: PaymentProvider;

//   /**
//    * Provider reference (Paystack reference, Flutterwave tx_ref, etc.)
//    */
//   @AllowNull(true)
//   @Index('idx_payments_providerRef')
//   @Column(DataType.STRING(128))
//   declare providerRef: string | null;

//   /**
//    * For idempotency: your own internal reference for the transaction.
//    */
//   @AllowNull(true)
//   @Index('idx_payments_internalRef')
//   @Column(DataType.STRING(128))
//   declare internalRef: string | null;

//   /**
//    * Useful for admin investigations (webhook payload, failure reason, etc.)
//    * JSONB for Postgres; for MySQL use JSON.
//    */
//   @AllowNull(true)
//   @Column(DataType.JSON)
//   declare metadata: Record<string, any> | null;

//   @AllowNull(true)
//   @Column(DataType.STRING(255))
//   declare failureReason: string | null;

//   @CreatedAt
//   declare createdAt: Date;

//   @UpdatedAt
//   declare updatedAt: Date;
// }

import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  CreatedAt,
  UpdatedAt,
  AllowNull,
  Index,
} from 'sequelize-typescript';

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

@Table({
  tableName: 'payments',
  timestamps: true,
})
export class Payment extends Model<Payment> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @AllowNull(false)
  @Index('idx_payments_passenger_status_createdAt')
  @Column(DataType.UUID)
  declare passengerId: string;

  /**
   * Store in minor units (kobo/cents) or major units —
   * just stay consistent in your system.
   */
  @AllowNull(false)
  @Column(DataType.BIGINT)
  declare amount: number;

  @AllowNull(false)
  @Default('PENDING')
  @Column(DataType.ENUM('PENDING', 'SUCCESS', 'FAILED'))
  declare status: PaymentStatus;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}
