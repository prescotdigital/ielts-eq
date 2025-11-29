# Deploying IELTS EQ to Vercel

This guide walks you through deploying the IELTS EQ application to Vercel.

## Prerequisites

- Vercel account ([sign up here](https://vercel.com/signup))
- GitHub repository with your code
- All required API keys and services set up

## Required Services

Before deploying, ensure you have:

1. **PostgreSQL Database** (Neon, Supabase, or similar)
2. **OpenAI API Key** (for test analysis)
3. **AWS S3 Bucket** (for audio storage)
4. **Google OAuth App** (for authentication)
5. **Resend Account** (for support emails)

---

## Step 1: Connect Repository to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

---

## Step 2: Configure Environment Variables

In Vercel project settings, go to **Settings → Environment Variables** and add:

### Database
```
DATABASE_URL=postgresql://username:password@host:5432/database?sslmode=require
```

### OpenAI
```
OPENAI_API_KEY=sk-...
```

### AWS S3
```
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_BUCKET_NAME=your-bucket-name
```

### Google OAuth
```
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

### NextAuth
```
NEXTAUTH_SECRET=<generate-strong-secret>
NEXTAUTH_URL=https://your-app.vercel.app
```
> Generate secret: `openssl rand -base64 32`

### Resend (Email)
```
RESEND_API_KEY=re_...
```

**Important**: Set all variables for **Production**, **Preview**, and **Development** environments.

---

## Step 3: Run Database Migrations

After deployment, run migrations:

```bash
# Option 1: Use Vercel CLI
npx vercel env pull .env.local
npx prisma migrate deploy

# Option 2: Add to vercel.json (automated)
{
  "buildCommand": "prisma migrate deploy && next build"
}
```

---

## Step 4: Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your OAuth app
3. Add Authorized Redirect URIs:
   ```
   https://your-app.vercel.app/api/auth/callback/google
   ```

---

## Step 5: Verify Deployment

1. Visit your deployed app
2. Test authentication flow
3. Check environment validation in Vercel logs:
   - Should see: `✅ All required environment variables are set`
   - If missing vars: `❌ Missing required environment variables`

---

## Troubleshooting

### "Missing required environment variables"
- Check Vercel project settings
- Ensure all variables are set for the correct environment
- Redeploy after adding variables

### Database connection errors
- Verify `DATABASE_URL` format
- Check database allows connections from Vercel IPs
- For Neon/Supabase, enable connection pooling

### OAuth redirect errors
- Update Google Cloud Console redirect URIs
- Ensure `NEXTAUTH_URL` matches your domain exactly
- Check `NEXTAUTH_SECRET` is set

---

## Optional: Custom Domain

1. Go to **Settings → Domains** in Vercel
2. Add your custom domain
3. Update `NEXTAUTH_URL` to your custom domain
4. Update Google OAuth redirect URIs

---

## Security Checklist

- ✅ All secrets are in environment variables
- ✅ `.env` is in `.gitignore`
- ✅ `NEXTAUTH_SECRET` is strong and unique
- ✅ Database uses SSL connections
- ✅ OAuth redirect URIs are production URLs only
- ✅ Environment validation catches missing vars

---

## Useful Commands

```bash
# Pull production env vars locally
vercel env pull .env.production

# View deployment logs
vercel logs

# Run production build locally
npm run build
npm start
```

---

For more help, see:
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)
