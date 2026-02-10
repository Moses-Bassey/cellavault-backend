import { Injectable, BadRequestException } from '@nestjs/common';
import { Guarantor } from '../entities/guarantor.entity';
import { GuarantorRepository } from '../repositories/guarantor.repository';
import { CountryService } from 'src/modules/countries/services/country.service';
import { DriverService } from './driver.service';
import { CreateGuarantorDto } from '../dto/guarantor.dto';
import { GUARANTOR_STATUS } from 'src/enums/guarantor-status.enum';
import { Utils } from 'src/utils/utils';
import { Validators } from 'src/utils/validators.utils';

@Injectable()
export class GuarantorService {
  private readonly MAX_GUARANTORS = 2;

  constructor(
    private readonly guarantorRepository: GuarantorRepository,
    private readonly countryService: CountryService,
    private readonly driverService: DriverService,
  ) {}

  async findById(id: string): Promise<Guarantor | null> {
    return await this.guarantorRepository.findById(id);
  }

  async findByDriverId(driverId: string): Promise<Guarantor[]> {
    return await this.guarantorRepository.findByDriverId(driverId);
  }

  async countByDriverId(driverId: string): Promise<number> {
    return await this.guarantorRepository.countByDriverId(driverId);
  }

  async create(
    driverId: string,
    guarantorData: CreateGuarantorDto,
  ): Promise<Guarantor> {
    try {
      const count = await this.guarantorRepository.countByDriverId(driverId);

      const driver = await this.driverService.findById(driverId);
      if (!driver) {
        throw new BadRequestException('Driver not found');
      }

      if (count > this.MAX_GUARANTORS) {
        throw new BadRequestException(
          `Maximum of ${this.MAX_GUARANTORS} guarantors allowed per driver`,
        );
      }

      const country = await this.countryService.findById(guarantorData.country);
      if (!country) {
        throw new BadRequestException('Country not found');
      }

      if (guarantorData.phoneNo.length !== country.phoneLength) {
        throw new BadRequestException(
          `Phone number must be exactly ${country.phoneLength} digits`,
        );
      }

      const phone = Utils.normalizeCountryPhone(
        country.phoneCode,
        guarantorData.phoneNo,
        country.phoneLength,
      );
      const email = Validators.validateEmail(guarantorData.email);

      if (driver.email == email || driver.phoneNo == phone) {
        throw new BadRequestException('You cannot be a guarantor');
      }

      const data = await this.guarantorRepository.create({
        fullName: guarantorData.fullName,
        phoneNo: phone,
        email: email,
        identificationImageUrl: guarantorData.identificationImageUrl,
        utilityBillImageUrl: guarantorData.utilityBillImageUrl,
        policeClearanceImageUrl: guarantorData.policeClearanceImageUrl,
        reference: guarantorData.reference,
        countryId: country.id,
        driverId,
      });

      if (count >= 1) {
        if (data.id) {
          await this.driverService.update(driverId, {
            isGuarantorCompleted: true,
          });
        }
      }

      return data;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(
    id: string,
    guarantorData: Partial<Guarantor>,
  ): Promise<[number, Guarantor[]]> {
    return await this.guarantorRepository.update(id, guarantorData);
  }

  async deleteGuarantor(id: string, driverId: string) {
    const guarantor = await this.guarantorRepository.findById(id);
    if (!guarantor) {
      throw new BadRequestException('Guarantor not found');
    }
    if (guarantor.driverId !== driverId) {
      throw new BadRequestException('Guarantor not found');
    }

    if (guarantor.status == GUARANTOR_STATUS.APPROVED) {
      throw new BadRequestException('Cannot delete approved guarantor');
    }

    const data = await this.guarantorRepository.deleteGuarantor(id, driverId);
    return data;
  }

  async deleteByDriverId(driverId: string): Promise<number> {
    return await this.guarantorRepository.deleteByDriverId(driverId);
  }

  canAddMoreGuarantors(driverId: string): Promise<boolean> {
    return this.guarantorRepository
      .countByDriverId(driverId)
      .then((count) => count < this.MAX_GUARANTORS);
  }
}
