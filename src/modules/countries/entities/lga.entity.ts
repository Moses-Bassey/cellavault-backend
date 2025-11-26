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
  public declare id: string;

  @Column(DataType.STRING(100))
  public declare name: string;

  @ForeignKey(() => State)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  public declare stateId: string;

  @BelongsTo(() => State)
  public state: State;

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


