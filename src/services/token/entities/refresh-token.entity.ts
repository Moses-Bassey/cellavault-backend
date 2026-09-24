import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
  AllowNull,
  Unique,
} from 'sequelize-typescript';

import { User } from '../../../modules/users/entities/user.entity';

@Table({
  tableName: 'refresh_tokens',
  timestamps: true,
})
export class RefreshToken extends Model<RefreshToken> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare userId: string;

  @BelongsTo(() => User)
  declare user: User;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(255))
  declare token: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  declare expiresAt: Date;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare revokedAt: Date | null;

  @AllowNull(true)
  @Column(DataType.UUID)
  declare replacedByTokenId: string | null;

  @AllowNull(true)
  @Column(DataType.STRING(1000))
  declare userAgent: string | null;

  @AllowNull(true)
  @Column(DataType.STRING(100))
  declare ipAddress: string | null;

  @CreatedAt
  @AllowNull(false)
  @Column(DataType.DATE)
  declare createdAt: Date;

  @UpdatedAt
  @AllowNull(false)
  @Column(DataType.DATE)
  declare updatedAt: Date;
}