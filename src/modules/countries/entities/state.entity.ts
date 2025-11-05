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
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Country } from './country.entity';

@Table({
  tableName: 'states',
  timestamps: true,
  paranoid: true, // Enable soft delete
  defaultScope: {
    attributes: {
      exclude: ['deletedAt', 'createdAt', 'updatedAt'],
    },
  },
})
export class State extends Model<State> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  public declare id: string;

  @Column(DataType.STRING(100))
  public declare name: string;

  @ForeignKey(() => Country)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  public declare countryId: string;

  @BelongsTo(() => Country)
  public country: Country;

  @CreatedAt
  public declare createdAt: Date;

  @UpdatedAt
  public declare updatedAt: Date;

  @DeletedAt
  public declare deletedAt: Date | null;
}

