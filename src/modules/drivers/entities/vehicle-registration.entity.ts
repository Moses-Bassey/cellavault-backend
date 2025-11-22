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
  BelongsTo,
  ForeignKey,
  AllowNull,
} from 'sequelize-typescript';
import { Driver } from './driver.entity';

@Table({
  tableName: 'vehicle_registrations',
  timestamps: true,
  paranoid: true,
  defaultScope: {
    attributes: {
      exclude: ['deletedAt'],
    },
  },
})
export class VehicleRegistration extends Model<VehicleRegistration> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  public declare id: string;

  @AllowNull
  @ForeignKey(() => Driver)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  public driverId: string;

  @BelongsTo(() => Driver)
  public driver: Driver;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  public vehicleRegisterationNo: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  public brandOfVehicle: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  public color: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  public makeOfVehicle: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  public vinNumber: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  public registerationExpiryDate: Date;

  @Column({
    type: DataType.STRING(1000),
    allowNull: true,
  })
  public plateNumberUrl: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  public plateNo: string;

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

