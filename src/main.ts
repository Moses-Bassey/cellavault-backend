import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { ApiKeyInterceptor } from './interceptors/api-key.interceptors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const logger = new Logger('Bootstrap');

  const configService = app.get(ConfigService);

  // CORS configuration
  app.enableCors({
    origin: ['http://localhost:3001', 'http://localhost:3000', 'https://peppcruise-admin.vercel.app', 'https://pepp-cruise-admin-web.vercel.app', 'https://peppcruise.com', 'https://pepp-cruise-website.vercel.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'X-Forwarded-For',
      'X-Client-Device-Token',
    ],
  });

  // API versioning
  // app.enableVersioning({
  //   type: VersioningType.URI,
  //   defaultVersion: '1',
  // });

  // Global prefix
  // app.setGlobalPrefix(configService.get<string>('app.apiPrefix') || 'api');

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: false,
      },
      errorHttpStatusCode: 422,
    }),
  );

  // Global API key interceptor
  // const apiKeyInterceptor = app.get(ApiKeyInterceptor);
  // app.useGlobalInterceptors(apiKeyInterceptor);

  // Swagger documentation
  if (configService.get<string>('NODE_ENV') !== 'production') {
    const configSwagger = new DocumentBuilder()
      .addBearerAuth()
      .setTitle('PePP Cruise API Documentation')
      .setDescription('PePP Cruise API with NestJS and Sequelize integration')
      .setVersion('1.0')
      .addServer(
        `http://localhost:${configService.get<number>('app.port')}`,
        'Development server',
      )
      .addServer(`https://pepp-cruise-server.onrender.com`, 'Staging server')
      .build();

    const document = SwaggerModule.createDocument(app, configSwagger);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
    });
  }

  // Start server
  const port = configService.get<number>('app.port');
  await app.listen(port ?? 3000);

  const nodeEnv = configService.get<string>('NODE_ENV');
  let appUrl: string;

  if (nodeEnv === 'production') {
    appUrl = `https://api.peppcruise.com`;
  } else if (nodeEnv === 'staging') {
    appUrl = `https://pepp-cruise-server.onrender.com`;
  } else {
    appUrl = `http://localhost:${port}`;
  }
  logger.log(`🚀 Application is running on: ${appUrl}`);
  logger.log(`🌍 Environment: ${configService.get<string>('NODE_ENV')}`);
  logger.log(`📡 API Prefix: ${configService.get<string>('app.apiPrefix')}`);
  logger.log(`🔗 Swagger documentation available at: ${appUrl}/docs`);
}
bootstrap().catch((error) => {
  console.error('❌ Error starting server:', error);
  process.exit(1);
});
