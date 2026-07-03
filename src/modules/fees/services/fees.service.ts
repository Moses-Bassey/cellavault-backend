import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FeesRepository } from '../repositories/fees.repository';
import { AdminService } from '../../admins/services/admin.service';
import { CreateFeeDto, UpdateFeeDto } from '../dto/fees.dto';
import {
  decodeCursor,
} from '../../../utils/cursor.util';
import { FEE_EVENTS } from 'src/enums/fees-events.enum';

@Injectable()
export class FeesService {
  constructor(
    private readonly feeRepository: FeesRepository,
    private readonly eventEmitter: EventEmitter2,
    private readonly adminService: AdminService,
  ) {}

  async createFee(
    dto: CreateFeeDto,
  ) {
    const existing =
      await this.feeRepository.findByClassName(
        dto.className.trim(),
      );

    if (existing) {
      throw new BadRequestException(
        'Fee class already exists',
      );
    }

    const created = await this.feeRepository.createFee({
      ...dto,
      className:
        dto.className.trim(),
    });
    if (!created) throw new BadRequestException('Failed to create fee');
    await this.eventEmitter.emitAsync(
      FEE_EVENTS.CREATED,
      {
        feeId: created.id,
      },
    );
    return dto;
  }

  async updateFee(
    id: string,
    dto: UpdateFeeDto,
  ) {
    const fee =
      await this.feeRepository.findById(id);

    if (!fee) {
      throw new NotFoundException(
        'Fee not found',
      );
    }

    const updated = await this.feeRepository.updateFee(
      id,
      dto,
    );
    if (!updated || updated === 0) throw new BadRequestException('Failed to update fee');
    await this.eventEmitter.emitAsync(
      FEE_EVENTS.UPDATED,
      {
        feeId: id,
      },
    );
    return updated;
  }

  async getFee(id: string) {
    const fee =
      await this.feeRepository.findById(id);

    if (!fee) {
      throw new NotFoundException(
        'Fee not found',
      );
    }

    return fee;
  }

  async getFees(query: {
    limit?: string;
    cursor?: string;
    search?: string;
  }) {
    const limit = Math.min(
      Number(query.limit) || 20,
      100,
    );

    return this.feeRepository.fetchFees({
      limit,
      search: query.search,
      cursor: decodeCursor(
        query.cursor,
      ),
    });
  }

  async deleteFee(id: string, adminId: string) {
    const admin = await this.adminService.findById(adminId);
    if (!admin) throw new NotFoundException('Admin not found');

    const fee =
      await this.feeRepository.findById(id);

    if (!fee) {
      throw new NotFoundException(
        'Fee not found',
      );
    }

    const deleted =
      await this.feeRepository.deleteFee(id);

    if (!deleted) {
      throw new BadRequestException(
        'Failed to delete fee',
      );
    }

    await this.eventEmitter.emitAsync(
      FEE_EVENTS.DELETED,
      {
        feeId: id,
      },
    );

    return {
      id,
      deleted: true,
    };
  }
}