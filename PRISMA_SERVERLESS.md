# Prisma Serverless Optimization Guide

## Overview
This guide explains the Prisma setup optimized for serverless environments (Vercel + Neon).

## Key Optimizations

### 1. Connection Pooling (`src/lib/prisma.ts`)
```typescript
const pool = new Pool({
    connectionString,
    max: 1, // Single connection per serverless instance
    idleTimeoutMillis: 0, // Keep connection alive
    connectionTimeoutMillis: 5000, // 5 second timeout
})
```

**Why these settings?**
- `max: 1` - Each serverless function creates its own connection pool. Limiting to 1 prevents connection exhaustion.
- `idleTimeoutMillis: 0` - Keeps connections alive between requests for better performance.
- `connectionTimeoutMillis: 5000` - Fails fast if database is unreachable.

### 2. Automatic Prisma Generation
**`package.json` scripts:**
```json
{
  "postinstall": "prisma generate",
  "vercel-build": "prisma generate && prisma migrate deploy && next build"
}
```

- `postinstall` - Runs `prisma generate` after every `npm install`
- `vercel-build` - Vercel automatically runs this instead of `build` if it exists
  - Generates Prisma client
  - Applies pending migrations
  - Builds Next.js app

### 3. Safe Production Migrations
**Script:** `scripts/migrate-prod.js`

**Usage:**
```bash
npm run migrate:prod
```

**Features:**
- Shows current migration status
- Asks for confirmation before applying
- Masks database password in output
- Provides troubleshooting tips on failure

## Vercel Deployment Checklist

### 1. Environment Variables
Set in Vercel project settings:
```
DATABASE_URL=postgresql://... (Neon connection string with ?sslmode=require)
```

### 2. Neon Configuration
Ensure your Neon database connection string includes:
- `sslmode=require` parameter
- Connection pooling enabled (Neon does this automatically)

### 3. First Deployment
On first deploy, Vercel will:
1. Run `postinstall` → generates Prisma client
2. Run `vercel-build` → applies migrations, builds app
3. Start your application

### 4. Schema Changes Workflow

**Local Development:**
```bash
# 1. Modify schema.prisma
# 2. Create migration
npx prisma migrate dev --name your_migration_name

# 3. Test locally
npm run dev

# 4. Commit changes
git add prisma/
git commit -m "Add your_migration_name migration"
```

**Production Deployment:**
```bash
# Push to GitHub
git push origin main

# Vercel auto-deploys and runs migrations via vercel-build
```

**Manual Production Migration (if needed):**
```bash
# Pull production env vars
vercel env pull .env.production

# Run migration script
npm run migrate:prod
```

## Troubleshooting

### "Too many connections" error
**Problem:** Multiple serverless instances exhausting database connections.

**Solutions:**
1. **Use Neon's connection pooling URL** (different from direct connection)
   - Direct: `postgresql://user:pass@host/db`
   - Pooled: `postgresql://user:pass@host/db?sslmode=require&pgbouncer=true`

2. **Reduce `max` in pool config** (already set to 1)

### "Migration failed during deploy"
**Problem:** Migration error during Vercel build.

**Solutions:**
1. Check Vercel build logs for specific error
2. Verify DATABASE_URL is correct
3. Test migration locally first:
   ```bash
   vercel env pull
   npx prisma migrate deploy
   ```
4. If migration is problematic, fix it and redeploy

### Slow database queries
**Problem:** Cold starts or slow queries in serverless.

**Solutions:**
1. **Enable Prisma query logging** (development only):
   - Already enabled in `prisma.ts` for dev environment
2. **Add database indexes** to frequently queried fields
3. **Use Neon's autoscaling** features
4. **Consider caching** for read-heavy queries

## Best Practices

1. ✅ **Always test migrations locally first**
2. ✅ **Use descriptive migration names**
3. ✅ **Keep Prisma schema in sync with database**
4. ✅ **Monitor connection count in Neon dashboard**
5. ✅ **Use `prisma migrate deploy` in production** (not `dev`)
6. ✅ **Never manually edit migration files**
7. ✅ **Commit migrations to version control**

## Additional Resources
- [Neon + Prisma Docs](https://neon.tech/docs/guides/prisma)
- [Vercel + Prisma](https://vercel.com/guides/nextjs-prisma-postgres)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management)
