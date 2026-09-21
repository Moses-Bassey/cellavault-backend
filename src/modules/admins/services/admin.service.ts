import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Admin } from '../entities/admin.entity';
import { AdminRepository } from '../repositories/admin.repository';
// import { PasswordUtil } from 'src/utils/password.util';
import { decodeCursor } from '../../../utils/cursor.util';
import { parseISODateOrUndefined } from '../../../utils/date.util';
import { PasswordUtil } from '../../../utils/password.util';

import {
  AdminProfile,
  ChangeAdminPasswordData,
  UpdateAdminProfileData,
} from '../interfaces/admin.interface';
@Injectable()
export class AdminService {
  constructor(
    private readonly adminRepository: AdminRepository,
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

  async getMyProfile(adminId: string): Promise<AdminProfile> {
    const admin = await this.adminRepository.findProfileById(adminId);

    if (!admin) {
      throw new NotFoundException('Admin account not found');
    }

    return admin;
  }

  async updateMyProfile(
    adminId: string,
    data: UpdateAdminProfileData,
  ): Promise<AdminProfile> {
    const admin = await this.adminRepository.findById(adminId);

    if (!admin) {
      throw new NotFoundException('Admin account not found');
    }

    if (!admin.isActive) {
      throw new UnauthorizedException('Admin account is inactive');
    }

    const updateData: Partial<Admin> = {};

    if (data.email !== undefined) {
      const email = data.email.trim().toLowerCase();

      if (email !== admin.email.toLowerCase()) {
        const existingAdmin =
          await this.adminRepository.findByEmailExcludingId(
            email,
            adminId,
          );

        if (existingAdmin) {
          throw new ConflictException(
            'An admin account with this email already exists',
          );
        }

        updateData.email = email;
      }
    }

    if (Object.keys(updateData).length > 0) {
      await this.adminRepository.update(adminId, updateData);
    }

    const updatedAdmin =
      await this.adminRepository.findProfileById(adminId);

    if (!updatedAdmin) {
      throw new NotFoundException('Admin account not found');
    }

    return updatedAdmin;
  }

  async changeMyPassword(
    adminId: string,
    data: ChangeAdminPasswordData,
  ): Promise<void> {
    const admin = await this.adminRepository.findById(adminId);

    if (!admin) {
      throw new NotFoundException('Admin account not found');
    }

    if (!admin.isActive) {
      throw new UnauthorizedException('Admin account is inactive');
    }

    const isCurrentPasswordValid =
      await PasswordUtil.verifyPassword(
        data.currentPassword,
        admin.password,
      );

    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException(
        'Current password is incorrect',
      );
    }

    if (data.currentPassword === data.newPassword) {
      throw new BadRequestException(
        'New password must be different from the current password',
      );
    }

    const hashedPassword = await PasswordUtil.hashPassword(
      data.newPassword,
    );

    await this.adminRepository.update(adminId, {
      password: hashedPassword,
    });
  }
}