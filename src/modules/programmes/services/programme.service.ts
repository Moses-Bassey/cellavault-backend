// src/modules/programmes/services/programme.service.ts
import { Injectable } from '@nestjs/common';
import { ProgrammeRepository } from '../repositories/programme.repositories';
import { QueryOptions } from 'src/shared/interfaces/query-options.interface';
import { decodeCursor } from 'src/utils/cursor.util';
import { Programme } from '../entities/programme.entity';

@Injectable()
export class ProgrammeService {
  constructor(private readonly programmeRepository: ProgrammeRepository) {}

  async getAllProgrammes(
    params: QueryOptions,
  ): Promise<{ items: Programme[]; nextCursor: string | null }> {
    const limit = Math.min(Math.max(Number(params.limit ?? 10), 1), 50);
    const cursor = params.cursor ? decodeCursor(params.cursor) : undefined;

    const { programmes, nextCursor } = await this.programmeRepository.findAll({
      search: params.search?.trim(),
      limit,
      cursor,
    });

    return {
      items: programmes,
      nextCursor,
    };
  }
}
