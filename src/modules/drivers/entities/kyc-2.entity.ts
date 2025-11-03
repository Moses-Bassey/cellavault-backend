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

@Table({
  tableName: 'kyc_two',
  timestamps: true,
  paranoid: true,
  defaultScope: {
    attributes: {
      exclude: ['deletedAt'],
    },
  },
})
export class Kyc2 extends Model<Kyc2> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare public id: string;

  @Column({
    type: DataType.ENUM,
    values: Object.values(['NATIONAL_ID', 'PASSPORT', 'DRIVER_LICENSE', 'VOTER_CARD']),
    allowNull: false,
  })
  public idType: string;
  //an id type model is required, for now we use string or use ENUMS: 'NATIONAL_ID', 'PASSPORT', 'DRIVER_LICENSE', 'VOTER_CARD'

  @Unique
  @Column(DataType.STRING(255))
  public idNumber: string;

  @Column(DataType.STRING(255))
  public IdDocumentUrl: string;

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
