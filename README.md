# PePP Cruise Server

A powerful NestJS-based backend server for the PePP Cruise platform, providing authentication, subscription management, and API services with built-in rate limiting and security features.

## 🚀 Features

- **Authentication**: JWT-based authentication with Passport.js
- **Rate Limiting**: Configurable rate limiting with @nestjs/throttler
- **Database**: MySQL with Sequelize ORM
- **API Documentation**: Auto-generated Swagger documentation
- **Security**: Built-in security middleware and validation
- **Configuration**: Environment-based configuration management
- **Testing**: Comprehensive unit and e2e testing setup

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MySQL database
- Git

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd pepp-cruise-server
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create your environment file:

```bash
cp .env.template .env
```

Configure your environment variables in `.env`:

```bash
# Database
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=your_mysql_password
DATABASE_NAME=peppcruise
DATABASE_SYNCHRONIZE=true
DATABASE_LOGGING=true

# JWT Authentication
JWT_SECRET="your-super-secret-jwt-key-here-make-it-long-and-secure"
JWT_EXPIRES_IN="7d"

# App Configuration
NODE_ENV=development
PORT=3000
API_PREFIX=api
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# Rate Limiting
RATE_LIMIT_TTL=60000  # Time window in milliseconds
RATE_LIMIT_LIMIT=10   # Max requests per window

# Email Configuration (optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
FROM_EMAIL="noreply@peppcruise.com"

# Client URLs
PEPP_APP_CLIENT_URL="http://localhost:3000"
```

### 4. Database Setup

The application uses Sequelize with MySQL. Make sure your MySQL database is running and the connection details are correct in your environment variables.

The application will automatically create tables when `DATABASE_SYNCHRONIZE=true` is set in your environment variables.

## 🏃 Running the Application

### Development Mode

```bash
# Start with auto-reload
npm run start:dev

# Start with debugging
npm run start:debug
```

### Production Mode

```bash
# Build the application
npm run build

# Start production server
npm run start:prod
```

The server will be available at `http://localhost:3000` (or your configured PORT).

## 🧪 Testing

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Test coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

## 📁 Project Structure

```
pepp-cruise-server/
 src/
    config/
       app.config.ts          # Application configuration
    models/                   # Sequelize models
       user.model.ts
       organization.model.ts
       ...
    enums/                    # Application enums
       user-role.enum.ts
       ...
    modules/
       auth/                  # Authentication module
          auth.controller.ts
          auth.service.ts
          auth.module.ts
       subscriptions/         # Subscriptions module
           subscriptions.controller.ts
           subscriptions.service.ts
           subscriptions.module.ts
        ...
    services/
        services.md
    utils/
        utils.md
    app.controller.ts          # Main app controller
    app.service.ts             # Main app service
    app.module.ts              # Main app module
    main.ts                    # Application entry point
 database/
    migrations/                # Database migrations
    seeders/                   # Database seeders
    config/                    # Database configuration
 test/                          # E2E tests
 package.json
 tsconfig.json
 nest-cli.json
 README.md
```

## 📚 API Documentation

When running in development mode, Swagger documentation is available at:

- `http://localhost:3000/api/docs`

## 📜 Available Scripts

- `npm run build` - Build the application for production
- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with auto-reload
- `npm run start:debug` - Start in debug mode
- `npm run start:prod` - Start production build
- `npm run lint` - Run ESLint and fix issues
- `npm run format` - Format code with Prettier
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:cov` - Run tests with coverage
- `npm run test:e2e` - Run end-to-end tests

## 🔒 Security Features

- JWT-based authentication
- Rate limiting protection
- CORS configuration
- Input validation with class-validator
- Environment-based configuration
- Secure password hashing with bcrypt