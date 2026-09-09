import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Admin } from '../entities/admin.entity';
import { AdminRepository } from '../repositories/admin.repository';
import {
  PassengerAccountDto,
} from '../../../shared/dto/user.dto';
import { deriveUserStatus } from '../../../utils/user-status.util';
import { UserListItemDto, UserListPageDto } from '../dto/admin.dto';
import { UserStatusFilter } from '../../../enums/user-status.enum';
// import { PasswordUtil } from 'src/utils/password.util';
import { decodeCursor } from '../../../utils/cursor.util';
import { parseISODateOrUndefined } from '../../../utils/date.util';
import { PasswordUtil } from '../../../utils/password.util';

@Injectable()
export class AdminService {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly configService: ConfigService,
  ) {}

  async fetchAdmin(id: string): Promise<Admin | null> {
    try {
      const admin = await this.adminRepository.fetchUser(id);
      if (!admin) {
        throw new NotFoundException('User not found!');
      }
      return admin;
    } catch (error: unknown) {
      throw new NotFoundException('User not found!');
    }
  }

  // async findAll(params: {
  //   search?: string;
  //   status?: UserStatusFilter;
  //   limit?: number;
  //   cursor?: string;
  // }): Promise<UserListPageDto> {
  //   const limit = Math.min(Math.max(Number(params.limit ?? 10), 1), 50);

  //   const cursor = decodeCursor(params.cursor);
  //   const search = params.search?.trim();

  //   // ── 1. Paginated users ) ─────────────
  //   const { admins, nextCursor } = await this.adminRepository.findAll({
  //     search,
  //     status: params.status,
  //     limit,
  //     cursor,
  //   });

  //   // ── 3. Merge + shape the response ─────────────────────────────────────────
  //   const items: UserListItemDto[] = admins.map((admin) => {

  //     return {
  //       id: admin.id,
  //       fullName: admin.fullName,
  //       phoneNo: admin.phoneNo,
  //       email: admin.email,
  //       imageUrl: admin.imageUrl ?? null,
  //       status: deriveUserStatus(admin),
  //       joinDate: admin.createdAt.toISOString(),
  //       createdAt: admin.createdAt,
  //       updatedAt: admin.updatedAt,
  //     };
  //   });

  //   return {
  //     items,
  //     nextCursor,
  //   };
  // }

  // async findById(id: string) {
  //   const user = await this.userService.fetchUser(id);
  //   return user;
  // }

}
