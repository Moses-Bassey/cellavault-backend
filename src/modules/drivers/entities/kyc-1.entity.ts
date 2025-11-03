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

@Table({
  tableName: 'kyc_1',
  timestamps: true,
  paranoid: true,
  defaultScope: {
    attributes: {
      exclude: ['deletedAt'],
    },
  },
})
export class Kyc1 extends Model<Kyc1> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare public id: string;

  @Column(DataType.STRING(255))
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
