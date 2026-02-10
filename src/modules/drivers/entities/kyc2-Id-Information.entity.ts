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
import { Driver } from './driver.entity';
import { IDENTIFICATION_TYPE } from 'src/enums/identification.enums';

@Table({
  tableName: 'driver_kyc_2_id_information',
  timestamps: true,
  paranoid: true,
  defaultScope: {
    attributes: {
      exclude: ['deletedAt'],
    },
  },
})
export class kyc2IdInformation extends Model<kyc2IdInformation> {
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

  @Column({
    type: DataType.ENUM,
    values: Object.values(IDENTIFICATION_TYPE),
    allowNull: false,
  })
  public identificationType: string;

  @Unique
  @Column(DataType.STRING(100))
  public identificationNumber: string;

  @Column(DataType.STRING(500))
  public identificationImageUrl: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  public isVerified: boolean;

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
