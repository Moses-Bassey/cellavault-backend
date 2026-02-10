import { Injectable, BadRequestException } from '@nestjs/common';
import { VehicleRegistration } from '../entities/vehicle-registration.entity';
import { VehicleRegistrationRepository } from '../repositories/vehicle-registration.repository';
import { DriverService } from './driver.service';
import { CreateVehicleRegistrationDto } from '../dto/vehicle-registration.dto';

@Injectable()
export class VehicleRegistrationService {
  constructor(
    private readonly vehicleRegistrationRepository: VehicleRegistrationRepository,
    private readonly driverService: DriverService,
  ) {}

  async findById(id: string): Promise<VehicleRegistration | null> {
    return await this.vehicleRegistrationRepository.findById(id);
  }

  async findByDriverId(driverId: string): Promise<VehicleRegistration[]> {
    return await this.vehicleRegistrationRepository.findByDriverId(driverId);
  }

  async create(
    driverId: string,
    vehicleRegistrationData: CreateVehicleRegistrationDto,
  ): Promise<CreateVehicleRegistrationDto> {
    const driver = await this.driverService.findById(driverId);
    if (!driver) {
      throw new BadRequestException('Driver not found');
    }

    const existingVehicleRegistration =
      await this.vehicleRegistrationRepository.findByDriverId(driverId);
    if (existingVehicleRegistration.length > 0) {
      throw new BadRequestException(
        'You can only have 1 vehicle registrations',
      );
    }

    const data = await this.vehicleRegistrationRepository.create({
      vehicleRegisterationNo: vehicleRegistrationData.vehicleRegisterationNo,
      brandOfVehicle: vehicleRegistrationData.brandOfVehicle,
      color: vehicleRegistrationData.color,
      makeOfVehicle: vehicleRegistrationData.makeOfVehicle,
      vinNumber: vehicleRegistrationData.vinNumber,
      registerationExpiryDate: new Date(
        vehicleRegistrationData.registerationExpiryDate,
      ),
      plateNumberUrl: vehicleRegistrationData.plateNumberUrl,
      plateNo: vehicleRegistrationData.plateNo,
      driverId,
    });

    return vehicleRegistrationData;
  }

  async update(
    id: string,
    vehicleRegistrationData: Partial<VehicleRegistration>,
  ): Promise<[number, VehicleRegistration[]]> {
    return await this.vehicleRegistrationRepository.update(
      id,
      vehicleRegistrationData,
    );
  }

  async deleteVehicleRegistration(id: string, driverId: string) {
    const vehicleRegistration =
      await this.vehicleRegistrationRepository.findById(id);
    if (!vehicleRegistration) {
      throw new BadRequestException('Vehicle registration not found');
    }
    if (vehicleRegistration.driverId !== driverId) {
      throw new BadRequestException('Vehicle registration not found');
    }

    const data =
      await this.vehicleRegistrationRepository.deleteVehicleRegistration(
        id,
        driverId,
      );
    return data;
  }

  async deleteByDriverId(driverId: string): Promise<number> {
    return await this.vehicleRegistrationRepository.deleteByDriverId(driverId);
  }
}
