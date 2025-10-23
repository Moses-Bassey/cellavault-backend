import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';

export const getSequelizeConfig = (configService: ConfigService): SequelizeModuleOptions => ({
  dialect: 'postgres',
  host: configService.get<string>('database.host') || 'localhost',
  port: configService.get<number>('database.port') || 5432,
  username: configService.get<string>('database.username') || 'postgres',
  password: configService.get<string>('database.password') || 'password',
  database: configService.get<string>('database.name') || 'peppcruise',
  autoLoadModels: true,
  synchronize: configService.get<boolean>('database.synchronize') || false,
  logging: configService.get<boolean>('database.logging') || false,
//   models: Object.values(models),
});
