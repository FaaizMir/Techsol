# Vercel Deployment Guide

## Environment Variables

Make sure to set the following environment variables in your Vercel project settings:

### Required Variables
```bash
# Database
DATABASE_URL=your_database_connection_string

# Authentication (NextAuth.js)
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret

# OAuth Providers (if using)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# API Keys
API_BASE_URL=https://your-api-domain.com

# JWT
JWT_SECRET=your-jwt-secret

# Node Environment
NODE_ENV=production
```

### Optional Variables
```bash
# Analytics
VERCEL_ANALYTICS_ID=your-vercel-analytics-id

# Monitoring
SENTRY_DSN=your-sentry-dsn

# Email Service
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
```

## Deployment Steps

1. **Connect Repository**
   - Go to Vercel dashboard
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Project**
   - Framework Preset: Next.js
   - Root Directory: `./` (leave default)
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)

3. **Environment Variables**
   - Add all required environment variables in the project settings
   - Make sure to set them for Production, Preview, and Development environments

4. **Build Settings**
   - Node.js Version: 20.x (matches vercel.json)
   - Install Command: `npm install`
   - Build Command: `npm run build`

5. **Deploy**
   - Push changes to your main branch
   - Vercel will automatically deploy
   - Or manually trigger deployment from dashboard

## Route Groups Configuration

This project uses Next.js App Router with route groups:

- `(auth)` - Authentication pages (login, signup)
- `(protected)` - Protected pages requiring authentication
- `(public)` - Public pages accessible to all users

Vercel automatically handles these route groups correctly.

## Custom Domain (Optional)

1. Go to Project Settings > Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Update `NEXTAUTH_URL` environment variable with your domain

## Monitoring and Analytics

- Enable Vercel Analytics in project settings
- Set up error monitoring with Sentry if needed
- Configure logging and alerts as required

## Performance Optimization

The configuration includes:
- Static asset caching
- Image optimization
- Compression enabled
- Console logs removed in production

## Troubleshooting

### Build Failures
- Check build logs in Vercel dashboard
- Ensure all dependencies are listed in package.json
- Verify environment variables are set correctly

### Runtime Errors
- Check function logs in Vercel dashboard
- Verify API routes are working correctly
- Check database connectivity

### Performance Issues
- Monitor Core Web Vitals in Vercel dashboard
- Optimize images and static assets
- Consider using Vercel Edge Functions for better performance