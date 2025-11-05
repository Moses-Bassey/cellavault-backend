import { HttpStatus, Injectable } from '@nestjs/common';
import { State } from '../entities/state.entity';
import { StateRepository } from '../repositories/state.repository';
import { ApiResponse, ResponseUtil } from 'src/utils/response.utils';

@Injectable()
export class StateService {
  constructor(private readonly stateRepository: StateRepository) {}

  async findById(id: string): Promise<State | null> {
    return await this.stateRepository.findById(id);
  }

  async findByCountryId(countryId: string) {
    try {
      const states = await this.stateRepository.findByCountryId(countryId);
      return ResponseUtil.success(states, 'States retrieved successfully', HttpStatus.OK);
    } catch (error: unknown) {
      return ResponseUtil.errorFromException(
        error,
        'An error occurred during find states by country', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(options?: any) {
    try {
      const states = await this.stateRepository.findAll(options);
      return ResponseUtil.success(states, 'States retrieved successfully', HttpStatus.OK);
    } catch (error: unknown) {
      return ResponseUtil.errorFromException(
        error,
        'An error occurred during find all states', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async create(stateData: Partial<State>): Promise<State> {
    return await this.stateRepository.create(stateData);
  }

  async update(id: string, stateData: Partial<State>): Promise<[number, State[]]> {
    return await this.stateRepository.update(id, stateData);
  }

  async delete(id: string): Promise<number> {
    return await this.stateRepository.delete(id);
  }

  async restore(id: string): Promise<void> {
    await this.stateRepository.restore(id);
  }
}

