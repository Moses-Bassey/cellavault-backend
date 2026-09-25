import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MailModule } from 'src/services/mail/mail.module';
import { TokenModule } from 'src/services/token/token.module';
import { UserRepository } from './repositories/user.repository';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  providers: [UserRepository],
  controllers: [],
  exports: [UserRepository],
})
export class UserModule {}
