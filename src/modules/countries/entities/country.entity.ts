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
  public declare id: string;

  @Unique
  @Column(DataType.STRING(100))
  public declare name: string;

  @Column(DataType.STRING(10))
  public declare phoneCode: string;

  @Column(DataType.STRING(10))
  public declare flag: string;

  @Column(DataType.STRING(10))
  public declare currency: string;

  @Column(DataType.INTEGER)
  public declare phoneLength: number;

  @CreatedAt
  public declare createdAt: Date;

  @UpdatedAt
  public declare updatedAt: Date;

  @DeletedAt
  public declare deletedAt: Date | null;
}