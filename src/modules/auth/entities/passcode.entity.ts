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
} from 'sequelize-typescript';
import { UserType } from '../../../enums/user-type.enum';

@Table({
  tableName: 'passcodes',
  timestamps: true,
  paranoid: true,
  defaultScope: {
    attributes: {
      exclude: ['deletedAt'],
    },
  },
})
export class Passcode extends Model<Passcode> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  public declare id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  public userId: string;

  @Column({
    type: DataType.ENUM,
    values: Object.values(UserType),
    allowNull: false,
  })
  public userType: UserType;

  @Column({
    type: DataType.STRING(1000),
    allowNull: false,
  })
  public code: string;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  public declare createdAt: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  public declare updatedAt: Date;

  @DeletedAt
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  public declare deletedAt: Date | null;
}

