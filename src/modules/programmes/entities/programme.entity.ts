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
  AllowNull,
  BelongsToMany,
} from 'sequelize-typescript';
import { Student } from '../../students/entities/student.entity';
import { StudentProgramme } from '../../student-programme/entities/student-programme.entity';

@Table({
  tableName: 'programmes',
  timestamps: true,
  paranoid: true,
  defaultScope: {
    attributes: {
      exclude: ['deletedAt'],
    },
  },
})
export class Programme extends Model<Programme> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Column(DataType.STRING(255))
  declare name: string;

  @AllowNull
  @Column(DataType.TEXT)
  declare description: string;

  @AllowNull
  @Column(DataType.INTEGER)
  declare hours: number;

  @BelongsToMany(() => Student, () => StudentProgramme)
  declare students: Student[];

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
