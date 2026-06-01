import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { RedisService } from '../services/redis/services/redis.service';
import { UserType } from '../enums/user-type.enum';
import { AuthenticatedRequest } from '../modules/auth/guards/roles.guard';

const ADMIN_USER_TYPES = new Set([
  UserType.SUPER_ADMIN,
  UserType.PEPP_ADMIN,
  UserType.PEPP_MANAGER,
]);

/**
 * Applied globally (or to the admin router guard group).
 * On every authenticated admin API request, refreshes two Redis TTL keys
 * that power the real-time "online / idle / offline" status on the activity
 * monitor. Fire-and-forget — never blocks the response pipeline.
 */
@Injectable()
export class AdminActivityInterceptor implements NestInterceptor {
  constructor(private readonly redisService: RedisService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const adminId = req.user?.userId as string | undefined;
    const userType = req.user?.userType as UserType | undefined;

    // console.log('Interceptor fired');
    if (adminId && userType && ADMIN_USER_TYPES.has(userType)) {
      this.redisService.refreshAdminActivity(adminId); // intentionally no await
    }

    return next.handle();
  }
}