import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Tutor } from '../entities/tutor.entity';

@Injectable()
export class TutorRepository {
  constructor(
    @InjectModel(Tutor)
    private readonly tutorModel: typeof Tutor,
  ) {}

  async findById(id: string): Promise<Tutor | null> {
    return await this.tutorModel.findByPk(id, { raw: true });
  }

  async fetchUser(id: string): Promise<Tutor | null> {
    const user = await this.tutorModel.findByPk(id, {
      attributes: {
        exclude: ['password', 'deletedAt', 'isDisabled'],
      },
    });
    return user ? (user.toJSON() as Tutor) : null;
  }

  async findByEmail(email: string): Promise<Tutor | null> {
    const user = await this.tutorModel.findOne({
      where: { email },
    });
    return user ? (user.toJSON() as Tutor) : null;
  }

  async delete(id: string): Promise<number> {
    return await this.tutorModel.destroy({
      where: { id },
    });
  }

  async findActiveUsers(isDisabled: boolean): Promise<Tutor[] | null> {
    return await this.tutorModel.findAll({
      where: { isActive: false },
    });
  }

  async update(id: string, userData: Partial<Tutor>): Promise<number | null> {
    const [affectedRows] = await this.tutorModel.update(userData, {
      where: { id },
    });

    if (affectedRows === 0) return null;
    return affectedRows;
  }
}
