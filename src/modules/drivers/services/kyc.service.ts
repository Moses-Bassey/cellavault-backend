import { ConflictException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { kyc1PersonalInfo } from '../entities/kyc1-personal-Info.entity';
import { kyc2IdInformation } from '../entities/kyc2-Id-Information.entity';
import { kyc3ResidentialInformation } from '../entities/kyc3-residential-Information.entity';
import { Kyc1Repository } from '../repositories/kyc1.repository';
import { Kyc2Repository } from '../repositories/kyc2.repository';
import { Kyc3Repository } from '../repositories/kyc3.repository';
import { CreateKyc1Dto, CreateKyc2Dto, CreateKyc3Dto } from '../dto/kyc.dto';
import { DriverRepository } from '../repositories';
import { ApiResponse, ResponseUtil } from 'src/utils/response.utils';
import { CountryRepository } from 'src/modules/countries/repositories';

@Injectable()
export class KycService {
  constructor(
    private readonly kyc1Repository: Kyc1Repository,
    private readonly kyc2Repository: Kyc2Repository,
    private readonly kyc3Repository: Kyc3Repository,
    private readonly driverRepository: DriverRepository,
    private readonly countryRepository: CountryRepository,
  ) {}

  async createKyc1(
    driverId: string,
    kycData: CreateKyc1Dto,
  ): Promise<ApiResponse<kyc1PersonalInfo | null>> {
    try {
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
        throw new ConflictException('KYC1 (Personal Information) already exists for this driver');
      }
      
      const kyc1 = await this.kyc1Repository.create({
        ...kycData,
        driverId,
        countryId: kycData.countryId,
        dateOfBirth: new Date(kycData.dateOfBirth),
      });
      return ResponseUtil.success(kyc1, 'KYC1 record created successfully', HttpStatus.CREATED);
    } catch (error) {
      return ResponseUtil.errorFromException(error, 'Failed to create KYC1 record');
    }   
  }


  async fetchKyc1ByDriverId(driverId: string): Promise<kyc1PersonalInfo | null> {
    return await this.kyc1Repository.findByDriverId(driverId);
  }

  async fetchKyc2ByDriverId(driverId: string): Promise<kyc2IdInformation | null> {
    return await this.kyc2Repository.findByDriverId(driverId);
  }

  async fetchKyc3ByDriverId(driverId: string): Promise<kyc3ResidentialInformation | null> {
    return await this.kyc3Repository.findByDriverId(driverId);
  }

  async createKyc2(
    driverId: string,
    kycData: CreateKyc2Dto,
  ): Promise<ApiResponse<kyc2IdInformation | null>> {
    try {
      const driver = await this.driverRepository.findById(driverId);
      if (!driver) {
        throw new NotFoundException('Driver not found');
      }

      const existingKyc2 = await this.fetchKyc2ByDriverId(driverId);

      if (existingKyc2) {
        throw new ConflictException('KYC2 (ID Information) already exists for this driver');
      }

      const kyc2 = await this.kyc2Repository.create({
        ...kycData,
        driverId,
      });

      return ResponseUtil.success(kyc2, 'KYC2 record created successfully', HttpStatus.CREATED); 
      
    } catch (error) {
      return ResponseUtil.errorFromException(error, 'Failed to create KYC2 record');
    }
  }


  async createKyc3(
    driverId: string,
    kycData: CreateKyc3Dto,
  ): Promise<ApiResponse<kyc3ResidentialInformation | null>> {
    try {
      const driver = await this.driverRepository.findById(driverId);
      if (!driver) {
        throw new NotFoundException('Driver not found');
      }

      const existingKyc3 = await this.kyc3Repository.findByDriverId(driverId);
      if (existingKyc3) {
        throw new ConflictException('KYC3 (Residential Information) already exists for this driver');
      }

      const kyc3 = await this.kyc3Repository.create({
        ...kycData,
        driverId,
      });

      return ResponseUtil.success(kyc3, 'KYC3 record created successfully', HttpStatus.CREATED); 
    } catch (error) {
      return ResponseUtil.errorFromException(error, 'Failed to create KYC3 record');
    }
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

