import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MailModule } from 'src/services/mail/mail.module';
import { TokenModule } from 'src/services/token/token.module';
<<<<<<< HEAD
// import { AuthController } from './controllers/auth.controller';
// import { StudentAuthController } from './controllers/vendor.auth.controller';
// import { TutorAuthController } from './controllers/customer.auth.controller';
import { AuthListener } from './listeners/auth.listener';
// import { AuthService } from './auth.service';
import { AdminsModule } from '../admins/admin.module';
// import { StudentsModule } from '../students/student.module';
// import { TutorsModule } from '../tutors/tutor.module';
=======
import { AuthController } from './controllers/auth.controller';
import { AuthListener } from './listeners/auth.listener';
import { AuthService } from './auth.service';
import { UserModule } from '../users/user.module';
>>>>>>> origin/main

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    TokenModule,
    MailModule,
<<<<<<< HEAD
    AdminsModule,
    // StudentsModule,
    // TutorsModule,
  ],
  providers: [ AuthListener],
  controllers: [],
=======
    UserModule
  ],
  providers: [AuthService, AuthListener],
  controllers: [AuthController],
>>>>>>> origin/main
  exports: [],
})
export class AuthModule {}
