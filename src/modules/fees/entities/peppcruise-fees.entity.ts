import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  AllowNull,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  Unique,
} from 'sequelize-typescript';

export enum CarType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

@Table({
  tableName: 'fees',
  timestamps: true,
  paranoid: true, // enables deletedAt for soft deletes
  defaultScope: {
    attributes: {
      exclude: ['deletedAt'],
    },
  },
})
export class PeppcruiseFees extends Model<PeppcruiseFees> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Unique
  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  declare className: string;

  @Default(0)
  @AllowNull(false)
  @Column({
    type: DataType.DECIMAL(10, 2),
  })
  declare baseFee: number;

  @Default(0)
  @AllowNull(false)
  @Column({
    type: DataType.DECIMAL(10, 2),
  })
  declare piBaseFee: number;

  @Default(0)
  @AllowNull(false)
  @Column({
    type: DataType.DECIMAL(10, 2),
  })
  declare peppCoinBaseFee: number;

  @AllowNull(true)
  @Column({
    type: DataType.TEXT,
  })
  declare description?: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING(500),
  })
  declare vehicleImage?: string;

  @Default(4)
  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  declare vehicleSeaters: number;

  @Default(CarType.PUBLIC)
  @AllowNull(false)
  @Column({
    type: DataType.ENUM(...Object.values(CarType)),
  })
  declare carType: CarType;

  @CreatedAt
  @AllowNull(false)
  @Column({
    type: DataType.DATE,
  })
  declare createdAt: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare updatedAt: Date;

  @DeletedAt
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare deletedAt: Date | null;
}
