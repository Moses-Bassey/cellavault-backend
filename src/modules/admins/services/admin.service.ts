import {
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AdminRepository } from '../repositories/admin.repository';
import { Admin } from '../entities/admin.entity';
import { decodeCursor } from '../../../utils/cursor.util';
import { InvitationStatus } from '../../../enums/invite-status.enum';

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

  async getAdminSummary() {
    const data = await this.adminRepository.getAdminSummary();
    if (!data) throw new NotFoundException('Admin  summary not found');

    return data;
  }

  async findAll(params?: {
    limit?: number;
    cursor?: string;
  }): Promise<{ items: any[]; nextCursor: string | null }> {
    const limit = Math.min(Math.max(Number(params?.limit ?? 20), 1), 50);

    const decodedCursor = decodeCursor(params?.cursor);

    const { admins, nextCursor } = await this.adminRepository.findAll({
      limit,
      cursor: decodedCursor,
    });

    const items = admins.map((admin) => {
      const initials = this.getInitials(admin.fullName);

      return {
        id: admin.id,

        initials,

        name: admin.fullName,

        email: admin.email,

        phone: admin.phoneNo,

        imageUrl: admin.imageUrl,

        role: this.formatRole(admin.role),

        roleKey: admin.role,

        status: admin.inviteStatus.toLowerCase(),

        activity: this.buildActivity(admin),
      };
    });

    this.logger.log(
      `Fetched ${admins.length} admins (cursor: ${params?.cursor ?? 'none'})`,
    );

    return {
      items,
      nextCursor,
    };
  }

  /* -------------------------------------------------------------------------- */
  /*                               HELPER METHODS                               */
  /* -------------------------------------------------------------------------- */

  private getInitials(name: string): string {
    return name
      ?.split(' ')
      ?.map((part) => part.charAt(0).toUpperCase())
      ?.slice(0, 2)
      ?.join('');
  }

  private formatRole(role: string): string {
    return role
      .split('_')
      .map(
        (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
      )
      .join(' ');
  }

  private buildActivity(admin: Admin): string {
    const formatDate = (date?: Date | null) => {
      if (!date) return null;

      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(new Date(date));
    };

    switch (admin.inviteStatus) {
      case InvitationStatus.ACTIVE:
        return admin.invitedAcceptedAt
          ? `Joined ${formatDate(admin.invitedAcceptedAt)}`
          : `Joined ${formatDate(admin.createdAt)}`;

      case InvitationStatus.PENDING:
        return `Invited ${formatDate(admin.createdAt)}`;

      case InvitationStatus.EXPIRED:
        return `Invite expired ${formatDate(admin.createdAt)}`;

      default:
        return '-';
    }
  }
}
