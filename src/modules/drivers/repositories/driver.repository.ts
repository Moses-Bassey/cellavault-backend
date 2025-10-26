import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Model } from 'sequelize-typescript';
import { Driver } from '../entities/driver.entity';
import { UserType } from '../../../enums/user-type.enum';
import { Op } from 'sequelize';

@Injectable()
export class DriverRepository {
  constructor(
    @InjectModel(Driver)
    private driverModel: typeof Driver,
  ) {}

  async findByIdentity(identity: string): Promise<Driver | null> {
    return await this.driverModel.findOne({
      where: {
        [Op.or]: [
          { email: identity },
          { phoneNo: identity },
        ],
      },
      raw: true
    });
  }

  async findById(id: string): Promise<Driver | null> {
    return await this.driverModel.findByPk(id, {raw: true});
  }

  async findByEmail(email: string): Promise<Driver | null> {
    return await this.driverModel.findOne({
      where: { email },
      raw: true
    });
  }

  async findByPhone(phoneNo: string): Promise<Driver | null> {
    return await this.driverModel.findOne({
      where: { phoneNo },
      raw: true
    });
  }

  async findByEmailAndRole(email: string, userType: UserType): Promise<Driver | null> {
    return await this.driverModel.findOne({
      where: { email, userType },
      raw: true
    });
  }

  async create(driverData: Partial<Driver>): Promise<Driver> {
    const driver =  await this.driverModel.create(driverData as any, {raw: true, returning: true});
    return driver.toJSON() as Driver
  }

  async update(id: string, driverData: Partial<Driver>): Promise<[number, Driver[]]> {
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

  async findWithCountry(email: string, userType: UserType): Promise<Driver | null> {
    return await this.driverModel.findOne({
      where: { email, userType },
      include: ['country'],
    });
  }

  async findAll(options?: any): Promise<Driver[]> {
    return await this.driverModel.findAll(options);
  }

  async findAvailableDrivers(): Promise<Driver[]> {
    return await this.driverModel.findAll({
      where: { 
        isAvailable: true,
        isActive: true,
        isVerified: true
      }
    });
  }

  async findNearbyDrivers(latitude: number, longitude: number, radius: number = 5): Promise<Driver[]> {
    return await this.driverModel.findAll({
      where: { 
        isAvailable: true,
        isActive: true,
        isVerified: true,
        [Op.and]: [
          {
            latitude: {
              [Op.between]: [latitude - radius, latitude + radius]
            }
          },
          {
            longitude: {
              [Op.between]: [longitude - radius, longitude + radius]
            }
          }
        ]
      }
    });
  }
}

