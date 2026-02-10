import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Model } from 'sequelize-typescript';
import { Driver } from '../entities/driver.entity';
import { UserType } from '../../../enums/user-type.enum';
import { Op } from 'sequelize';
import { Country } from 'src/modules/countries/entities';
import { Guarantor } from '../entities/guarantor.entity';
import { kyc1PersonalInfo } from '../entities/kyc1-personal-Info.entity';
import { kyc2IdInformation } from '../entities/kyc2-Id-Information.entity';
import { kyc3ResidentialInformation } from '../entities/kyc3-residential-Information.entity';
import { KYC_COMPLETED } from 'src/enums/kyc.enums';

@Injectable()
export class DriverRepository {
  constructor(
    @InjectModel(Driver)
    private driverModel: typeof Driver,
  ) {}

  async findByIdentity(identity: string): Promise<Driver | null> {
    const driver = await this.driverModel.findOne({
      where: {
        [Op.or]: [{ email: identity }, { phoneNo: identity }],
      },
    });
    return driver ? (driver.toJSON() as Driver) : null;
  }

  async findById(id: string): Promise<Driver | null> {
    return await this.driverModel.findByPk(id, { raw: true });
  }

  async fetchDriver(id: string): Promise<Driver | null> {
    const driver = await this.driverModel.findByPk(id, {
      attributes: {
        exclude: ['password', 'deletedAt', 'isDisabled'],
      },
      include: [
        {
          model: Country,
        },
        {
          model: Guarantor,
        },
        {
          model: kyc1PersonalInfo,
        },
        {
          model: kyc2IdInformation,
        },
        {
          model: kyc3ResidentialInformation,
        },
      ],
    });
    return driver ? (driver.toJSON() as Driver) : null;
  }

  async findByEmail(email: string): Promise<Driver | null> {
    const driver = await this.driverModel.findOne({
      where: { email },
    });
    return driver ? (driver.toJSON() as Driver) : null;
  }

  async findByPhone(phoneNo: string): Promise<Driver | null> {
    const driver = await this.driverModel.findOne({
      where: { phoneNo },
    });
    return driver ? (driver.toJSON() as Driver) : null;
  }

  async findByEmailAndRole(
    email: string,
    userType: UserType,
  ): Promise<Driver | null> {
    const driver = await this.driverModel.findOne({
      where: { email, userType },
    });
    return driver ? (driver.toJSON() as Driver) : null;
  }

  async findActiveDrivers(
    kycCompleted: KYC_COMPLETED,
  ): Promise<Driver[] | null> {
    return await this.driverModel.findAll({
      where: { kycCompleted },
    });
  }

  async create(driverData: Partial<Driver>): Promise<Driver> {
    const driver = await this.driverModel.create(driverData as any, {
      raw: true,
      returning: true,
    });
    return driver.toJSON() as Driver;
  }

  async update(
    id: string,
    driverData: Partial<Driver>,
  ): Promise<[number, Driver[]]> {
    return await this.driverModel.update(driverData, {
      where: { id },
      returning: true,
    });
  }

  async delete(id: string): Promise<number> {
    return await this.driverModel.destroy({
      where: { id },
    });
  }

  async restore(id: string): Promise<void> {
    await this.driverModel.restore({
      where: { id },
    });
  }

  async findWithCountry(
    email: string,
    userType: UserType,
  ): Promise<Driver | null> {
    return await this.driverModel.findOne({
      where: { email, userType },
      include: ['country'],
    });
  }

  async findAll(options?: any): Promise<Driver[]> {
    return await this.driverModel.findAll(options);
  }
}
