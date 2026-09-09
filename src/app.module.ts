import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { SequelizeModule } from '@nestjs/sequelize';
import appConfig from './config/app.config';

import { AuthModule } from './modules/auth/auth.module';
import { AdminsModule } from './modules/admins/admin.module';
import { TutorsModule } from './modules/tutors/tutor.module';
import { StudentsModule } from './modules/students/student.module';
import { StudentProgrammeModule } from './modules/student-programme/student-programme.module';
import { ProgrammeModule } from './modules/programmes/programme.module';
import { CountriesModule } from './modules/countries/countries.module';
import { ClientDevicesModule } from './modules/client-devices/client-devices.module';
import { TokenModule } from './services/token/token.module';
import { MailModule } from './services/mail/mail.module';
import { ApiKeyInterceptor } from './interceptors/api-key.interceptors';
import { AdminActivityInterceptor } from './interceptors/admin-activity.interceptor';


@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres', // Change dialect to postgres
      uri: process.env.DATABASE_URL, // Use the full connection string URL
      autoLoadModels: true,
      synchronize: process.env.NODE_ENV !== 'production', 
      logging: process.env.NODE_ENV === 'development',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false, // Prevents self-signed certificate errors common with hosted DBs like Neon
        },
      },
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
    AdminsModule,
    TutorsModule,
    StudentsModule,
    StudentProgrammeModule,
    ProgrammeModule,
    CountriesModule,
    ClientDevicesModule,
    TokenModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: AdminActivityInterceptor,
    // },
  ],
})
export class AppModule {}
