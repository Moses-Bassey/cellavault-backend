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
  AllowNull,
} from 'sequelize-typescript';
import { UserType } from 'src/enums/user-type.enum';

@Table({
  tableName: 'tutors',
  timestamps: true,
  paranoid: true,
  defaultScope: {
    attributes: {
      exclude: ['deletedAt'],
    },
  },
})
export class Tutor extends Model<Tutor> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Column(DataType.STRING(150))
  declare name: string;

  @Unique
  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  })
  declare email: string;

  @AllowNull
  @Column(DataType.STRING(100))
  declare phone: string;

  @Column(DataType.STRING(1000))
  declare password: string;
  
  @Column({
    type: DataType.ENUM,
    values: Object.values(UserType),
    allowNull: false,
    defaultValue: UserType.TUTOR,
  })
  declare role: UserType;
  
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  declare isActive: boolean;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare createdAt: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare updatedAt: Date;

  @DeletedAt
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare deletedAt: Date | null;
}
