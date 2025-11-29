# MAINTENANCE & OPERATIONS RUNBOOK

This document explains how to perform common administrative tasks and troubleshooting for IELTS EQ.

---

## Quick Reference

### Emergency Contacts & Services

| Service | Purpose | Dashboard URL |
|---------|---------|---------------|
| Neon | Database | https://console.neon.tech |
| Vercel | Hosting | https://vercel.com/dashboard |
| AWS Console | S3 Storage | https://console.aws.amazon.com/s3 |
| OpenAI | AI API | https://platform.openai.com |
| Google Cloud | OAuth | https://console.cloud.google.com |
| Resend | Email | https://resend.com/dashboard |

### Environment Variables Location
- **Local**: `.env` file (gitignored)
- **Production**: Vercel Dashboard → Settings → Environment Variables

---

## Common Operations

### 1. Manually Add Credits to User Account

**When:** Stripe payment succeeded but credits weren't added (webhook failed).

**Steps:**
```bash
# 1. Connect to production database
vercel env pull .env.production

# 2. Run Prisma Studio
npx prisma studio

# 3. Navigate to "User" model
# 4. Find the user by email
# 5. Update the "credits" field
# 6. Click "Save 1 change"
```

**Alternative (SQL Command):**
```sql
-- Connect to Neon Console → SQL Editor
UPDATE "User"
SET credits = credits + 10
WHERE email = 'user@example.com';
```

**Log the manual action:**
```sql
INSERT INTO "AnalyticsEvent" (id, "userId", type, metadata, "createdAt")
VALUES (
  gen_random_uuid()::text,
  '<user_id>',
  'MANUAL_CREDIT_ADDED',
  '{"credits": 10, "reason": "Stripe webhook failure", "admin": "you@example.com"}'::jsonb,
  NOW()
);
```

---

### 2. Promote User to Admin

**When:** Need to grant admin access to a team member.

**Steps:**
```bash
# 1. Get production env
vercel env pull .env.production

# 2. Create a script (promote-admin.ts)
```

```typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function promoteAdmin(email: string) {
    const user = await prisma.user.update({
        where: { email },
        data: { role: 'ADMIN' }
    });
    console.log(`✅ ${email} promoted to ADMIN`);
}

promoteAdmin('new-admin@example.com').finally(() => prisma.$disconnect());
```

```bash
# 3. Run script
npx tsx promote-admin.ts
```

---

### 3. Ban User or IP Address

**Current Status:** ⚠️ Rate limiting not yet implemented.

**Temporary Solution (Database):**
You can manually block a user:

```sql
UPDATE "User"
SET "isBlocked" = true
WHERE email = 'spammer@example.com';
```

**Add field to schema** (if doesn't exist):
```prisma
model User {
  isBlocked Boolean @default(false)
}
```

**Post-Launch:** Implement Upstash rate limiting (see IMPLEMENTATION_PLAN_HARDENING.md).

---

### 4. View User's Recent Activity

**For Support Tickets:**

```bash
# 1. Open Prisma Studio
npx prisma studio

# 2. Navigate to "User" model, find user by email
# 3. Click on relationships to view:
#    - testSessions (speaking tests)
#    - userFlashcardProgress (vocabulary)
#    - supportTickets (if implemented)
```

**SQL Query:**
```sql
-- Get user's last 10 test sessions
SELECT 
  ts.id,
  ts."createdAt",
  ts."bandScore",
  ts.status
FROM "TestSession" ts
JOIN "User" u ON ts."userId" = u.id
WHERE u.email = 'user@example.com'
ORDER BY ts."createdAt" DESC
LIMIT 10;
```

---

### 5. Restart Database Connection Pool

**When:** Getting "too many connections" errors.

**Quick Fix:**
```bash
# Restart Vercel deployment (flushes all connections)
vercel --prod

# Or trigger redeploy from Vercel Dashboard
```

**Check Connection Count (Neon):**
1. Go to Neon Console → Monitoring
2. View "Active Connections" graph
3. Ensure it's under your plan's limit

**Long-term Fix:**
- Already implemented: `max: 1` in connection pool
- Verify `src/lib/prisma.ts` has correct config

---

### 6. Process Refund Manually

**When:** User requests refund for Stripe payment.

**Stripe Dashboard:**
1. Go to https://dashboard.stripe.com/payments
2. Search for payment by email or payment ID
3. Click "Refund" button
4. Select full or partial refund

**Update User Credits:**
```sql
UPDATE "User"
SET credits = GREATEST(0, credits - <refunded_amount>)
WHERE email = 'user@example.com';
```

---

### 7. Export User Data (GDPR Request)

**When:** User requests their personal data.

```bash
# 1. Connect to DB
vercel env pull .env.production

# 2. Create export script
```

```typescript
import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function exportUserData(email: string) {
    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            testSessions: {
                include: { responses: true }
            },
            userFlashcardProgress: true,
            userPronunciationProgress: true,
        }
    });
    
    fs.writeFileSync(
        `user-export-${email}.json`,
        JSON.stringify(user, null, 2)
    );
    
    console.log(`✅ Data exported to user-export-${email}.json`);
}

exportUserData('user@example.com').finally(() => prisma.$disconnect());
```

---

### 8. Delete User Account & Data

**When:** User requests account deletion (GDPR right to be forgotten).

**Steps:**
```sql
-- This will CASCADE delete all related data
DELETE FROM "User" WHERE email = 'user@example.com';
```

**⚠️ IMPORTANT:** Also delete S3 files:
```bash
# List user's audio files (need user ID)
aws s3 ls s3://your-bucket-name/user-<userid>/ --recursive

# Delete all user files
aws s3 rm s3://your-bucket-name/user-<userid>/ --recursive
```

---

## Troubleshooting

### Issue: "Missing required environment variables"

**Symptom:** App crashes on startup.

**Fix:**
1. Check Vercel logs for missing variable name
2. Go to Vercel → Settings → Environment Variables
3. Add missing variable
4. Redeploy

**Verify locally:**
```bash
npm run dev
# Should see: ✅ All required environment variables are set
```

---

### Issue: Prisma Migration Failed

**Symptom:** Build fails during `prisma migrate deploy`.

**Debug:**
```bash
# 1. Pull production DATABASE_URL
vercel env pull .env.production

# 2. Check migration status
npx prisma migrate status

# 3. View pending migrations
ls prisma/migrations/

# 4. Try manual deploy
npx prisma migrate deploy
```

**Recovery:**
- If migration is broken, create a new migration locally:
  ```bash
  npx prisma migrate dev --name fix_migration_issue
  git add prisma/migrations/
  git push
  ```

---

### Issue: S3 Upload Failing

**Symptom:** Users can't upload audio.

**Check:**
1. AWS credentials in Vercel env vars
2. S3 bucket permissions (should allow PutObject from your IP)
3. Bucket CORS configuration

**Test locally:**
```bash
# Check AWS credentials
aws s3 ls s3://your-bucket-name
```

---

### Issue: OpenAI API Errors

**Symptom:** Test analysis failing.

**Check:**
1. API key is valid in Vercel
2. OpenAI account has credits
3. Rate limits not exceeded

**View OpenAI logs:**
- https://platform.openai.com/usage

---

### Issue: OAuth Redirect Error

**Symptom:** Google sign-in fails with redirect mismatch.

**Fix:**
1. Go to Google Cloud Console → Credentials
2. Edit OAuth app
3. Ensure Authorized redirect URIs includes:
   ```
   https://your-production-domain.vercel.app/api/auth/callback/google
   ```

---

## Monitoring & Alerts

### What to Monitor

1. **Error Rate** (Vercel Analytics)
   - Threshold: > 5% errors

2. **Database Connections** (Neon Console)
   - Threshold: Near plan limit

3. **OpenAI Costs** (OpenAI Dashboard)
   - Budget alert recommended

4. **Stripe Webhooks** (Stripe Dashboard)
   - Check for failed webhooks

### Recommended Tools

- **Sentry** (see IMPLEMENTATION_PLAN_HARDENING.md)
- **Vercel Analytics** (built-in)
- **Neon Monitoring** (built-in)

---

## Database Backup & Recovery

### Neon Point-in-Time Recovery

1. Go to Neon Console → Branches
2. Create new branch from production
3. Select timestamp to restore from
4. Test in branch before promoting

### Manual Backup

```bash
# Export schema
npx prisma db pull

# Export data (pg_dump)
pg_dump $DATABASE_URL > backup.sql
```

---

## Security Checklist

- [ ] Rotate `NEXTAUTH_SECRET` every 90 days
- [ ] Review admin users quarterly
- [ ] Check Vercel deployment logs for suspicious activity
- [ ] Monitor Stripe for unusual payment patterns
- [ ] Review AWS S3 access logs

---

## Useful Scripts

### Check All Environment Variables
```bash
# Local
cat .env | grep -v '^#' | grep -v '^$'

# Production (Vercel CLI)
vercel env ls
```

### Generate New NextAuth Secret
```bash
openssl rand -base64 32
```

### Count Total Users
```sql
SELECT COUNT(*) FROM "User";
```

### Revenue This Month
```sql
SELECT SUM(amount) 
FROM "Subscription" 
WHERE "createdAt" >= DATE_TRUNC('month', CURRENT_DATE);
```

---

## Emergency Procedures

### Complete Outage

1. Check Vercel status page
2. Check Neon status page
3. Review recent deployments (rollback if needed)
4. Check Vercel logs for errors

### Data Breach Response

1. Immediately rotate all API keys
2. Invalidate all user sessions:
   ```sql
   DELETE FROM "Session";
   ```
3. Notify affected users
4. Review access logs
5. File incident report

---

## Contact Information

**Platform Support:**
- Vercel: support@vercel.com
- Neon: support@neon.tech
- OpenAI: support@openai.com

**Internal:**
- Admin: [Your Email]

---

**Last Updated:** 2025-11-28
