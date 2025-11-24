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
import { CNG_CONVERSION_STATUS } from 'src/enums/cng-conversion-status.enum';
import { TRANSMISSION } from 'src/enums/transmission.enum';
import { FUEL_TYPE } from 'src/enums/fuel-type.enum';
import { ENGINE_CONDITION } from 'src/enums/engine-condition.enum';
import { User } from 'src/modules/users/entities/user.entity';

@Table({
  tableName: 'cng_conversions',
  timestamps: true,
  paranoid: true,
  defaultScope: {
    attributes: {
      exclude: ['deletedAt'],
    },
  },
})
export class CngConversion extends Model<CngConversion> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  public declare id: string;

  @AllowNull
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  public userId: string;

  @BelongsTo(() => User)
  public user: User;

  @Column(DataType.STRING(150))
  public fullName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  })
  public email: string;

  @Column(DataType.STRING(15))
  public contactPhone: string;

  @Column(DataType.STRING(11))
  public nin: string;

  @Column(DataType.STRING(100))
  public vehicleRegisterationNo: string;

  @Column(DataType.STRING(100))
  public brandOfVehicle: string;

  @Column(DataType.STRING(50))
  public color: string;

  @Column(DataType.STRING(100))
  public makeOfVehicle: string;

  @Column(DataType.STRING(4))
  public yearOfManufacture: string;

  @Column(DataType.STRING(255))
  public vinNumber: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  public registerationExpiryDate: Date;

  @Column(DataType.STRING(50))
  public engineCapacity: string;

  @Column(DataType.STRING(10))
  public cylinder: string;

  @Column({
    type: DataType.ENUM,
    values: Object.values(ENGINE_CONDITION),
    allowNull: false,
  })
  public engineCondition: ENGINE_CONDITION;

  @Column({
    type: DataType.ENUM,
    values: Object.values(FUEL_TYPE),
    allowNull: false,
  })
  public fuelType: FUEL_TYPE;

  @Column({
    type: DataType.ENUM,
    values: Object.values(TRANSMISSION),
    allowNull: false,
  })
  public transmission: TRANSMISSION;

  @Column(DataType.STRING(50))
  public mileage: string;

  @Column(DataType.STRING(200))
  public usualRoute: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: true,
  })
  public operatingMotorPark: string;

  @Column(DataType.STRING(200))
  public conversionCenter: string;

  @Column(DataType.STRING(100))
  public residentialState: string;

  @Column(DataType.STRING(100))
  public lga: string;

  @Column(DataType.STRING(500))
  public address: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  public additionalNote: string;

  @Default(CNG_CONVERSION_STATUS.PENDING)
  @Column({
    type: DataType.ENUM,
    values: Object.values(CNG_CONVERSION_STATUS),
    allowNull: false,
  })
  public status: CNG_CONVERSION_STATUS;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  public declare createdAt: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  public declare updatedAt: Date;

  @DeletedAt
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  public declare deletedAt: Date | null;
}

