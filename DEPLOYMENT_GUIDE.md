# CityPulse South Africa - Deployment Guide

This guide provides instructions for deploying the CityPulse South Africa application to production.

## Prerequisites

- Node.js 16.x or higher
- npm 8.x or higher
- A Vercel account (for Vercel deployment)
- A Supabase account with the database set up
- Stripe account for payment processing
- MailerSend account for email functionality

## Deployment Options

### Option 1: Deploy to Vercel (Recommended)

1. **Install the Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Log in to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy the application:**
   ```bash
   vercel --prod
   ```

4. **Set up environment variables in the Vercel dashboard:**
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
   - VITE_STRIPE_PUBLISHABLE_KEY
   - VITE_MAILERSEND_API_KEY
   - VITE_GOOGLE_MAPS_API_KEY

### Option 2: Manual Deployment

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Upload the contents of the `dist` directory to your web server**

3. **Configure your server to redirect all requests to index.html for client-side routing**

4. **Set up the environment variables on your server**

## Post-Deployment Steps

1. **Verify PWA functionality:**
   - Test the application on mobile devices
   - Verify that the app can be installed to the home screen
   - Test offline functionality

2. **Test payment processing:**
   - Make a test purchase to ensure Stripe integration is working
   - Verify that merchant accounts receive payments correctly

3. **Test email functionality:**
   - Verify that registration emails are sent
   - Test password reset functionality
   - Check notification emails

4. **Test merchant features:**
   - Verify merchant verification process
   - Test revenue reporting dashboard
   - Check analytics functionality

5. **Test user features:**
   - Verify social sharing functionality
   - Test review and rating system
   - Check geolocation for nearby deals and events

## Troubleshooting

If you encounter issues during deployment:

1. **Check environment variables:**
   - Ensure all required environment variables are set correctly
   - Verify API keys are valid

2. **Check build logs:**
   - Look for any errors in the build process
   - Verify that all dependencies were installed correctly

3. **Test locally first:**
   - Run `npm run preview` to test the built application locally
   - Address any issues before deploying to production

4. **Check browser console:**
   - Look for any JavaScript errors in the browser console
   - Address any API connection issues

## Monitoring and Maintenance

1. **Set up monitoring:**
   - Configure error tracking (e.g., Sentry)
   - Set up performance monitoring

2. **Regular updates:**
   - Keep dependencies up to date
   - Apply security patches promptly

3. **Backup strategy:**
   - Regularly backup the Supabase database
   - Implement a disaster recovery plan

## Contact Support

If you need assistance with deployment, please contact:
- Email: support@citypulse-sa.com
- GitHub: https://github.com/Mokete-tech/citypulse-south-africa-insight
