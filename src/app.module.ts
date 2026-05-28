import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { SequelizeModule } from '@nestjs/sequelize';
import appConfig from './config/app.config';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { DriversModule } from './modules/drivers/drivers.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { CountriesModule } from './modules/countries/countries.module';
import { ClientDevicesModule } from './modules/client-devices/client-devices.module';
import { AdminModule } from './modules/admins/admins.module';
import { TripsModule } from './modules/trips/trips.module';
import { StationsModule } from './modules/stations/station.module';
import { MapModule } from './modules/map/map.module';
// import { SearchModule } from './modules/search/search.module';
import { PeppcoinModule } from './modules/peppcoin/peppcoin.module';
import { FeesModule } from './modules/fees/fees.module';
import { TokenModule } from './services/token/token.module';
import { MailModule } from './services/mail/mail.module';
import { SmsModule } from './services/sms/sms.module';
import { AxiosModule } from './services/axios/axios.module';
import { RedisModule } from './services/redis/redis.module';
import { ApiKeyInterceptor } from './interceptors/api-key.interceptors';

import { User } from './modules/users/entities';
import { Driver } from './modules/drivers/entities';
import { Admin } from './modules/admins/entities/admin.entity';
import { Guarantor } from './modules/drivers/entities/guarantor.entity';
import { kyc1PersonalInfo } from './modules/drivers/entities/kyc1-personal-Info.entity';
import { kyc2IdInformation } from './modules/drivers/entities/kyc2-Id-Information.entity';
import { kyc3ResidentialInformation } from './modules/drivers/entities/kyc3-residential-Information.entity';
import { Vehicle } from './modules/drivers/entities/vehicle.entity';
import { VehicleRegistration } from './modules/drivers/entities/vehicle-registration.entity';
import { PeppDriverVehicles } from './modules/drivers/entities/pepp-driver-vehicles.entity';
import { Country, State, LGA } from './modules/countries/entities';
import { ClientDevice } from './modules/client-devices/entities/client-device.entity';
import { Token } from './services/token/entities';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
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
        kyc1PersonalInfo,
        kyc2IdInformation,
        kyc3ResidentialInformation,
        Vehicle,
        VehicleRegistration,
        PeppDriverVehicles,
        Country,
        State,
        LGA,
        ClientDevice,
        Token,
        Admin,
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
    DashboardModule,
    ClientDevicesModule,
    AdminModule,
    TripsModule,
    StationsModule,
    MapModule,
    // SearchModule,
    PeppcoinModule,
    FeesModule,
    TokenModule,
    RedisModule,
    MailModule,
    SmsModule,
    AxiosModule,
  ],
  controllers: [AppController],
  providers: [AppService, ApiKeyInterceptor],
})
export class AppModule {}
