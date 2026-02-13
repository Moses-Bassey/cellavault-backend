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

// export type CoinEntryType =
//   | 'EARNED_RIDE'
//   | 'EARNED_PROMO'
//   | 'EARNED_REFERRAL'
//   | 'SPENT_RIDE'
//   | 'SPENT_REWARD'
//   | 'ADJUSTMENT'
//   | 'REVERSAL';

// @Table({
//   tableName: 'coin_ledger',
//   timestamps: true,
// })
// export class CoinLedgerModel extends Model<CoinLedgerModel> {
//   @PrimaryKey
//   @Default(DataType.UUIDV4)
//   @Column(DataType.UUID)
//   declare id: string;

//   @AllowNull(false)
//   @Index('idx_coin_ledger_passenger_createdAt')
//   @Column(DataType.UUID)
//   declare passengerId: string;

//   /**
//    * Optional linkage (e.g., earned from a ride, spent on a ride, etc.)
//    */
//   @AllowNull(true)
//   @Index('idx_coin_ledger_rideId')
//   @Column(DataType.UUID)
//   declare rideId: string | null;

//   /**
//    * Positive for credit, negative for debit.
//    * Use INT unless coins can exceed 2b; then BIGINT.
//    */
//   @AllowNull(false)
//   @Column(DataType.INTEGER)
//   declare delta: number;

//   /**
//    * Ledger entry classification (helps reporting)
//    */
//   @AllowNull(false)
//   @Index('idx_coin_ledger_type_createdAt')
//   @Column(
//     DataType.ENUM(
//       'EARNED_RIDE',
//       'EARNED_PROMO',
//       'EARNED_REFERRAL',
//       'SPENT_RIDE',
//       'SPENT_REWARD',
//       'ADJUSTMENT',
//       'REVERSAL',
//     ),
//   )
//   declare type: CoinEntryType;

//   /**
//    * If you want faster reads for “current balance” without summing ledger:
//    * store running balance per entry (denormalization).
//    * Not mandatory, but useful at scale.
//    */
//   @AllowNull(true)
//   @Column(DataType.INTEGER)
//   declare balanceAfter: number | null;

//   /**
//    * Admin/support investigation fields
//    */
//   @AllowNull(true)
//   @Column(DataType.STRING(255))
//   declare note: string | null;

//   @AllowNull(true)
//   @Column(DataType.JSON)
//   declare metadata: Record<string, any> | null;

//   /**
//    * Idempotency key if entries are generated from events/webhooks/jobs.
//    * Prevents accidental duplicate credits/debits.
//    */
//   @AllowNull(true)
//   @Index('idx_coin_ledger_idempotencyKey')
//   @Column(DataType.STRING(128))
//   declare idempotencyKey: string | null;

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

@Table({
  tableName: 'coins',
  timestamps: true,
})
export class Coin extends Model<Coin> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @AllowNull(false)
  @Index('idx_coins_passenger_createdAt')
  @Column(DataType.UUID)
  declare passengerId: string;

  /**
   * Positive = credit
   * Negative = debit
   */
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare delta: number;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}
