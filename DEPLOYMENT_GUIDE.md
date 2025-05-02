# CityPulse South Africa - Deployment Guide

This guide provides detailed instructions for deploying the CityPulse South Africa application to Vercel.

## Prerequisites

- A Vercel account
- Git repository with your CityPulse code
- Supabase project set up
- Stripe account (for payment processing)

## Step 1: Prepare Your Environment Variables

Create a `.env.vercel` file in your project root with the following variables:

```
# Supabase Configuration
VITE_SUPABASE_URL=https://qghojdkspxhyjeurxagx.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Email Configuration
VITE_SENDGRID_API_KEY=your-sendgrid-api-key
VITE_SENDGRID_FROM_EMAIL=noreply@citypulse-sa.com
VITE_SENDGRID_FROM_NAME=CityPulse South Africa

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_51IRNxfHieGkyNl5wOGvmEAtaXxZ6VHEPmHcXuwfsfOPTt0umFFEY9QpsJMXo4IAo0uzl0R66CpaJFRKCaXo0k5DZ00uGSXCeCN

# Application Settings
VITE_APP_NAME=CityPulse South Africa
VITE_APP_ENV=production
```

## Step 2: Install Vercel CLI

```bash
npm install -g vercel
```

## Step 3: Login to Vercel

```bash
vercel login
```

## Step 4: Deploy to Vercel

### Option 1: Using the Vercel CLI

Run the deployment script:

```bash
chmod +x deploy-to-vercel.sh
./deploy-to-vercel.sh
```

### Option 2: Manual Deployment

1. Build your project:

```bash
npm run build
```

2. Deploy to Vercel:

```bash
vercel --prod
```

## Step 5: Configure Environment Variables in Vercel Dashboard

1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add all the environment variables from your `.env.vercel` file
4. Click "Save" to apply the changes
5. Redeploy your application to apply the new environment variables

## Step 6: Configure Supabase Authentication

1. Go to your Supabase project dashboard
2. Navigate to Authentication > URL Configuration
3. Add your Vercel deployment URL as the Site URL
4. Add the following redirect URLs:
   - `https://your-vercel-url.vercel.app/auth/callback`
   - `https://your-vercel-url.vercel.app/merchant/dashboard`
5. Save the changes

## Step 7: Test Your Deployment

1. Visit your deployed application
2. Test the following functionality:
   - Member login (top right button)
   - Merchant login (sidebar)
   - Viewing deals and events
   - Authentication flows
   - Navigation between pages

## Troubleshooting

### Issue: Member Login Button Not Visible

If the Member Login button is not visible in the top right:

1. Check the Navbar component in `src/components/layout/Navbar.tsx`
2. Ensure the UserLoginDialog component is not hidden with CSS classes
3. Redeploy after making changes

### Issue: Fallback Data Showing Instead of Real Data

If your application is showing fallback data:

1. Check your Supabase environment variables in Vercel
2. Verify your Supabase project is active
3. Check the browser console for any errors
4. Ensure your database tables are properly set up

### Issue: 404 Errors on Page Refresh

If you get 404 errors when refreshing pages:

1. Verify your `vercel.json` file has the correct rewrites configuration
2. Redeploy your application

## Maintenance

### Updating Your Deployment

To update your deployment after making changes:

1. Push your changes to your Git repository
2. Vercel will automatically redeploy your application (if auto-deployments are enabled)
3. Alternatively, run `vercel --prod` to manually trigger a deployment

### Monitoring

1. Use the Vercel dashboard to monitor your application's performance
2. Check the Supabase dashboard for database usage and performance
3. Set up error tracking with a service like Sentry

## New Features

The CityPulse South Africa application now includes several enhanced features:

### 1. Geolocation for Nearby Deals and Events

- Users can see deals and events near their location
- Distance calculation and sorting based on user's current position
- Location-based search functionality with adjustable radius
- Visual indicators showing distance to each deal or event

### 2. User Accounts and Authentication

- Enhanced user profiles with preferences and saved items
- Social authentication options (Facebook, Google)
- Mobile number authentication
- Stylish tick buttons for reactions and saving items
- User dashboard with personalized content

### 3. Multiple Payment Methods

- Credit/debit cards via Stripe
- EFT/Bank transfer with account details
- Mobile payment options (SnapScan, Zapper)
- Instant EFT for immediate payment processing
- Secure payment processing with confirmation

### 4. E-Statements for Merchants

- PDF generation with detailed transaction information
- Date range selection for custom reporting periods
- Detailed and summary statement options
- Transaction categorization by type and status
- Professional formatting with merchant branding

## Payment System

The CityPulse South Africa application includes a fully functional payment system:

1. **Pricing Structure**:
   - Standard Deal: R99
   - Premium Deal: R250
   - Standard Event: R299
   - Premium Event: R460

2. **Payment Processing**:
   - Multiple payment methods (cards, EFT, mobile payments)
   - Secure payment collection using Stripe Elements
   - Payment records stored in Supabase database
   - Support for both deal and event payments
   - Visual indicators for premium listings

3. **Testing Payments**:
   - Use Stripe test cards for testing (e.g., 4242 4242 4242 4242)
   - Monitor payments in the Stripe dashboard
   - Check payment records in the Supabase database

4. **Getting Paid**:
   - Payments are processed through your preferred payment processor
   - E-statements available for financial record-keeping
   - Funds will be deposited according to your payment processor's schedule
   - Monitor revenue through the dashboard

## Support

If you encounter any issues with your deployment, please contact support at support@citypulse-sa.com.
