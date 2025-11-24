import { BadRequestException, Injectable } from '@nestjs/common';
import { CngStation } from '../entities/cng-station.entity';
import { CngStationRepository } from '../repositories/cng-station.repository';

@Injectable()
export class CngStationService {
 
  constructor(
    private readonly cngStationRepository: CngStationRepository,
  ) {}

  async findAll(): Promise<CngStation[]> {
    return await this.cngStationRepository.findAll();
  }
}

