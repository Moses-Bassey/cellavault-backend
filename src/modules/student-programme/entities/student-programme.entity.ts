import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
} from 'sequelize-typescript';
import { Student } from '../../students/entities/student.entity';
import { Programme } from '../../programmes/entities/programme.entity';

@Table({
  tableName: 'student_programmes',
  timestamps: true,
  paranoid: false,
})
export class StudentProgramme extends Model<StudentProgramme> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => Student)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare studentId: string;

  @ForeignKey(() => Programme)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare programmeId: string;

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
}
