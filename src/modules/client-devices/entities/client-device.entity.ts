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
} from 'sequelize-typescript';
import { User } from '../../users/entities/user.entity';

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
  public declare id: string;

  @Column({
    type: DataType.STRING(45), // IPv6 can be up to 45 characters
    allowNull: false,
  })
  public declare ipAddress: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  public declare deviceFCMToken: string | null;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  public declare name: string | null;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  public declare userId: string | null;

  @Column({
    type: DataType.ENUM('SUPER_ADMIN', 'PEPP_ADMIN', 'USER'),
    allowNull: true,
  })
  public declare userType: 'SUPER_ADMIN' | 'PEPP_ADMIN' | 'USER' | null;

  @BelongsTo(() => User)
  public declare user: User;

  @CreatedAt
  public declare createdAt: Date;

  @UpdatedAt
  public declare updatedAt: Date;

  @DeletedAt
  public declare deletedAt: Date | null;
}
