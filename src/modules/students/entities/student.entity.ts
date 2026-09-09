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
  BelongsToMany,
} from 'sequelize-typescript';
import { Programme } from '../../programmes/entities/programme.entity';
import { StudentProgramme } from '../../student-programme/entities/student-programme.entity';
import { UserType } from 'src/enums/user-type.enum';

@Table({
  tableName: 'students',
  timestamps: true,
  paranoid: true,
  defaultScope: {
    attributes: {
      exclude: ['deletedAt'],
    },
  },
})
export class Student extends Model<Student> {
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

  @AllowNull
  @Column(DataType.STRING(255))
  declare guardianPhoneOrEmail: string;

  @Column(DataType.STRING(1000))
  declare password: string;

  @AllowNull
  @Column(DataType.STRING(50))
  declare gender: string;
    
  @Column({
    type: DataType.ENUM,
    values: Object.values(UserType),
    allowNull: false,
    defaultValue: UserType.STUDENT,
  })
  declare role: UserType;
  
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  declare isActive: boolean;

  @BelongsToMany(() => Programme, () => StudentProgramme)
  declare programmes: Programme[];

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
