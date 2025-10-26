"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMigrations = runMigrations;
const sequelize_1 = require("sequelize");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const sequelize = new sequelize_1.Sequelize({
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
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully.');
        const { execSync } = require('child_process');
        console.log('📦 Running migrations...');
        execSync('npx sequelize-cli db:migrate', { stdio: 'inherit' });
        console.log('🌱 Running seeders...');
        execSync('npx sequelize-cli db:seed:all', { stdio: 'inherit' });
        console.log('✅ All migrations and seeders completed successfully!');
    }
    catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
    finally {
        await sequelize.close();
    }
}
if (require.main === module) {
    runMigrations();
}
//# sourceMappingURL=run-migrations.js.map