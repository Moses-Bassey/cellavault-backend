import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Customer } from './entities/customer.entity';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MailModule } from 'src/services/mail/mail.module';
import { TokenModule } from 'src/services/token/token.module';
// import { CustomerRepository } from './repositories/customer.repository';

@Module({
  imports: [SequelizeModule.forFeature([Customer])],
  providers: [],
  controllers: [],
  exports: [],
})
export class CustomerModule {}
