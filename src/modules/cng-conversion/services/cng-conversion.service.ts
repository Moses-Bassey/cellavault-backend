import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CngConversion } from '../entities/cng-conversion.entity';
import { CngConversionRepository } from '../repositories/cng-conversion.repository';
import { CreateCngConversionDto } from '../dto/cng-conversion.dto';
import { ENGINE_CONDITION } from 'src/enums/engine-condition.enum';
import { FUEL_TYPE } from 'src/enums/fuel-type.enum';
import { TRANSMISSION } from 'src/enums/transmission.enum';
import { CNG_CONVERSION_STATUS } from 'src/enums/cng-conversion-status.enum';
import { UserService } from 'src/modules/users/services/user.service';
import { UserType } from 'src/enums/user-type.enum';

@Injectable()
export class CngConversionService {

  constructor(
    private readonly cngConversionRepository: CngConversionRepository,
    private readonly userService: UserService,
  ) {}

  fetchTransmission() {
    const transmissions = Object.values(TRANSMISSION);
    const fuelTypes = Object.values(FUEL_TYPE);
    const engine_condition = Object.values(ENGINE_CONDITION)
    return {
      transmissions,
      fuelTypes,
      engine_condition
    }

  }

  async fetchUserCngConversions(userId: string, page: number, limit: number) {
    try {
      const offset = (page - 1) * limit;
      const conversions = await this.cngConversionRepository.findAll({
        where: {
          userId: userId,
        },
        order: [['createdAt', 'DESC']],
        limit: limit,
        offset: offset,
      });
      return {
        fetchTransmission: await this.fetchTransmission(),
        conversions
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async fetchUserCngConversionsStats(userId: string) {
    try{
        const pending = await this.cngConversionRepository.count({
            where: {
              userId: userId,
              status: CNG_CONVERSION_STATUS.PENDING,
            },
          });
          
        const completed = await this.cngConversionRepository.count({
            where: {
            userId: userId,
            status: CNG_CONVERSION_STATUS.APPROVED,
            },
        });

        return {
            pending: pending,
            completed: completed
        }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findById(id: string): Promise<CngConversion | null> {
    return await this.cngConversionRepository.findById(id);
  }

  async findAll(): Promise<CngConversion[]> {
    return await this.cngConversionRepository.findAll();
  }

  async create(userId: string, userType: UserType, cngConversionData: CreateCngConversionDto): Promise<CreateCngConversionDto> {
    try{
        let validUserId: string | undefined = undefined;
    
    if (userType === UserType.USER) {
      // Validate that the user exists
      const user = await this.userService.fetchUser(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      validUserId = userId;
    }
    // For DRIVER or other types, userId will be undefined (null in DB)

    const data = await this.cngConversionRepository.create({
      fullName: cngConversionData.fullName,
      userId: validUserId,
      email: cngConversionData.email,
      contactPhone: cngConversionData.contactPhone,
      nin: cngConversionData.nin,
      vehicleRegisterationNo: cngConversionData.vehicleRegisterationNo,
      brandOfVehicle: cngConversionData.brandOfVehicle,
      color: cngConversionData.color,
      makeOfVehicle: cngConversionData.makeOfVehicle,
      yearOfManufacture: cngConversionData.yearOfManufacture,
      vinNumber: cngConversionData.vinNumber,
      registerationExpiryDate: new Date(cngConversionData.registerationExpiryDate),
      engineCapacity: cngConversionData.engineCapacity,
      cylinder: cngConversionData.cylinder,
      engineCondition: cngConversionData.engineCondition,
      fuelType: cngConversionData.fuelType,
      transmission: cngConversionData.transmission,
      mileage: cngConversionData.mileage,
      usualRoute: cngConversionData.usualRoute,
      operatingMotorPark: cngConversionData.operatingMotorPark,
      conversionCenter: cngConversionData.conversionCenter,
      residentialState: cngConversionData.residentialState,
      lga: cngConversionData.lga,
      address: cngConversionData.address,
      additionalNote: cngConversionData.additionalNote,
    });

    return cngConversionData;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
    
  }

  async update(id: string, cngConversionData: Partial<CngConversion>): Promise<[number, CngConversion[]]> {
    return await this.cngConversionRepository.update(id, cngConversionData);
  }
}

