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
    ForeignKey
  } from 'sequelize-typescript';
import { Driver } from './driver.entity';
import { Vehicle } from './vehicle.entity';

  @Table({
    tableName: 'pepp_driver_vehicles',
    timestamps: true,
    paranoid: true,
    defaultScope: {
      attributes: {
        exclude: ['deletedAt'],
      },
    },
  })
  export class PeppDriverVehicles extends Model<PeppDriverVehicles> {
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

    @ForeignKey(() => Vehicle)
    @Column({
      type: DataType.UUID,
      allowNull: true,
    })
    public vehicleId: string;
  
    @BelongsTo(() => Vehicle)
    public vehicle: Vehicle;
  
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
  