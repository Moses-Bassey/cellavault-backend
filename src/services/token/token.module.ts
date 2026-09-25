import { Global, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { Token } from './entities';
import { TokenService } from './token.service';
import { TokenRepository } from './repositories/token.repository';
import { ConfigService } from '@nestjs/config';
import type { StringValue } from 'ms';
import { RefreshTokenService } from './services/refresh-token.service';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';
import { RefreshToken } from './entities/refresh-token.entity';

@Global()
@Module({
  imports: [
    SequelizeModule.forFeature([Token, RefreshToken]),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret:
            configService.get<string>('app.jwtSecret') || 'default-secret',
          signOptions: {
            expiresIn:
              (configService.get<string | number>(
                'app.jwtExpiresIn',
              ) as StringValue) ?? '12hr',
          },
        };
      },
    }),
  ],
  providers: [TokenService, TokenRepository, RefreshTokenService, RefreshTokenRepository],
  exports: [TokenService, TokenRepository, RefreshTokenRepository, RefreshTokenService],
})
export class TokenModule {}
