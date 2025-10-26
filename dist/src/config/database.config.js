"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSequelizeConfig = void 0;
const getSequelizeConfig = (configService) => ({
    dialect: 'postgres',
    host: configService.get('database.host') || 'localhost',
    port: configService.get('database.port') || 5432,
    username: configService.get('database.username') || 'postgres',
    password: configService.get('database.password') || 'password',
    database: configService.get('database.name') || 'peppcruise',
    autoLoadModels: true,
    synchronize: configService.get('database.synchronize') || false,
    logging: configService.get('database.logging') || false,
});
exports.getSequelizeConfig = getSequelizeConfig;
//# sourceMappingURL=database.config.js.map