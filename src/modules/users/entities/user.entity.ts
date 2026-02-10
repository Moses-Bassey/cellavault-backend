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
  BelongsTo,
  ForeignKey,
  AllowNull,
} from 'sequelize-typescript';
import { UserType } from '../../../enums/user-type.enum';
import { Country } from '../../countries/entities/country.entity';
import { LoginType } from 'src/enums/login-type.enum';

@Table({
  tableName: 'users',
  timestamps: true,
  paranoid: true,
  defaultScope: {
    attributes: {
      exclude: ['deletedAt'],
    },
  },
})
export class User extends Model<User> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare public id: string;

  @Column(DataType.STRING(150))
  public fullName: string;

  @Unique
  @Column(DataType.STRING(300))
  public phoneNo: string;

  @Unique
  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  })
  public email: string;

  @Column({
    type: DataType.ENUM,
    values: Object.values(UserType),
    allowNull: false,
  })
  public userType: UserType;

  @Column(DataType.STRING(1000))
  public password: string;

  @Column({
    type: DataType.ENUM,
    values: Object.values(LoginType),
    allowNull: false,
  })
  public loginType: LoginType;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  public isEmailVerified: boolean;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  public isPhoneVerified: boolean;

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  public isActive: boolean;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  public isDisabled: boolean;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  public hasPasscode: boolean;

  @AllowNull
  @ForeignKey(() => Country)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  public countryId: string;

  @BelongsTo(() => Country)
  public country: Country;

  @AllowNull
  @Column({
    type: DataType.STRING(1000),
    allowNull: true,
  })
  public imageUrl: string;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare public createdAt: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare public updatedAt: Date;

  @DeletedAt
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare public deletedAt: Date | null;
}
