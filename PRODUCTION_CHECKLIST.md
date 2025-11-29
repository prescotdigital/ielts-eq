# Production Launch Checklist

Use this checklist before deploying to Vercel production.

## ✅ Security

- [x] All secrets in environment variables (no hardcoded keys)
- [x] `.env` in `.gitignore`
- [x] Environment validation on startup (`src/lib/env-validation.ts`)
- [x] RBAC implemented with server-side route protection
- [x] Google OAuth redirect URIs configured for production domain
- [x] `NEXTAUTH_SECRET` is strong and unique
- [x] Database uses SSL connections (`?sslmode=require`)

## ✅ Database & Prisma

- [x] Prisma schema optimized for serverless (Neon)
- [x] Connection pooling configured (`max: 1`)
- [x] Migrations tested locally
- [x] `vercel-build` script runs migrations automatically
- [ ] **TODO**: Run initial production migration after first deploy

## ✅ Environment Variables

Verify these are set in Vercel:
- [ ] `DATABASE_URL`
- [ ] `OPENAI_API_KEY`
- [ ] `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_BUCKET_NAME`
- [ ] `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- [ ] `NEXTAUTH_SECRET`, `NEXTAUTH_URL` (production domain)
- [ ] `RESEND_API_KEY`

## 🔑 Google OAuth Setup (NextAuth)

**1. Create Project in Google Cloud Console**
   - Go to [console.cloud.google.com](https://console.cloud.google.com/)
   - Create a new project (e.g., "IELTS EQ Production")
   - Go to **APIs & Services** -> **Credentials**
   - Click **Create Credentials** -> **OAuth Client ID**
   - Application Type: **Web application**

**2. Configure Redirect URIs**
   You must add BOTH of these exact URLs to "Authorized redirect URIs":

   **For Local Development:**
   ```
   http://localhost:3000/api/auth/callback/google
   ```

   **For Production (Vercel):**
   ```
   https://<your-project-name>.vercel.app/api/auth/callback/google
   ```
   *(Replace `<your-project-name>` with your actual Vercel domain after deployment)*

**3. Get Credentials**
   - Copy **Client ID** -> Set as `GOOGLE_CLIENT_ID`
   - Copy **Client Secret** -> Set as `GOOGLE_CLIENT_SECRET`

**4. Generate NextAuth Secret**
   Run this command in your terminal to generate a secure random string:
   ```bash
   openssl rand -base64 32
   ```
   Set this value as `NEXTAUTH_SECRET` in Vercel.

**5. Required Environment Variables**
   Ensure these are set in Vercel (Settings -> Environment Variables):
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (Set to `https://<your-project-name>.vercel.app` in Production)

## 🚀 Deployment Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Production ready"
   git push origin main
   ```

2. **Connect to Vercel**
   - Import repository at vercel.com/new
   - Framework: Next.js (auto-detected)

3. **Set Environment Variables**
   - Go to Settings → Environment Variables
   - Add all 11 required variables
   - Set for Production, Preview, and Development

4. **Update Google OAuth**
   - Add production redirect URI: `https://your-app.vercel.app/api/auth/callback/google`

5. **Deploy**
   - Vercel auto-deploys on push
   - Monitor build logs for errors

6. **Post-Deploy**
   - Visit app and test authentication
   - Create test account
   - Verify admin portal access
   - Test vocabulary games and test flow

## 🔍 Monitoring (Recommended)

Consider adding:
- **Vercel Analytics** (free) - Page views, performance
- **Sentry** (optional) - Error tracking
- **Prisma Studio** - Database inspection

## 📊 Performance

- [x] Prisma connection pooling optimized
- [x] Images optimized (Next.js automatic)
- [x] CSS/JS bundling (Next.js automatic)
- [ ] Consider adding caching for vocabulary data (future)

## 🐛 Known Limitations

- No rate limiting on API routes (consider adding if abuse occurs)
- No email verification (NextAuth + Google OAuth handles this)
- No subscription payment flow (Stripe integration pending)

## 📝 Final Checks

- [ ] Test flows:
  - [ ] Sign in with Google
  - [ ] Complete a test
  - [ ] View results
  - [ ] Access vocabulary builder
  - [ ] Admin can access `/admin`
  - [ ] Regular user redirected from `/admin`

## 🎉 Launch Day

1. Deploy to production
2. Test all critical flows
3. Monitor Vercel logs for errors
4. Share with initial users
5. Gather feedback

---

## Post-Launch

- Monitor error rates in Vercel logs
- Check database connection count in Neon
- Review user feedback
- Plan next features

**You're ready to launch! 🚀**
