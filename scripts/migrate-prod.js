#!/usr/bin/env node

/**
 * Safe Production Migration Script
 * Run this to apply database migrations to production
 * 
 * Usage:
 *   npm run migrate:prod
 *   or
 *   node scripts/migrate-prod.js
 */

const { execSync } = require('child_process');

console.log('🔍 Checking Prisma migrations...\n');

try {
    // 1. Validate environment
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL environment variable is not set. Please check your .env file.');
    }

    console.log('✅ DATABASE_URL is set\n');

    // 2. Display migration status
    console.log('📊 Current migration status:');
    execSync('prisma migrate status', { stdio: 'inherit' });
    console.log('');

    // 3. Confirm before applying
    console.log('⚠️  WARNING: You are about to apply migrations to the database.');
    console.log('   Database:', process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@')); // Mask password
    console.log('');

    // If running interactively, ask for confirmation
    if (process.stdin.isTTY) {
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        readline.question('Do you want to continue? (yes/no): ', (answer) => {
            readline.close();

            if (answer.toLowerCase() !== 'yes') {
                console.log('\n❌ Migration cancelled.');
                process.exit(0);
            }

            applyMigrations();
        });
    } else {
        // Non-interactive mode (CI/CD)
        console.log('🤖 Running in non-interactive mode. Applying migrations automatically...\n');
        applyMigrations();
    }
} catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
}

function applyMigrations() {
    try {
        console.log('🚀 Applying migrations...\n');

        // Deploy migrations
        execSync('prisma migrate deploy', { stdio: 'inherit' });

        console.log('\n✅ Migrations applied successfully!');
        console.log('\n📝 Next steps:');
        console.log('   1. Verify database schema in your database dashboard');
        console.log('   2. Test the application with the new schema');
        console.log('   3. Monitor for any errors in production logs');

    } catch (error) {
        console.error('\n❌ Migration failed:', error.message);
        console.error('\nℹ️  Troubleshooting:');
        console.error('   1. Check database connectivity');
        console.error('   2. Verify DATABASE_URL is correct');
        console.error('   3. Review migration files in prisma/migrations/');
        console.error('   4. Check Prisma error logs above');
        process.exit(1);
    }
}
