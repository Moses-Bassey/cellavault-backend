import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  ForeignKey,
  BelongsTo,
  CreatedAt,
} from 'sequelize-typescript';
import { User } from '../../users/entities/user.entity';
import { PeppcoinTransactionType } from 'src/enums/peppcoin-transaction-type.enum';
import { PeppcoinTransactionStatus } from 'src/enums/peppcoin-transaction-status.enum';

@Table({
  tableName: 'peppcoin_transactions',
  timestamps: false,
})
export class PeppcoinTransaction extends Model<PeppcoinTransaction> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare userId: string;

  @BelongsTo(() => User)
  declare user?: User;

  @AllowNull(false)
  @Column(DataType.DECIMAL(14, 2))
  declare amount: number;

  @Default(1)
  @AllowNull(false)
  @Column(DataType.DECIMAL(14, 6))
  declare conversionRate: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(14, 2))
  declare previousBalance: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(14, 2))
  declare currentBalance: number;

  @AllowNull(true)
  @Column(DataType.STRING(2000))
  declare narration?: string;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(PeppcoinTransactionType)))
  declare transactionType: PeppcoinTransactionType;

  @Default(PeppcoinTransactionStatus.COMPLETED)
  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(PeppcoinTransactionStatus)))
  declare transactionStatus: PeppcoinTransactionStatus;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  declare transactionReference: string;

  @CreatedAt
  @AllowNull(false)
  @Column(DataType.DATE)
  declare createdAt: Date;
}
