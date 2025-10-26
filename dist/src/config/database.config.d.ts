import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
export declare const getSequelizeConfig: (configService: ConfigService) => SequelizeModuleOptions;
