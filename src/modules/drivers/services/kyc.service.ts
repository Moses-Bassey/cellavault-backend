import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { kyc1PersonalInfo } from '../entities/kyc1-personal-Info.entity';
import { kyc2IdInformation } from '../entities/kyc2-Id-Information.entity';
import { kyc3ResidentialInformation } from '../entities/kyc3-residential-Information.entity';
import { Kyc1Repository } from '../repositories/kyc1.repository';
import { Kyc2Repository } from '../repositories/kyc2.repository';
import { Kyc3Repository } from '../repositories/kyc3.repository';
import { CreateKyc1Dto, CreateKyc2Dto, CreateKyc3Dto } from '../dto/kyc.dto';
import { DriverRepository } from '../repositories';
import { CountryRepository } from 'src/modules/countries/repositories';
import { KYC_COMPLETED } from 'src/enums/kyc.enums';
import { StateService } from 'src/modules/countries/services/state.service';

@Injectable()
export class KycService {
  constructor(
    private readonly kyc1Repository: Kyc1Repository,
    private readonly kyc2Repository: Kyc2Repository,
    private readonly kyc3Repository: Kyc3Repository,
    private readonly driverRepository: DriverRepository,
    private readonly countryRepository: CountryRepository,
    private readonly stateService: StateService,
  ) {}

  async createKyc1(
    driverId: string,
    kycData: CreateKyc1Dto,
  ): Promise<kyc1PersonalInfo | null> {
    const driver = await this.driverRepository.findById(driverId);
    if (!driver) {
      throw new NotFoundException('Driver not found');
    }
    const country = await this.countryRepository.findById(kycData.countryId);
    if (!country) {
      throw new NotFoundException('Country not found');
    }

    const existingKyc1 = await this.fetchKyc1ByDriverId(driverId);
    if (existingKyc1) {
      return existingKyc1;
    }

    const kyc1 = await this.kyc1Repository.create({
      ...kycData,
      driverId,
      countryId: kycData.countryId,
      dateOfBirth: new Date(kycData.dateOfBirth),
    });

    if (kyc1.id) {
      await this.driverRepository.update(driverId, {
        kycCompleted: KYC_COMPLETED.PERSONAL_INFORMATION,
      });
    }

    return kyc1;
  }

  async fetchKyc1ByDriverId(
    driverId: string,
  ): Promise<kyc1PersonalInfo | null> {
    return await this.kyc1Repository.findByDriverId(driverId);
  }

  async fetchKyc2ByDriverId(
    driverId: string,
  ): Promise<kyc2IdInformation | null> {
    return await this.kyc2Repository.findByDriverId(driverId);
  }

  async fetchKyc3ByDriverId(
    driverId: string,
  ): Promise<kyc3ResidentialInformation | null> {
    return await this.kyc3Repository.findByDriverId(driverId);
  }

  async createKyc2(
    driverId: string,
    kycData: CreateKyc2Dto,
  ): Promise<kyc2IdInformation | null> {
    const driver = await this.driverRepository.findById(driverId);
    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    const existingKyc2 = await this.fetchKyc2ByDriverId(driverId);

    if (existingKyc2) {
      return existingKyc2;
    }

    const kyc2 = await this.kyc2Repository.create({
      ...kycData,
      driverId,
    });

    if (kyc2.id) {
      await this.driverRepository.update(driverId, {
        kycCompleted: KYC_COMPLETED.IDENTITY_INFORMATION,
      });
    }

    return kyc2;
  }

  async createKyc3(
    driverId: string,
    kycData: CreateKyc3Dto,
  ): Promise<kyc3ResidentialInformation | null> {
    const driver = await this.driverRepository.findById(driverId);
    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    const state = await this.stateService.findById(kycData.stateId);
    if (!state) {
      throw new NotFoundException('State not found');
    }

    const existingKyc3 = await this.kyc3Repository.findByDriverId(driverId);
    if (existingKyc3) {
      return existingKyc3;
    }

    const kyc3 = await this.kyc3Repository.create({
      ...kycData,
      driverId,
    });

    if (kyc3.id) {
      await this.driverRepository.update(driverId, {
        kycCompleted: KYC_COMPLETED.RESIDENTIAL_INFORMATION,
      });
    }

    return kyc3;
  }

  async getAllKycByDriverId(driverId: string): Promise<{
    kyc1: kyc1PersonalInfo | null;
    kyc2: kyc2IdInformation | null;
    kyc3: kyc3ResidentialInformation | null;
  }> {
    const [kyc1, kyc2, kyc3] = await Promise.all([
      this.kyc1Repository.findByDriverId(driverId),
      this.kyc2Repository.findByDriverId(driverId),
      this.kyc3Repository.findByDriverId(driverId),
    ]);

    return {
      kyc1,
      kyc2,
      kyc3,
    };
  }
}
