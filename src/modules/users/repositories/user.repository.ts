import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Model } from 'sequelize-typescript';
import { User } from '../entities/user.entity';
import { UserType } from '../../../enums/user-type.enum';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async findById(id: string): Promise<User | null> {
    return await this.userModel.findByPk(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({
      where: { email },
      raw: true
    });
  }

  async findByPhone(phoneNo: string): Promise<User | null> {
    return await this.userModel.findOne({
      where: { phoneNo },
    });
  }

  async findByEmailAndRole(email: string, userType: UserType): Promise<User | null> {
    return await this.userModel.findOne({
      where: { email, userType },
    });
  }

  async create(userData: Partial<User>): Promise<User> {
    return await this.userModel.create(userData as any);
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
