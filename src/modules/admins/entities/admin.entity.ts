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

  @Column(DataType.STRING(1000))
  declare password: string;

  @Column({
    type: DataType.ENUM,
    values: Object.values(UserType),
    allowNull: false,
    defaultValue: UserType.PEPP_ADMIN,
  })
  declare role: UserType;

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
