"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_key_interceptors_1 = require("./interceptors/api-key.interceptors");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        bufferLogs: true,
    });
    const logger = new common_1.Logger('Bootstrap');
    const configService = app.get(config_1.ConfigService);
    app.enableCors({
        origin: "*",
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: [
            'Origin',
            'X-Requested-With',
            'Content-Type',
            'Accept',
            'Authorization',
            'X-Forwarded-For',
            'x-product-key',
        ],
    });
    app.enableVersioning({
        type: common_1.VersioningType.URI,
        defaultVersion: '1',
    });
    app.setGlobalPrefix(configService.get('app.apiPrefix') || 'api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
        errorHttpStatusCode: 422,
    }));
    const apiKeyInterceptor = app.get(api_key_interceptors_1.ApiKeyInterceptor);
    app.useGlobalInterceptors(apiKeyInterceptor);
    if (configService.get('NODE_ENV') !== 'production') {
        const configSwagger = new swagger_1.DocumentBuilder()
            .addBearerAuth()
            .setTitle('PePP Cruise API Documentation')
            .setDescription('PePP Cruise API with NestJS and Sequelize integration')
            .setVersion('1.0')
            .addServer(`http://localhost:${configService.get('app.port')}`, 'Development server')
            .addServer(`https://pepp-cruise-server.onrender.com`, 'Staging server')
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, configSwagger);
        swagger_1.SwaggerModule.setup('docs', app, document, {
            swaggerOptions: {
                persistAuthorization: true,
                tagsSorter: 'alpha',
                operationsSorter: 'alpha',
            },
        });
    }
    const port = configService.get('app.port');
    await app.listen(port ?? 3000);
    const nodeEnv = configService.get('NODE_ENV');
    let appUrl;
    if (nodeEnv === 'production') {
        appUrl = `https://api.peppcruise.com`;
    }
    else if (nodeEnv === 'staging') {
        appUrl = `https://pepp-cruise-server.onrender.com`;
    }
    else {
        appUrl = `http://localhost:${port}`;
    }
    logger.log(`🚀 Application is running on: ${appUrl}`);
    logger.log(`🌍 Environment: ${configService.get('NODE_ENV')}`);
    logger.log(`📡 API Prefix: ${configService.get('app.apiPrefix')}`);
    logger.log(`🔗 Swagger documentation available at: ${appUrl}/docs`);
}
bootstrap().catch((error) => {
    console.error('❌ Error starting server:', error);
    process.exit(1);
});
//# sourceMappingURL=main.js.map