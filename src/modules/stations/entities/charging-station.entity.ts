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
  AllowNull,
} from 'sequelize-typescript';
import { StationBadge } from 'src/enums/station-badge.enum';

@Table({
  tableName: 'charging_stations',
  timestamps: true,
  paranoid: true,
  defaultScope: {
    attributes: {
      exclude: ['deletedAt'],
    },
  },
})
export class ChargingStation extends Model<ChargingStation> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @AllowNull(true)
  @Column(DataType.STRING(100))
  declare name: string;

  @AllowNull(true)
  @Column(DataType.STRING(100))
  declare state: string;

  @AllowNull(true)
  @Column(DataType.STRING(100))
  declare country: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  declare address: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  declare contactPhone: string;

  // @AllowNull(false)
  // @Column({
  //   type: DataType.INTEGER,
  //   allowNull: false,
  //   defaultValue: 0,
  // })
  // declare rating: number;

  // @AllowNull(false)
  // @Column({
  //   type: DataType.INTEGER,
  //   allowNull: false,
  //   defaultValue: 0,
  // })
  // declare reviews: number;

  @AllowNull(false)
  @Default(StationBadge.DISCOVERY_ONLY)
  @Column({
    type: DataType.ENUM(...Object.values(StationBadge)),
    allowNull: false,
    defaultValue: StationBadge.DISCOVERY_ONLY,
  })
  declare stationBadge: StationBadge;

  @AllowNull(false)
  @Column({
    type: DataType.TIME,
    allowNull: false,
  })
  declare openingTime: string;

  @AllowNull(false)
  @Column({
    type: DataType.TIME,
    allowNull: false,
  })
  declare closingTime: string;

  @AllowNull(false)
  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  declare amountPerUnit: number;

  @AllowNull(false)
  @Default('NGN')
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    defaultValue: 'NGN',
  })
  declare currency: string;

  @AllowNull(false)
  @Default('kwh')
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    defaultValue: 'kwh',
  })
  declare amountPerUnitType: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    validate: { isEmail: true },
  })
  declare contactEmail: string;

  @AllowNull(false)
  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  declare isActive: boolean;

  @AllowNull(true)
  @Column({
    type: DataType.DECIMAL(10, 8),
    allowNull: true,
  })
  declare longitude?: number;

  @AllowNull(true)
  @Column({
    type: DataType.DECIMAL(11, 8),
    allowNull: true,
  })
  declare latitude?: number;

  @AllowNull(true)
  @Default('default.png')
  @Column({
    type: DataType.STRING(500),
    allowNull: true,
    defaultValue: 'default.png',
  })
  declare stationImage?: string;

  // @AllowNull(true)
  // @Column({
  //   type: DataType.INTEGER,
  //   allowNull: true,
  // })
  // declare dispenserCount?: number;

  // @AllowNull(true)
  // @Column({
  //   type: DataType.INTEGER,
  //   allowNull: true,
  // })
  // declare storageCapacity?: number;

  // @AllowNull(true)
  // @Column({
  //   type: DataType.STRING(100),
  //   allowNull: true,
  // })
  // declare operatorName?: string;

  // @AllowNull(true)
  // @Column({
  //   type: DataType.STRING(500),
  //   allowNull: true,
  // })
  // declare safetyCertifications?: string;

  @CreatedAt
  @AllowNull(false)
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare createdAt: Date;

  @UpdatedAt
  @AllowNull(false)
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare updatedAt: Date;

  @DeletedAt
  @AllowNull(true)
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare deletedAt: Date | null;
}
