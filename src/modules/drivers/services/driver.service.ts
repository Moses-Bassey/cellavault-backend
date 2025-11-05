import { Injectable } from '@nestjs/common';
import { Driver } from '../entities/driver.entity';
import { DriverRepository } from '../repositories/driver.repository';

@Injectable()
export class DriverService {
  
  constructor(private readonly driverRepository: DriverRepository) {}


  async findById(id: string): Promise<Driver | null> {
    return await this.driverRepository.findById(id);
  }

  async findByIdentity(identity: string): Promise<Driver | null> {
    return await this.driverRepository.findByIdentity(identity);
  }

  async findByEmail(email: string): Promise<Driver | null> {
    return await this.driverRepository.findByEmail(email);
  }

  async findAll(options?: any): Promise<Driver[]> {
    return await this.driverRepository.findAll(options);
  }

  async update(id: string, driverData: Partial<Driver>): Promise<[number, Driver[]]> {
    return await this.driverRepository.update(id, driverData);
  }

  async delete(id: string): Promise<number> {
    return await this.driverRepository.delete(id);
  }

  async restore(id: string): Promise<void> {
    return await this.driverRepository.restore(id);
  }
}

