/**
 * Environment Variable Validation
 * Run this at application startup to ensure all required env vars are set
 */

const requiredEnvVars = [
    'DATABASE_URL',
    'OPENAI_API_KEY',
    'AWS_REGION',
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',
    'AWS_BUCKET_NAME',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
];

export function validateEnvironment() {
    const missing: string[] = [];

    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            missing.push(envVar);
        }
    }

    if (missing.length > 0) {
        const message = `Missing required environment variables:\n${missing.map(v => `  - ${v}`).join('\n')}`;

        if (process.env.NODE_ENV === 'production') {
            console.error('❌', message);
            throw new Error('Missing required environment variables in production');
        } else {
            console.warn('⚠️', message);
            console.warn('Application may not function correctly without these variables.');
        }
    } else {
        console.log('✅ All required environment variables are set');
    }
}

// Only run validation on server-side
if (typeof window === 'undefined') {
    validateEnvironment();
}
