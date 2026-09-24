import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';

import { ConfigService } from '@nestjs/config';

import { RefreshTokenRepository } from '../repositories/refresh-token.repository';
import { User } from '../../../modules/users/entities/user.entity';

interface CreateRefreshTokenOptions {
  rememberMe: boolean;
  userAgent?: string;
  ipAddress?: string;
}

interface RefreshTokenResult {
  token: string;
  recordId: string;
}

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly configService: ConfigService,
  ) {}

  async create(
    user: User,
    options: CreateRefreshTokenOptions,
  ): Promise<RefreshTokenResult> {
    const rawToken = this.generateToken();

    const token = this.hashToken(rawToken);

    const expiresAt = this.getExpirationDate(options.rememberMe);

    const refreshToken =
      await this.refreshTokenRepository.create({
        userId: user.id,
        token,
        expiresAt,
        userAgent: options.userAgent ?? null,
        ipAddress: options.ipAddress ?? null,
      });

    return {
      token: rawToken,
      recordId: refreshToken.id,
    };
  }

  async rotate(
    rawToken: string,
    options: CreateRefreshTokenOptions,
  ): Promise<{
    token: string;
    recordId: string;
    user: User;
  }> {
    const tokenHash = this.hashToken(rawToken);

    const existingToken =
      await this.refreshTokenRepository.findByTokenHash(tokenHash);

    if (!existingToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (existingToken.revokedAt) {
      await this.handleTokenReuse(existingToken);

      throw new UnauthorizedException('Invalid refresh token');
    }

    if (existingToken.expiresAt.getTime() <= Date.now()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    const user = existingToken.user;

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const newToken = await this.create(user, options);

    await this.refreshTokenRepository.revoke(
      existingToken,
      newToken.recordId,
    );

    return {
      token: newToken.token,
      recordId: newToken.recordId,
      user,
    };
  }

  async revoke(rawToken: string): Promise<void> {
    const tokenHash = this.hashToken(rawToken);

    const refreshToken =
      await this.refreshTokenRepository.findByTokenHash(tokenHash);

    if (!refreshToken || refreshToken.revokedAt) {
      return;
    }

    await this.refreshTokenRepository.revoke(refreshToken);
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await this.refreshTokenRepository.revokeAllForUser(userId);
  }

  private generateToken(): string {
    return randomBytes(64).toString('hex');
  }

  private hashToken(token: string): string {
    return createHash('sha256')
      .update(token)
      .digest('hex');
  }

  private getExpirationDate(rememberMe: boolean): Date {
    const days = rememberMe ? 30 : 7;

    return new Date(
      Date.now() + days * 24 * 60 * 60 * 1000,
    );
  }

  private async handleTokenReuse(
    refreshToken: any,
  ): Promise<void> {
    /*
     * A previously rotated refresh token has been presented again.
     *
     * At this point you can invalidate the user's remaining
     * refresh-token sessions.
     *
     * This is intentionally done at the user level here.
     */
    if (refreshToken.userId) {
      await this.refreshTokenRepository.revokeAllForUser(
        refreshToken.userId,
      );
    }
  }
}