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
} from 'sequelize-typescript';

@Table({
  tableName: 'countries',
  timestamps: true,
  paranoid: true, // Enable soft delete
  defaultScope: {
    attributes: {
      exclude: ['deletedAt', 'createdAt', 'updatedAt'],
    },
  },
})
export class Country extends Model<Country> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare public id: string;

  @Unique
  @Column(DataType.STRING(100))
  declare public name: string;

  @Column(DataType.STRING(10))
  declare public phoneCode: string;

  @Column(DataType.STRING(10))
  declare public flag: string;

  @Column(DataType.STRING(10))
  declare public currency: string;

  @Column(DataType.INTEGER)
  declare public phoneLength: number;

  @CreatedAt
  declare public createdAt: Date;

  @UpdatedAt
  declare public updatedAt: Date;

  @DeletedAt
  declare public deletedAt: Date | null;
}
