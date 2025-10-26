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
  tableName: 'guarantors',
  timestamps: true,
  paranoid: true,
  defaultScope: {
    attributes: {
      exclude: ['deletedAt'],
    },
  },
})
export class Guarantor extends Model<Guarantor> {
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

  @Column(DataType.STRING(150))
  public fullName: string;

  @Column(DataType.STRING(15))
  public phoneNo: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  })
  public email: string;

  @Column(DataType.STRING)
  public relationship: string;

  @Column(DataType.STRING)
  public address: string;

  @Column(DataType.STRING)
  public occupation: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  public homeAddress: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  public workAddress: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  public identificationType: string; // NIN, Drivers License, etc.

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  public identificationNumber: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  public additionalInfo: string;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  public isVerified: boolean;

  @AllowNull
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  public verificationStatus: string;

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

