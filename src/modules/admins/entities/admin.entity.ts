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
  Unique,
} from 'sequelize-typescript';
import { UserType } from '../../../enums/user-type.enum';
import { InvitationStatus } from '../../../enums/invite-status.enum';

@Table({
  tableName: 'admins',
  timestamps: true,
  paranoid: true, // enables soft deletes (deletedAt)
  defaultScope: {
    attributes: {
      exclude: ['deletedAt'],
    },
  },
})
export class Admin extends Model<Admin> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Column(DataType.STRING(150))
  declare fullName: string;

  @Unique
  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  })
  declare email: string;

  //
  @Unique
  @Column(DataType.STRING(300))
  declare phoneNo: string;

  @Column({
    type: DataType.STRING(1000),
    allowNull: true,
  })
  declare password: string | null;

  @Column({
    type: DataType.ENUM,
    values: Object.values(UserType),
    allowNull: false,
    defaultValue: UserType.PEPP_ADMIN,
  })
  declare role: UserType;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare imageUrl: string | null;

  @Column({
    type: DataType.ENUM,
    values: Object.values(InvitationStatus),
    allowNull: false,
    defaultValue: InvitationStatus.PENDING,
  })
  declare inviteStatus: InvitationStatus;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  declare isVerified: boolean;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  declare isActive: boolean;

  //
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare invitedAcceptedAt: Date | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare lastLogin: Date | null;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare createdAt: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare updatedAt: Date;

  @DeletedAt
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare deletedAt: Date | null;
}
