import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Admin } from './entities/admin.entity';
// import { AdminController } from './controllers/admin.controller';
// import { AdminService } from './services/admin.service';
// import { AdminRepository } from './repositories/admin.repository';

@Module({
  imports: [SequelizeModule.forFeature([Admin])],
  // controllers: [AdminController],
  // providers: [AdminService, AdminRepository],
  // exports: [SequelizeModule, AdminService, AdminRepository],
})
export class AdminsModule {}