import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { AdminRepository } from '../repositories/admin.repository';
import { Admin } from '../entities/admin.entity';
import { decodeCursor } from '../../../utils/cursor.util';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(private readonly adminRepository: AdminRepository) {}

  async findById(id: string): Promise<Admin | null> {
    const admin = await this.adminRepository.findById(id);
    if (!admin) {
      this.logger.warn(`Admin with id=${id} not found`);
      throw new NotFoundException('Admin not found');
    }
    return admin;
  }

  async findAll(params?: {
    limit?: number;
    cursor?: string;
  }): Promise<{ items: Admin[]; nextCursor: string | null }> {
    const limit = Math.min(Math.max(Number(params?.limit ?? 20), 1), 50);

    const decodedCursor = decodeCursor(params?.cursor);

    const { admins, nextCursor } = await this.adminRepository.findAll({
      limit,
      cursor: decodedCursor,
    });

    this.logger.log(
      `Fetched ${admins.length} admins (cursor: ${params?.cursor ?? 'none'})`,
    );

    return {
      items: admins,
      nextCursor,
    };
  }

  // async update(id: string, data: Partial<Admin>): Promise<number | null> {
  //   const [affectedCount] = await this.adminRepository.update(id, data);
  //   console.log('Affected count: ', affectedCount);
  //   if (affectedCount == 0) {
  //     this.logger.warn(`Admin data not updated`);
  //     throw new BadRequestException('Failed to update');
  //   }
  //   this.logger.log(`Admin data updated`);
  //   return affectedCount;
  // }
}
