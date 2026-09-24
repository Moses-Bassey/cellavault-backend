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
  tableName: 'customers',
  timestamps: true,
  paranoid: true,
  defaultScope: {
    attributes: {
      exclude: ['deletedAt'],
    },
  },
})
export class Customer extends Model<Customer> {
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
  @Column(DataType.STRING(100))
  declare firstName: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  declare lastName: string;

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