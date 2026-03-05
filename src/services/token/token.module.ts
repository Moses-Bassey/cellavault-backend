import { Global, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { Token } from './entities';
import { TokenService } from './token.service';
import { TokenRepository } from './repositories/token.repository';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    SequelizeModule.forFeature([Token]),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret:
            configService.get<string>('app.jwtSecret') || 'default-secret',
          signOptions: {
            expiresIn:
              configService.get<string | number>(
                'app.jwtExpiresIn'),
          },
        };
      },
    }),
  ],
  providers: [TokenService, TokenRepository],
  exports: [TokenService, TokenRepository],
})
export class TokenModule {}
