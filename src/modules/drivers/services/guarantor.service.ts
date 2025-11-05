import { Injectable, BadRequestException } from '@nestjs/common';
import { Guarantor } from '../entities/guarantor.entity';
import { GuarantorRepository } from '../repositories/guarantor.repository';

@Injectable()
export class GuarantorService {
  
  private readonly MAX_GUARANTORS = 3;

  constructor(private readonly guarantorRepository: GuarantorRepository) {}

  async findById(id: string): Promise<Guarantor | null> {
    return await this.guarantorRepository.findById(id);
  }

  async findByDriverId(driverId: string): Promise<Guarantor[]> {
    return await this.guarantorRepository.findByDriverId(driverId);
  }

  async countByDriverId(driverId: string): Promise<number> {
    return await this.guarantorRepository.countByDriverId(driverId);
  }

  async create(driverId: string, guarantorData: Partial<Guarantor>): Promise<Guarantor> {
    // Check if driver already has maximum guarantors
    const count = await this.guarantorRepository.countByDriverId(driverId);
    
    if (count >= this.MAX_GUARANTORS) {
      throw new BadRequestException(`Maximum of ${this.MAX_GUARANTORS} guarantors allowed per driver`);
    }

    return await this.guarantorRepository.create({
      ...guarantorData,
      driverId,
    });
  }

  async update(id: string, guarantorData: Partial<Guarantor>): Promise<[number, Guarantor[]]> {
    return await this.guarantorRepository.update(id, guarantorData);
  }

  async delete(id: string): Promise<number> {
    return await this.guarantorRepository.delete(id);
  }

  async deleteByDriverId(driverId: string): Promise<number> {
    return await this.guarantorRepository.deleteByDriverId(driverId);
  }


  canAddMoreGuarantors(driverId: string): Promise<boolean> {
    return this.guarantorRepository.countByDriverId(driverId)
      .then(count => count < this.MAX_GUARANTORS);
  }
}

