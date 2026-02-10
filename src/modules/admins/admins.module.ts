import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from '../auth/auth.module';
import { Admin } from './entities/admin.entity';
import { AuthAdminController } from './controllers/auth.admin.controller';
import { AdminController } from './controllers/admin.controller';
import { UserAdminController } from './controllers/users.admin.controller';
import { AuthAdminService } from './services/auth.admin.service';
import { AdminService } from './services/admin.service';
import { UserAdminService } from './services/user.admin.service';
import { AdminRepository } from './repositories/admin.repository';
import { ClientDevicesModule } from '../client-devices/client-devices.module';
import { DriversModule } from '../drivers/drivers.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Admin]),
    ClientDevicesModule,
    AuthModule,
    DriversModule,
    UsersModule,
  ],
  controllers: [AuthAdminController, AdminController, UserAdminController],
  providers: [
    AdminService,
    AdminRepository,
    AuthAdminService,
    UserAdminService,
  ],
  exports: [AdminService, AdminRepository],
})
export class AdminModule {}
