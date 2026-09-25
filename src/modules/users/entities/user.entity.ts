import { Table, Column, Model, DataType, PrimaryKey, Default, CreatedAt, UpdatedAt, DeletedAt, Unique, AllowNull,
} from 'sequelize-typescript';
import { UserType } from 'src/enums';

@Table({
  tableName: 'users',
  timestamps: true,
  paranoid: true,
  defaultScope: {
    attributes: {
      exclude: ['password', 'deletedAt'],
    },
  },
})
export class User extends Model<User> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Unique
  @AllowNull(true)
  @Column({
    type: DataType.STRING,
    validate: {
      isEmail: true,
    },
  })
  declare email: string | null;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare emailVerifiedAt: Date | null;

  @Unique
  @AllowNull(true)
  @Column(DataType.STRING(30))
  declare phoneNo: string | null;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare phoneNoVerifiedAt: Date | null;

  @AllowNull(false)
  @Column(DataType.STRING(1000))
  declare password: string;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM,
    values: Object.values(UserType),
  })
  declare role: UserType;

  @AllowNull(false)
  @Default(true)
  @Column(DataType.BOOLEAN)
  declare isActive: boolean;

  @CreatedAt
  @AllowNull(false)
  @Column(DataType.DATE)
  declare createdAt: Date;

  @UpdatedAt
  @AllowNull(false)
  @Column(DataType.DATE)
  declare updatedAt: Date;

  @DeletedAt
  @AllowNull(true)
  @Column(DataType.DATE)
  declare deletedAt: Date | null;
}