import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
// import { AdminService } from '../../admins/services/admin.service';

@Injectable()
export class AuthListener {
  private readonly logger = new Logger(AuthListener.name)
  constructor(/*private readonly adminService: AdminService*/) {}

  // @OnEvent('newLoginEvent')
  // async handlNewLoginEvent(adminId: string) {
  //   try {
  //     this.logger.log('updating last login');
  //     this.logger.log('updating admin: ', adminId);
  //     await this.adminService.updateNewLogin(adminId);
  //   } catch (error) {
  //     console.error('Failed to save new login time', error);
  //   }
  // }
}
