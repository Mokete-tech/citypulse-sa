# CityPulse South Africa - Vercel Deployment Guide

This guide provides step-by-step instructions for deploying the CityPulse South Africa application to Vercel and troubleshooting common issues.

## Quick Start

For a quick deployment, run:

```bash
npm run deploy
```

This will guide you through the deployment process with interactive prompts.

## Manual Deployment Steps

### 1. Prepare Your Environment

Make sure you have the Vercel CLI installed:

```bash
npm install -g vercel
```

Log in to Vercel:

```bash
vercel login
```

### 2. Configure Environment Variables

Create a `.env.vercel` file with your production environment variables:

```
# Supabase Configuration
VITE_SUPABASE_URL=https://qghojdkspxhyjeurxagx.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Email Configuration
VITE_SENDGRID_API_KEY=your-sendgrid-api-key
VITE_SENDGRID_FROM_EMAIL=noreply@citypulse-sa.com
VITE_SENDGRID_FROM_NAME=CityPulse South Africa

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key

# Application Settings
VITE_APP_NAME=CityPulse South Africa
VITE_APP_ENV=production
```

### 3. Deploy to Vercel

Build and deploy your application:

```bash
npm run build
vercel --prod
```

Or use our deployment script:

```bash
npm run deploy:vercel
```

### 4. Configure Vercel Project Settings

After deployment, go to your Vercel project dashboard and:

1. Navigate to Settings > Environment Variables
2. Add all the environment variables from your `.env.vercel` file
3. Click "Save" to apply the changes
4. Redeploy your application to apply the new environment variables

## Troubleshooting

### Member Login Button Missing

If the Member Login button is not visible in the top right:

1. Check the `Navbar.tsx` component to ensure the UserLoginDialog is not hidden
2. Verify that the UserLoginDialog component is properly styled
3. Make sure there are no CSS conflicts hiding the button

Solution:

```tsx
// In src/components/layout/Navbar.tsx
{!user && (
  <UserLoginDialog className="flex items-center gap-2" />
)}
```

### Fallback Data Showing Instead of Real Data

If your application is showing fallback data:

1. Check your Supabase environment variables in Vercel
2. Verify your Supabase project is active
3. Check the browser console for any errors

Solution:

Make sure these environment variables are set in Vercel:

```
VITE_SUPABASE_URL=https://qghojdkspxhyjeurxagx.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key
```

### 404 Errors on Page Refresh

If you get 404 errors when refreshing pages:

1. Verify your `vercel.json` file has the correct rewrites configuration

Solution:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## Checking Deployment Status

To check the status of your deployment:

```bash
npm run check:deployment
```

This will:
- Check if your site is accessible
- Verify if the Member Login button is visible
- Check if real data is being displayed
- Validate your environment configuration

## Maintenance

### Updating Your Deployment

To update your deployment after making changes:

1. Push your changes to your Git repository
2. Vercel will automatically redeploy your application (if auto-deployments are enabled)
3. Alternatively, run `npm run deploy:vercel` to manually trigger a deployment

## Support

If you encounter any issues with your deployment, please refer to the [Vercel documentation](https://vercel.com/docs) or contact support at support@citypulse-sa.com.
