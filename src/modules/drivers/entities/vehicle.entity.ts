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
  } from 'sequelize-typescript';
import { Driver } from './driver.entity';

  @Table({
    tableName: 'vehicles',
    timestamps: true,
    paranoid: true,
    defaultScope: {
      attributes: {
        exclude: ['deletedAt'],
      },
    },
  })
  export class Vehicle extends Model<Vehicle> {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare public id: string;

    @ForeignKey(() => Driver)
    @Column({
      type: DataType.UUID,
      allowNull: true,
    })
    public driverId: string;
  
    @BelongsTo(() => Driver)
    public driver: Driver;
   
    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    public licenseNumber: string;

    @Column({
      type: DataType.STRING,
      allowNull: true,
    })
    public registrationImageUrl: string;

    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    public brand: string;
  
    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    public color: string;
  
    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    public plateNumber: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    public imagePlateNumber: string;
  
    @Column({
      type: DataType.STRING,
      allowNull: true,
    })
    public year: string;
  
    @Column({
      type: DataType.STRING(255),
      allowNull: true,
    })
    public vinNumber: string;

    @Column({
      type: DataType.BOOLEAN,
      allowNull: false,
      defaultValue: false
    })
    public isPeppcruiseVehicle: boolean;


    @Column({
      type: DataType.DATE,
      allowNull: true,
    })
    public expiryDate: Date;
  
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
  