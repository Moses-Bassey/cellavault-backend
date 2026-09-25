import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MailModule } from 'src/services/mail/mail.module';
import { TokenModule } from 'src/services/token/token.module';
// import { AuthController } from './controllers/auth.controller';
// import { StudentAuthController } from './controllers/vendor.auth.controller';
// import { TutorAuthController } from './controllers/customer.auth.controller';
import { AuthListener } from './listeners/auth.listener';
// import { AuthService } from './auth.service';
import { AdminsModule } from '../admins/admin.module';
// import { StudentsModule } from '../students/student.module';
// import { TutorsModule } from '../tutors/tutor.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    TokenModule,
    MailModule,
    AdminsModule,
    // StudentsModule,
    // TutorsModule,
  ],
  providers: [ AuthListener],
  controllers: [],
  exports: [],
})
export class AuthModule {}
