import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { FeesRepository } from '../repositories/fees.repository';
import { RedisService } from '../../../services/redis/services/redis.service';
import {
  type FeeChangedEvent,
} from '../events/fees.event';
import { FEE_EVENTS } from 'src/enums/fees-events.enum';

@Injectable()
export class FeeRedisListener {
  private readonly logger =
    new Logger(FeeRedisListener.name);

  constructor(
    private readonly feeRepository: FeesRepository,
    private readonly redisService: RedisService,
  ) {}

  @OnEvent(FEE_EVENTS.CREATED)
  async handleCreate(
    payload: FeeChangedEvent,
  ) {
    await this.handleUpsert(
      payload.feeId,
    );
  }

  @OnEvent(FEE_EVENTS.UPDATED)
  async handleUpdate(
    payload: FeeChangedEvent,
  ) {
    await this.handleUpsert(
      payload.feeId,
    );
  }

  @OnEvent(FEE_EVENTS.DELETED)
  async handleDelete(
    payload: FeeChangedEvent,
  ) {
    const redis =
      this.redisService.getClient();

    const fee =
      await this.feeRepository.findById(
        payload.feeId,
      );

    if (!fee) {
      return;
    }

    await redis.del(
      `fee:class:${fee.className}`,
    );

    this.logger.log(
      `Deleted fee cache for ${fee.className}`,
    );
  }

  private async handleUpsert(
    feeId: string,
  ) {
    const fee =
      await this.feeRepository.findById(
        feeId,
      );

    if (!fee) {
      return;
    }

    const redis =
      this.redisService.getClient();

    await redis.set(
      `fee:class:${fee.className}`,
      JSON.stringify({
        id: fee.id,
        className: fee.className,
        baseFee: Number(fee.baseFee),
        piBaseFee: Number(
          fee.piBaseFee,
        ),
        peppCoinBaseFee: Number(
          fee.peppCoinBaseFee,
        ),
        vehicleSeaters:
          fee.vehicleSeaters,
        carType: fee.carType,
      }),
    );

    this.logger.log(
      `Fee cache updated for ${fee.className}`,
    );
  }
}