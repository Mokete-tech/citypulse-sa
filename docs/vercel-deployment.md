# Vercel Deployment Guide

This guide explains how to deploy CityPulse South Africa to Vercel.

## Prerequisites

Before deploying to Vercel, make sure you have:

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)
3. All environment variables ready

## Deployment Steps

### 1. Connect Your Repository

1. Log in to your Vercel account
2. Click "Add New" > "Project"
3. Import your Git repository
4. Select the repository containing your CityPulse project

### 2. Configure Project Settings

1. **Framework Preset**: Select "Vite" from the dropdown
2. **Build Command**: Leave as default (`npm run build`)
3. **Output Directory**: Leave as default (`dist`)
4. **Install Command**: Leave as default (`npm install`)

### 3. Environment Variables

Add the following environment variables:

```
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Email Configuration (choose one)
VITE_SENDGRID_API_KEY=your-sendgrid-api-key
VITE_SENDGRID_FROM_EMAIL=noreply@yourdomain.com
VITE_SENDGRID_FROM_NAME=CityPulse South Africa

# Payment Configuration (Stripe)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key

# Application Settings
VITE_APP_NAME=CityPulse South Africa
VITE_APP_ENV=production
```

### 4. Deploy

1. Click "Deploy"
2. Wait for the build and deployment to complete
3. Once deployed, Vercel will provide you with a URL for your application

## Post-Deployment Steps

### 1. Set Up Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Follow the instructions to configure DNS settings

### 2. Configure Supabase Authentication

1. Go to your Supabase project
2. Navigate to Authentication > URL Configuration
3. Add your Vercel deployment URL to the Site URL
4. Add the following redirect URLs:
   - `https://your-vercel-url.vercel.app/auth/callback`
   - `https://your-vercel-url.vercel.app/merchant/dashboard`
   - `https://your-vercel-url.vercel.app/admin/dashboard`

### 3. Test Your Deployment

1. Visit your deployed application
2. Test all critical functionality:
   - User authentication
   - Viewing deals and events
   - Merchant dashboard
   - Payment processing

## Troubleshooting

### Client-Side Routing Issues

If you encounter 404 errors when refreshing pages or accessing routes directly, ensure:

1. The `vercel.json` file is properly configured with rewrites
2. Your React Router is set up correctly

### Environment Variable Issues

If features dependent on environment variables aren't working:

1. Check that all environment variables are correctly set in Vercel
2. Verify that your code is using the variables correctly (prefixed with `VITE_` for client-side access)
3. Redeploy your application after updating environment variables

### Supabase Connection Issues

If you can't connect to Supabase:

1. Verify your Supabase URL and anon key are correct
2. Check that your Supabase project is active
3. Ensure your Supabase security policies allow the necessary operations

## Continuous Deployment

Vercel automatically deploys changes when you push to your repository. To disable this:

1. Go to your project settings
2. Navigate to Git
3. Disable "Auto Deploy"
