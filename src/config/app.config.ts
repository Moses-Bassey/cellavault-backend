import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  apiPrefix: process.env.API_PREFIX || 'api',
  corsOrigin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
    : ['https://www.dev.peppcruise.com', 'https://www.admin.peppcruise.com'],
  jwtSecret: process.env.JWT_SECRET || '',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '12h',
  jwtTokenExpiry: process.env.JWT_TOKEN_EXPIRY || '1d',
  apiKey: process.env.PEPPCRUISE_API_KEY || '',
  rateLimitTtl: parseInt(process.env.RATE_LIMIT_TTL || '60000', 10),
  rateLimitLimit: parseInt(process.env.RATE_LIMIT_LIMIT || '10', 10),
  emailHost: process.env.EMAIL_HOST || '',
  emailPort: parseInt(process.env.EMAIL_PORT || '587', 10),
  emailId: process.env.EMAIL_ID || '',
  emailPass: process.env.EMAIL_PASS || '',
  emailFrom: process.env.EMAIL_FROM || '',
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID || '',
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN || '',
  twilioFromNumber: process.env.TWILIO_FROM_NUMBER || '',
  imageBaseUrl: process.env.IMAGE_BASE_URL || '',
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '3306', 10),
    username: process.env.DATABASE_USERNAME || 'root',
    password: process.env.DATABASE_PASSWORD || 'password',
    name: process.env.DATABASE_NAME || 'peppcruise',
    synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
    logging: process.env.DATABASE_LOGGING === 'true',
  },
}));
