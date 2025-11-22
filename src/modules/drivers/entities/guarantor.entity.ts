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
import { Country } from 'src/modules/countries/entities/country.entity';
import { GUARANTOR_STATUS } from 'src/enums/guarantor-status.enum';

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

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  public identificationImageUrl: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  public utilityBillImageUrl: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  public policeClearanceImageUrl: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  public reference: string;

  @AllowNull
  @ForeignKey(() => Country)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  public countryId: string;

  @BelongsTo(() => Country)
  public country: Country;

  @Default(GUARANTOR_STATUS.PENDING)
  @Column({
    type: DataType.ENUM,
    values: Object.values(GUARANTOR_STATUS),
    allowNull: false,
  })
  public status: GUARANTOR_STATUS;

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

