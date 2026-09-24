import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';

import type { Request, Response } from 'express';

import { AuthService } from '../auth.service';
import { LoginDto } from '../dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() input: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const transport =
      this.getAuthTransport(req);

    const result =
      await this.authService.login(
        input,
        req,
      );

    if (transport === 'cookie') {
      this.setRefreshTokenCookie(
        res,
        result.refreshToken,
      );

      return {
        accessToken: result.accessToken,
        user: result.user,
      };
    }

    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user,
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const transport =
      this.getAuthTransport(req);

    const refreshToken =
      this.extractRefreshToken(
        req,
        transport,
      );

    const result =
      await this.authService.refresh(
        refreshToken,
        req,
      );

    if (transport === 'cookie') {
      this.setRefreshTokenCookie(
        res,
        result.refreshToken,
      );

      return {
        accessToken: result.accessToken,
        user: result.user,
      };
    }

    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const transport =
      this.getAuthTransport(req);

    const refreshToken =
      this.extractRefreshToken(
        req,
        transport,
      );

    await this.authService.logout(
      refreshToken,
    );

    if (transport === 'cookie') {
      this.clearRefreshTokenCookie(res);
    }
  }

  private getAuthTransport(
    req: Request,
  ): 'cookie' | 'body' {
    const transport =
      req.header('X-Auth-Transport');

    if (
      transport !== 'cookie' &&
      transport !== 'body'
    ) {
      throw new BadRequestException(
        'X-Auth-Transport must be either "cookie" or "body"',
      );
    }

    return transport;
  }

  private extractRefreshToken(
    req: Request,
    transport: 'cookie' | 'body',
  ): string {
    if (transport === 'cookie') {
      const refreshToken =
        req.cookies?.refreshToken;

      if (!refreshToken) {
        throw new UnauthorizedException(
          'Refresh token required',
        );
      }

      return refreshToken;
    }

    /*
     * For mobile, the refresh token is sent
     * using the Authorization header:
     *
     * Authorization: Bearer <refresh-token>
     */
    const authorization =
      req.headers.authorization;

    if (
      !authorization ||
      !authorization.startsWith('Bearer ')
    ) {
      throw new UnauthorizedException(
        'Refresh token required',
      );
    }

    const refreshToken =
      authorization.substring(7).trim();

    if (!refreshToken) {
      throw new UnauthorizedException(
        'Refresh token required',
      );
    }

    return refreshToken;
  }

  private setRefreshTokenCookie(
    res: Response,
    refreshToken: string,
  ): void {
    res.cookie(
      'refreshToken',
      refreshToken,
      {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/auth',
      },
    );
  }

  private clearRefreshTokenCookie(
    res: Response,
  ): void {
    res.clearCookie(
      'refreshToken',
      {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/auth',
      },
    );
  }
}