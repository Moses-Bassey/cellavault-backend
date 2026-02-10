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
import { Driver } from '../../drivers/entities/driver.entity';
import { Admin } from '../../admins/entities/admin.entity';
import { UserType } from 'src/enums';

@Table({
  tableName: 'client_devices',
  timestamps: true,
  paranoid: true, // Enable soft delete
  defaultScope: {
    attributes: {
      exclude: ['deletedAt'],
    },
  },
})
export class ClientDevice extends Model<ClientDevice> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare public id: string;

  @Column({
    type: DataType.STRING(45), // IPv6 can be up to 45 characters
    allowNull: false,
  })
  declare public ipAddress: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare public deviceFCMToken: string | null;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  declare public name: string | null;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare public userId: string | null;

  @ForeignKey(() => Driver)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare public driverId: string | null;

  @ForeignKey(() => Admin)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare public adminId: string | null;

  @Column({
    type: DataType.ENUM(
      'DRIVER',
      'USER',
      'SUPER_ADMIN',
      'PEPP_ADMIN',
      'PEPP_MANAGER',
    ),
    allowNull: true,
  })
  declare public userType: UserType;

  @BelongsTo(() => User)
  // @AllowNull(true)
  declare public user: User;

  @BelongsTo(() => Driver)
  // @AllowNull(true)
  declare public driver: Driver;

  @BelongsTo(() => Admin)
  declare public admin: Admin;

  @CreatedAt
  declare public createdAt: Date;

  @UpdatedAt
  declare public updatedAt: Date;

  @DeletedAt
  declare public deletedAt: Date | null;
}
