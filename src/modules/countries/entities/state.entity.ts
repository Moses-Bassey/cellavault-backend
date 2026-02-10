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
  declare public id: string;

  @Column(DataType.STRING(100))
  declare public name: string;

  @ForeignKey(() => Country)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare public countryId: string;

  @BelongsTo(() => Country)
  public country: Country;

  @CreatedAt
  declare public createdAt: Date;

  @UpdatedAt
  declare public updatedAt: Date;

  @DeletedAt
  declare public deletedAt: Date | null;
}
