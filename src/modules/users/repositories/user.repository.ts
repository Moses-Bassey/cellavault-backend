import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Model } from 'sequelize-typescript';
import { User } from '../entities/user.entity';
import { UserType } from '../../../enums/user-type.enum';
import { Op, WhereOptions } from 'sequelize';
import { Country } from 'src/modules/countries/entities';

interface RepositoryParams {
  search?: string;
  status?: string;
  limit: number;
  offset: number;
}
@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async findByIdentity(identity: string): Promise<User | null> {
    return await this.userModel.findOne({
      where: {
        [Op.or]: [{ email: identity }, { phoneNo: identity }],
      },
      raw: true,
    });
  }

  async findById(id: string): Promise<User | null> {
    return await this.userModel.findByPk(id, { raw: true });
  }

  async fetchUser(id: string): Promise<User | null> {
    const user = await this.userModel.findByPk(id, {
      attributes: {
        exclude: ['password', 'deletedAt', 'isDisabled'],
      },
      include: [
        {
          model: Country,
        },
      ],
    });
    return user ? (user.toJSON() as User) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({
      where: { email },
    });
    return user ? (user.toJSON() as User) : null;
  }

  async findByPhone(phoneNo: string): Promise<User | null> {
    const user = await this.userModel.findOne({
      where: { phoneNo },
    });
    return user ? (user.toJSON() as User) : null;
  }

  async findByEmailAndRole(
    email: string,
    userType: UserType,
  ): Promise<User | null> {
    return await this.userModel.findOne({
      where: { email, userType },
      raw: true,
    });
  }

  async findActiveUsers(isDisabled: boolean): Promise<User[] | null> {
    return await this.userModel.findAll({
      where: { isDisabled },
    });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = await this.userModel.create(userData as any, {
      raw: true,
      returning: true,
    });
    return user.toJSON() as User;
  }

  async update(id: string, userData: Partial<User>): Promise<number | null> {
    const [affectedRows] = await this.userModel.update(userData, {
      where: { id },
    });

    if (affectedRows === 0) return null;
    return affectedRows;
  }

  async delete(id: string): Promise<number> {
    return await this.userModel.destroy({
      where: { id },
    });
  }

  async restore(id: string): Promise<void> {
    await this.userModel.restore({
      where: { id },
    });
  }

  async findWithCountry(
    email: string,
    userType: UserType,
  ): Promise<User | null> {
    return await this.userModel.findOne({
      where: { email, userType },
      include: ['country'],
    });
  }

  async findAll(options: {
    search?: string;
    status?: boolean;
    limit: number;
    offset: number;
  }): Promise<User[]> {
    const { search, status, limit, offset } = options;

    console.log('Status: ', status);
    const where: WhereOptions = {
      ...(typeof status === 'boolean' && { isActive: status }),

      ...(search && {
        [Op.or]: [
          { fullName: { [Op.like]: `%${search}%` } },
          { phoneNo: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
        ],
      }),
    };

    return this.userModel.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });
  }

  async countAll(): Promise<User[] | null> {
    return await this.userModel.findAll();
  }

  async countFiltered(options: {
    search?: string;
    status?: boolean;
  }): Promise<number> {
    const { search, status } = options;
    const where: any = {};
    if (search) {
      where[Op.or] = [
        { fullName: { [Op.like]: `%${search}%` } },
        { phoneNo: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }
    if (status) {
      where.isActive = status;
    }
    return this.userModel.count({ where });
  }

  async findAllBanned(isDisabled: boolean): Promise<User[]> {
    return await this.userModel.findAll({
      where: { isDisabled },
    });
  }

  async getNewUsersForMonth(year: number, month: number): Promise<User[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    return this.userModel.findAll({
      where: {
        createdAt: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        },
      },
    });
  }
}
