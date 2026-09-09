import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Model } from 'sequelize-typescript';
import { Admin} from '../entities/admin.entity';
import { UserType } from '../../../enums/user-type.enum';
import { Op, WhereOptions } from 'sequelize';
import { Country } from 'src/modules/countries/entities';
import { UserStatusFilter } from '../../../enums/user-status.enum';
import { encodeCursor } from '../../../utils/cursor.util';

interface RepositoryParams {
  search?: string;
  status?: string;
  limit: number;
  offset: number;
}


@Injectable()
export class AdminRepository {
  constructor(
    @InjectModel(Admin)
    private readonly adminModel: typeof Admin,
  ) {}

  async findById(id: string): Promise<Admin | null> {
    return await this.adminModel.findByPk(id, { raw: true });
  }

  async fetchUser(id: string): Promise<Admin | null> {
    const user = await this.adminModel.findByPk(id, {
      attributes: {
        exclude: ['password', 'deletedAt', 'isDisabled'],
      },
      include: [
        {
          model: Country,
        },
      ],
    });
    return user ? (user.toJSON() as Admin) : null;
  }

  async findByEmail(email: string): Promise<Admin | null> {
    const user = await this.adminModel.findOne({
      where: { email },
    });
    return user ? (user.toJSON() as Admin) : null;
  }

  async delete(id: string): Promise<number> {
    return await this.adminModel.destroy({
      where: { id },
    });
  }

  async findActiveUsers(isDisabled: boolean): Promise<Admin[] | null> {
    return await this.adminModel.findAll({
      where: { isActive: false },
    });
  }

  // async create(userData: Partial<Admin>): Promise<Admin> {
  //   const user = await this.adminModel.create(userData as any, {
  //     raw: true,
  //     returning: true,
  //   });
  //   return user.toJSON() as Admin;
  // }

  async update(id: string, userData: Partial<Admin>): Promise<number | null> {
    const [affectedRows] = await this.adminModel.update(userData, {
      where: { id },
    });

    if (affectedRows === 0) return null;
    return affectedRows;
  }

}
