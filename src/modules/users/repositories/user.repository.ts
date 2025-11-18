import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Model } from 'sequelize-typescript';
import { User } from '../entities/user.entity';
import { UserType } from '../../../enums/user-type.enum';
import { Op } from 'sequelize';
import { Country } from 'src/modules/countries/entities';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async findByIdentity(identity: string): Promise<User | null> {
    return await this.userModel.findOne({
      where: {
        [Op.or]: [
          { email: identity },
          { phoneNo: identity },
        ],
      },
      raw: true
    });
  }

  async findById(id: string): Promise<User | null> {
    return await this.userModel.findByPk(id, {raw: true});
  }

  async fetchUser(id: string): Promise<User | null> {
    const user = await this.userModel.findByPk(id, {
      attributes: {
        exclude: ['password', 'deletedAt', 'isDisabled'],
      },
      include: [
        {
          model: Country
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
      where: { phoneNo }
    });
    return user ? (user.toJSON() as User) : null;
  }

  async findByEmailAndRole(email: string, userType: UserType): Promise<User | null> {
    return await this.userModel.findOne({
      where: { email, userType },
      raw: true
    });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user =  await this.userModel.create(userData as any, {raw: true, returning: true});
    return user.toJSON() as User
  }

  async update(id: string, userData: Partial<User>): Promise<[number, User[]]> {
    return await this.userModel.update(userData, {
      where: { id },
      returning: true,
    });
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

  async findWithCountry(email: string, userType: UserType): Promise<User | null> {
    return await this.userModel.findOne({
      where: { email, userType },
      include: ['country'],
    });
  }

  async findAll(options?: any): Promise<User[]> {
    return await this.userModel.findAll(options);
  }
}
