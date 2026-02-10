import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Model } from 'sequelize-typescript';
import { Passcode } from '../entities/passcode.entity';
import { UserType } from '../../../enums/user-type.enum';

@Injectable()
export class PasscodeRepository {
  constructor(
    @InjectModel(Passcode)
    private passcodeModel: typeof Passcode,
  ) {}

  async findByUserId(
    userId: string,
    userType: UserType,
  ): Promise<Passcode | null> {
    return await this.passcodeModel.findOne({
      where: { userId, userType },
      raw: true,
    });
  }

  async create(passcodeData: Partial<Passcode>): Promise<Passcode> {
    const passcode = await this.passcodeModel.create(passcodeData as any, {
      raw: true,
      returning: true,
    });
    return passcode.toJSON() as Passcode;
  }

  async update(
    userId: string,
    userType: UserType,
    passcodeData: Partial<Passcode>,
  ): Promise<[number, Passcode[]]> {
    return await this.passcodeModel.update(passcodeData, {
      where: { userId, userType },
      returning: true,
    });
  }

  async delete(userId: string, userType: UserType): Promise<number> {
    return await this.passcodeModel.destroy({
      where: { userId, userType },
    });
  }
}
