import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Model } from 'sequelize-typescript';
import { VehicleRegistration } from '../entities/vehicle-registration.entity';

@Injectable()
export class VehicleRegistrationRepository {
  constructor(
    @InjectModel(VehicleRegistration)
    private vehicleRegistrationModel: typeof VehicleRegistration,
  ) {}

  async findById(id: string): Promise<VehicleRegistration | null> {
    return await this.vehicleRegistrationModel.findByPk(id, {raw: true});
  }

  async findByDriverId(driverId: string): Promise<VehicleRegistration[]> {
    return await this.vehicleRegistrationModel.findAll({
      where: { driverId },
      raw: true
    });
  }

  async create(vehicleRegistrationData: Partial<VehicleRegistration>): Promise<VehicleRegistration> {
    const vehicleRegistration =  await this.vehicleRegistrationModel.create(vehicleRegistrationData as any, {raw: true, returning: true});
    return vehicleRegistration.toJSON() as VehicleRegistration
  }

  async update(id: string, vehicleRegistrationData: Partial<VehicleRegistration>): Promise<[number, VehicleRegistration[]]> {
    return await this.vehicleRegistrationModel.update(vehicleRegistrationData, {
      where: { id },
      returning: true,
    });
  }

  async delete(id: string): Promise<number> {
    return await this.vehicleRegistrationModel.destroy({
      where: { id },
    });
  }

  async deleteVehicleRegistration(id: string, driverId: string): Promise<number> {
    return await this.vehicleRegistrationModel.destroy({
      where: { id, driverId },
    });
  }

  async deleteByDriverId(driverId: string): Promise<number> {
    return await this.vehicleRegistrationModel.destroy({
      where: { driverId },
    });
  }
}

