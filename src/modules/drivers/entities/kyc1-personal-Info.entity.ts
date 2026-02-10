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
import { GENDER } from 'src/enums/gender.enum';
import { Driver } from './driver.entity';
import { Country } from '../../countries/entities/country.entity';

@Table({
  tableName: 'driver_kyc_1_personal_information',
  timestamps: true,
  paranoid: true,
  defaultScope: {
    attributes: {
      exclude: ['deletedAt'],
    },
  },
})
export class kyc1PersonalInfo extends Model<kyc1PersonalInfo> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare public id: string;

  @AllowNull
  @ForeignKey(() => Driver)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  public driverId: string;

  @BelongsTo(() => Driver)
  public driver: Driver;

  @AllowNull
  @ForeignKey(() => Country)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  public countryId: string;

  @BelongsTo(() => Country)
  public country: Country;

  @Column(DataType.STRING(255))
  public fullName: string;

  @Unique
  @Column({
    type: DataType.STRING(15),
    allowNull: false,
  })
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
    values: Object.values(GENDER),
    allowNull: false,
  })
  public gender: GENDER;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  public dateOfBirth: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  public phoneBrand: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  public phoneModel: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isVerified: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  public schoolCertificateImageUrl: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  public utilityBillImageUrl: string;

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
