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
import { State } from './state.entity';
import { Country } from './country.entity';

@Table({
  tableName: 'lgas',
  timestamps: true,
  paranoid: true,
  defaultScope: {
    attributes: {
      exclude: ['deletedAt'],
    },
  },
})
export class LGA extends Model<LGA> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare public id: string;

  @Column(DataType.STRING(100))
  declare public name: string;

  @ForeignKey(() => State)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare public stateId: string;

  @BelongsTo(() => State)
  public state: State;

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
