import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Student } from '../entities/student.entity';

@Injectable()
export class StudentRepository {
  constructor(
    @InjectModel(Student)
    private readonly studentModel: typeof Student,
  ) {}

  async findById(id: string): Promise<Student | null> {
    return await this.studentModel.findByPk(id, { raw: true });
  }

  async fetchUser(id: string): Promise<Student | null> {
    const user = await this.studentModel.findByPk(id, {
      attributes: {
        exclude: ['password', 'deletedAt', 'isDisabled'],
      },
    });
    return user ? (user.toJSON() as Student) : null;
  }

  async findByEmail(email: string): Promise<Student | null> {
    const user = await this.studentModel.findOne({
      where: { email },
    });
    return user ? (user.toJSON() as Student) : null;
  }

  async delete(id: string): Promise<number> {
    return await this.studentModel.destroy({
      where: { id },
    });
  }

  async findActiveUsers(isDisabled: boolean): Promise<Student[] | null> {
    return await this.studentModel.findAll({
      where: { isActive: false },
    });
  }

  async update(id: string, userData: Partial<Student>): Promise<number | null> {
    const [affectedRows] = await this.studentModel.update(userData, {
      where: { id },
    });

    if (affectedRows === 0) return null;
    return affectedRows;
  }
}
