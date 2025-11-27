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
import { State } from '../../countries/entities/state.entity';
import { PROOF_OF_ADDRESS_TYPE } from '../../../enums/proof-of-address-type.enum';

@Table({
  tableName: 'driver_kyc_3_residential_information',
  timestamps: true,
  paranoid: true,
  defaultScope: {
    attributes: {
      exclude: ['deletedAt'],
    },
  },
})
export class kyc3ResidentialInformation extends Model<kyc3ResidentialInformation> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare public id: string;

  @ForeignKey(() => State)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  public stateId: string;

  @BelongsTo(() => State)
  public state: State;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  public city: string;
  //a city model is required, for now we use string

  @AllowNull
  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  public streetAddress: string;

  @AllowNull
  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  public landmark: string;

  @AllowNull
  @Column({
    type: DataType.STRING(20),
    allowNull: true,
  })
  public postalOrZipCode: string;

  @AllowNull
  @Column({
    type: DataType.ENUM,
    values: Object.values(PROOF_OF_ADDRESS_TYPE),
    allowNull: true,
  })
  public proofOfAddressType: PROOF_OF_ADDRESS_TYPE;

  @AllowNull
  @Column({
    type: DataType.STRING(1000),
    allowNull: true,
  })
  public proofOfAddressImage: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  verified: boolean;

  @AllowNull
  @ForeignKey(() => Driver)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  public driverId: string;

  @BelongsTo(() => Driver)
  public driver: Driver;

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
