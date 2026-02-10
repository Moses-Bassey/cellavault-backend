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
import { kyc1PersonalInfo } from './kyc1-personal-Info.entity';
import { kyc2IdInformation } from './kyc2-Id-Information.entity';
import { kyc3ResidentialInformation } from './kyc3-residential-Information.entity';
import { GENDER } from 'src/enums/gender.enum';
import { DRIVER_VERIFICATION_STATUS } from 'src/enums/driver-verification-status.enum';
import { DRIVER_SHIFT } from 'src/enums/drivers-shift.enums';
import { KYC_COMPLETED } from 'src/enums/kyc.enums';

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

  // @Unique
  @Column({
    type: DataType.STRING(300),
    unique: true,
    allowNull: false,
  })
  public phoneNo: string;

  @Column({
    type: DataType.ENUM,
    values: Object.values(KYC_COMPLETED),
    allowNull: false,
    defaultValue: KYC_COMPLETED.NOT_COMPLETED,
  })
  public kycCompleted: KYC_COMPLETED;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  public isGuarantorCompleted: boolean;

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
    values: Object.values(GENDER),
    allowNull: false,
  })
  public gender: GENDER;

  @Column({
    type: DataType.ENUM,
    values: Object.values(UserType),
    allowNull: false,
    defaultValue: UserType.DRIVER,
  })
  public userType: UserType;

  @Column(DataType.STRING(2000))
  public password: string;

  @Column({
    type: DataType.STRING(1000),
    allowNull: true,
  })
  public profileImageUrl: string;

  @Column({
    type: DataType.ENUM,
    values: Object.values(DRIVER_SHIFT),
    allowNull: false,
    defaultValue: DRIVER_SHIFT.NO_SHIFT,
  })
  public driverShift: DRIVER_SHIFT;

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
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  public isDisabled: boolean;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  public hasPasscode: boolean;

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(DRIVER_VERIFICATION_STATUS),
    defaultValue: DRIVER_VERIFICATION_STATUS.PENDING,
  })
  public verificationStatus: DRIVER_VERIFICATION_STATUS;

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
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  public isPeppcruiseDriver: boolean;

  @AllowNull
  @ForeignKey(() => Country)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  public countryId: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  public accountNo: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  public bankName: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  public bankCode: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  public accountName: string;

  @Column({
    type: DataType.STRING(11),
    allowNull: true,
  })
  public bvn: string | null;

  @BelongsTo(() => Country)
  public country: Country;

  @HasMany(() => Guarantor)
  public guarantors: Guarantor[];

  @HasOne(() => kyc1PersonalInfo)
  public driverPersonalInfoKyc: kyc1PersonalInfo;

  @HasOne(() => kyc2IdInformation)
  public driverIdKyc: kyc2IdInformation;

  @HasOne(() => kyc3ResidentialInformation)
  public driverAddressKyc: kyc3ResidentialInformation;

  @Column({
    type: DataType.STRING(1000),
    allowNull: true,
  })
  public licenseImageUrl: string;

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
