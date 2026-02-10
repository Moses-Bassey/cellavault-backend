import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClientDeviceService } from '../services/client-device.service';

@Injectable()
export class ClientDeviceGuard implements CanActivate {
  constructor(private readonly clientDeviceService: ClientDeviceService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const clientDeviceToken = request.headers[
      'x-client-device-token'
    ] as string;

    if (!clientDeviceToken) {
      throw new BadRequestException('x-client-device-token header is required');
    }

    const userId = request.user?.userId;
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    const clientDevice =
      await this.clientDeviceService.findByUserIdAndDeviceToken(
        userId,
        clientDeviceToken,
      );

    if (!clientDevice) {
      throw new UnauthorizedException('Invalid client device token');
    }

    request.clientDevice = clientDevice;

    return true;
  }
}
