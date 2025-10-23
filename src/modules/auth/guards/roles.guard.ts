import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserType } from '../../../enums/user-type.enum';
import { USERTYPES_KEY } from '../decorators/roles.decorator';
import { JwtAuthPayload } from '../auth.interface';

interface AuthenticatedRequest extends Request {
  user: JwtAuthPayload;
}

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserType[]>(
      USERTYPES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest<AuthenticatedRequest>();

    this.logger.debug(
      `User role: ${user?.userType}, User orgRole: ${user?.userType}`,
    );

    if (!user?.userType) {
      this.logger.warn('User role is missing from JWT payload');
      return false;
    }

    // Check if the user's role matches any of the required roles
    const hasRole = requiredRoles.includes(user.userType as UserType);

    this.logger.debug(`Role check result: ${hasRole}`);

    return hasRole;
  }
}
