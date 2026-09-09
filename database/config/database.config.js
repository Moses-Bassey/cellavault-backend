require('dotenv').config();

// Shared SSL configuration for cloud providers like Neon or Heroku
const sslOptions = {
  ssl: {
    require: true,
    rejectUnauthorized: false,
  }
};

module.exports = {
  development: process.env.DATABASE_URL 
    ? {
        use_env_variable: 'DATABASE_URL',
        dialect: 'postgres',
        logging: console.log,
        dialectOptions: sslOptions,
      }
    : {
        username: process.env.DATABASE_USER || 'postgres',
        password: process.env.DATABASE_PASSWORD || 'password',
        database: process.env.DATABASE_NAME || 'peppcruise',
        host: process.env.DATABASE_HOST || 'localhost',
        port: process.env.DATABASE_PORT || 5432,
        dialect: 'postgres',
        logging: console.log,
      },
  test: process.env.DATABASE_URL_TEST
    ? {
        use_env_variable: 'DATABASE_URL_TEST',
        dialect: 'postgres',
        logging: false,
        dialectOptions: sslOptions,
      }
    : {
        username: process.env.DATABASE_USER || 'postgres',
        password: process.env.DATABASE_PASSWORD || 'password',
        database: process.env.DATABASE_NAME_TEST || 'peppcruise_test',
        host: process.env.DATABASE_HOST || 'localhost',
        port: process.env.DATABASE_PORT || 5432,
        dialect: 'postgres',
        logging: false,
      },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    logging: false,
    dialectOptions: sslOptions,
  },
};
