import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

import { UserRepository } from '../users/repositories/user.repository';
import { User } from '../users/entities/user.entity';

import { PasswordUtil } from 'src/utils/password.util';
import { TokenService } from 'src/services/token/token.service';

import { UserLoginIdentityType } from 'src/enums';
import { LoginDto } from './dto/auth.dto';

import { ILoginData } from 'src/shared/interfaces/auth.interface';
import { AuthIdentityUtil } from '../../utils/auth-identity.util';

import { RefreshTokenService } from '../../services/token/services/refresh-token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async login(
    data: LoginDto,
    request: Request,
  ): Promise<ILoginData> {
    const identity =
      AuthIdentityUtil.normalize(data.identity);

    const user =
      await this.userRepository.findForAuthentication(
        identity.type,
        identity.value,
      );

    if (!user) {
      throw new UnauthorizedException(
        'Invalid credentials',
      );
    }

    if (!user.isActive) {
      throw new UnauthorizedException(
        'Invalid credentials',
      );
    }

    this.ensureIdentityVerified(
      user,
      identity.type,
    );

    const passwordValid =
      await PasswordUtil.verifyPassword(
        data.password,
        user.password,
      );

    if (!passwordValid) {
      throw new UnauthorizedException(
        'Invalid credentials',
      );
    }

    return this.issueTokens(
      user,
      request,
      data.rememberMe === true,
    );
  }

  async refresh(
    refreshToken: string,
    request: Request,
  ): Promise<ILoginData> {
    const result =
      await this.refreshTokenService.rotate(
        refreshToken,
        {
          rememberMe: false,
          userAgent: request.headers['user-agent'],
          ipAddress: request.ip,
        },
      );

    const accessToken =
      await this.tokenService.generateJWTtoken(
        {
          sub: result.user.id,
          role: result.user.role,
        },
        {
          expiresIn: '15m',
        },
      );

    return {
      accessToken,
      refreshToken: result.token,
      user: {
        id: result.user.id,
        role: result.user.role,
        email: result.user.email,
        phoneNo: result.user.phoneNo,
      },
    };
  }

  async logout(
    refreshToken: string,
  ): Promise<void> {
    await this.refreshTokenService.revoke(
      refreshToken,
    );
  }

  async logoutAll(
    userId: string,
  ): Promise<void> {
    await this.refreshTokenService.revokeAllForUser(
      userId,
    );
  }

  private async issueTokens(
    user: User,
    request: Request,
    rememberMe: boolean,
  ): Promise<ILoginData> {
    const accessToken =
      await this.tokenService.generateJWTtoken(
        {
          sub: user.id,
          role: user.role,
        },
        {
          expiresIn: '15m',
        },
      );

    const refreshToken =
      await this.refreshTokenService.create(
        user,
        {
          rememberMe,
          userAgent: request.headers['user-agent'],
          ipAddress: request.ip,
        },
      );

    return {
      accessToken,
      refreshToken: refreshToken.token,
      user: {
        id: user.id,
        role: user.role,
        email: user.email,
        phoneNo: user.phoneNo,
      },
    };
  }

  private ensureIdentityVerified(
    user: User,
    identityType: UserLoginIdentityType,
  ): void {
    if (
      identityType === UserLoginIdentityType.EMAIL &&
      !user.emailVerifiedAt
    ) {
      throw new UnauthorizedException(
        'Invalid credentials',
      );
    }

    if (
      identityType === UserLoginIdentityType.PHONE_NO &&
      !user.phoneNoVerifiedAt
    ) {
      throw new UnauthorizedException(
        'Invalid credentials',
      );
    }
  }
}