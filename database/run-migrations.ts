import { Sequelize } from 'sequelize';
import { config } from 'dotenv';

// Load environment variables
config();

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT) || 3306,
  username: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || 'password',
  database: process.env.DATABASE_NAME || 'peppcruise',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
});

async function runMigrations() {
  try {
    console.log('🔄 Starting database migrations...');
    
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Run migrations
    const { execSync } = require('child_process');
    
    console.log('📦 Running migrations...');
    execSync('npx sequelize-cli db:migrate', { stdio: 'inherit' });
    
    console.log('🌱 Running seeders...');
    execSync('npx sequelize-cli db:seed:all', { stdio: 'inherit' });
    
    console.log('✅ All migrations and seeders completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Run if called directly
if (require.main === module) {
  runMigrations();
}

export { runMigrations };
