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
  HasMany,
  HasOne,
} from 'sequelize-typescript';
import { UserType } from '../../../enums/user-type.enum';
import { Country } from '../../countries/entities/country.entity';
import { LoginType } from 'src/enums/login-type.enum';
import { Guarantor } from './guarantor.entity';
import { Kyc1 } from './kyc-one.entity';
import { Kyc2 } from './kyc-two.entity';
import { Kyc3 } from './kyc-three.entity';
import { GENDER } from 'src/enums/gender.enum';
import { DRIVER_VERIFICATION_STATUS } from 'src/enums/driver-verification-status.enum';

@Table({
  tableName: 'drivers',
  timestamps: true,
  paranoid: true,
  defaultScope: {
    attributes: {
      exclude: ['deletedAt'],
    },
  },
})
export class Driver extends Model<Driver> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare public id: string;

  @Column(DataType.STRING(150))
  public fullName: string;

  @Unique
  @Column(DataType.STRING(15))
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

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  public isEmailVerified: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  public isPhoneVerified: boolean;

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  public isActive: boolean;


  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(DRIVER_VERIFICATION_STATUS),
    defaultValue: DRIVER_VERIFICATION_STATUS.PENDING,
  })
  public verificationStatus: DRIVER_VERIFICATION_STATUS;

  // @Column({
  //   type: DataType.STRING,
  //   allowNull: true,
  // })
  // public licenseNumber: string;

  // @Column({
  //   type: DataType.STRING,
  //   allowNull: true,
  // })
  // public vehicleModel: string;

  // @Column({
  //   type: DataType.STRING,
  //   allowNull: true,
  // })
  // public vehicleColor: string;

  // @Column({
  //   type: DataType.STRING,
  //   allowNull: true,
  // })
  // public vehiclePlateNumber: string;

  // @Column({
  //   type: DataType.STRING,
  //   allowNull: true,
  // })
  // public vehicleYear: string;

  // @Column({
  //   type: DataType.STRING,
  //   allowNull: true,
  // })
  // public vehicleType: string;

  @Column({
    type: DataType.DECIMAL(10, 8),
    allowNull: true,
  })
  public latitude: number;

  @Column({
    type: DataType.DECIMAL(11, 8),
    allowNull: true,
  })
  public longitude: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  public isAvailable: boolean;

  @Column({
    type: DataType.DECIMAL(3, 2),
    allowNull: true,
  })
  public rating: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  public totalTrips: number;

  @AllowNull
  @ForeignKey(() => Country)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  public countryId: string;

  @BelongsTo(() => Country)
  public country: Country;

  @HasMany(() => Guarantor)
  public guarantors: Guarantor[];

  @HasOne(() => Kyc1)
  public driverPersonalInfoKyc: Kyc1;

  @HasOne(() => Kyc2)
  public driverIdKyc: Kyc2;

  @HasOne(() => Kyc3)
  public driverAddressKyc: Kyc3;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare public createdAt: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare public updatedAt: Date;

  @DeletedAt
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare public deletedAt: Date | null;
}
