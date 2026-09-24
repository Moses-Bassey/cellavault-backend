import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  ForeignKey,
  BelongsTo,
  AllowNull,
} from 'sequelize-typescript';

import { User } from '../../users/entities/user.entity';

@Table({
  tableName: 'vendors',
  timestamps: true,
  paranoid: true,
  defaultScope: {
    attributes: {
      exclude: ['deletedAt'],
    },
  },
})
export class Vendor extends Model<Vendor> {
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

  @AllowNull(false)
  @Column(DataType.STRING(200))
  declare businessName: string;

  @AllowNull(true)
  @Column(DataType.STRING(500))
  declare businessAddress: string | null;

  @CreatedAt
  @AllowNull(false)
  @Column(DataType.DATE)
  declare createdAt: Date;

  @UpdatedAt
  @AllowNull(false)
  @Column(DataType.DATE)
  declare updatedAt: Date;

  @DeletedAt
  @AllowNull(true)
  @Column(DataType.DATE)
  declare deletedAt: Date | null;
}