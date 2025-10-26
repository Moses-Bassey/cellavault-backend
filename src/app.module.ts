import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { SequelizeModule } from '@nestjs/sequelize';
import { Dialect } from 'sequelize';
import appConfig from './config/app.config';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { DriversModule } from './modules/drivers/drivers.module';
import { CountriesModule } from './modules/countries/countries.module';
import { ClientDevicesModule } from './modules/client-devices/client-devices.module';
import { TokenModule } from './services/token/token.module';
import { MailModule } from './services/mail/mail.module';
import { SmsModule } from './services/sms/sms.module';
import { AxiosModule } from './services/axios/axios.module';
import { ApiKeyInterceptor } from './interceptors/api-key.interceptors';

// Import entities from their respective modules
import { User } from './modules/users/entities';
import { Driver } from './modules/drivers/entities';
import { Guarantor } from './modules/drivers/entities/guarantor.entity';
import { Country } from './modules/countries/entities';
import { ClientDevice } from './modules/client-devices/entities/client-device.entity';
import { Token } from './services/token/entities';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    SequelizeModule.forRoot({
      dialect: 'mysql', // MySQL dialect
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadModels: true,
      models: [
        User,
        Driver,
        Guarantor,
        Country,
        ClientDevice,
        Token,
      ],
      synchronize: process.env.NODE_ENV !== 'production', // Disable in production
      logging: process.env.NODE_ENV === 'development',
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get<number>('app.rateLimitTtl') || 60000,
          limit: config.get<number>('app.rateLimitLimit') || 10,
        },
      ],
    }),
    AuthModule,
    UsersModule,
    DriversModule,
    CountriesModule,
    ClientDevicesModule,
    TokenModule,
    MailModule,
    SmsModule,
    AxiosModule,
  ],
  controllers: [AppController],
  providers: [AppService, ApiKeyInterceptor],
})
export class AppModule {}
