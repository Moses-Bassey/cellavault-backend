import { Injectable } from '@nestjs/common';

import { RefreshToken } from '../entities/refresh-token.entity';

@Injectable()
export class RefreshTokenRepository {
  async create(data: Partial<RefreshToken>): Promise<RefreshToken> {
    return RefreshToken.create(data as any);
  }

  async findByTokenHash(
    token: string,
  ): Promise<RefreshToken | null> {
    return RefreshToken.findOne({
      where: {
        token,
      },
      include: [
        {
          association: 'user',
        },
      ],
    });
  }

  async findById(id: string): Promise<RefreshToken | null> {
    return RefreshToken.findByPk(id);
  }

  async revoke(
    refreshToken: RefreshToken,
    replacedByTokenId?: string,
  ): Promise<RefreshToken> {
    await refreshToken.update({
      revokedAt: new Date(),
      replacedByTokenId: replacedByTokenId ?? null,
    });

    return refreshToken;
  }

  async revokeAllForUser(userId: string): Promise<number> {
    const [affectedRows] = await RefreshToken.update(
      {
        revokedAt: new Date(),
      },
      {
        where: {
          userId,
          revokedAt: null,
        },
      },
    );

    return affectedRows;
  }
}