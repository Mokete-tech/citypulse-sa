# Environment Variables Guide for CityPulse South Africa

This guide provides instructions for setting up all required environment variables for the CityPulse South Africa application in Vercel.

## Required Environment Variables

### Supabase Configuration
These variables are automatically set up when you connect your Supabase project to Vercel using the Supabase integration.

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://qghojdkspxhyjeurxagx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

### Stripe Configuration
These variables are required for payment processing.

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_STRIPE_PUBLISHABLE_KEY` or `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Your Stripe publishable key | `pk_live_51IRNxfHieGkyNl5w...` |
| `STRIPE_SECRET_KEY` | Your Stripe secret key (for Edge Functions) | `sk_live_51IRNxfHieGkyNl5w...` |

### MailerSend Configuration
These variables are required for email functionality.

| Variable | Description | Example |
|----------|-------------|---------|
| `MAILERSEND_API_KEY` | Your MailerSend API key | `mlsnd_xyz123...` |
| `MAILERSEND_FROM_EMAIL` | Email address to send from | `noreply@citypulse.co.za` |
| `MAILERSEND_FROM_NAME` | Name to display in emails | `CityPulse South Africa` |
| `MAILERSEND_DOMAIN` | Your MailerSend domain | `citypulse.co.za` |

### Twilio Configuration (for SMS Authentication)
These variables are required for SMS authentication.

| Variable | Description | Example |
|----------|-------------|---------|
| `TWILIO_ACCOUNT_SID` | Your Twilio account SID | `AC123xyz...` |
| `TWILIO_AUTH_TOKEN` | Your Twilio auth token | `abc123xyz...` |
| `TWILIO_VERIFY_SERVICE_SID` | Your Twilio Verify service SID | `VA123xyz...` |
| `TWILIO_PHONE_NUMBER` | Your Twilio phone number | `+27123456789` |

### Application Configuration
These variables are for general application settings.

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_APP_NAME` | Application name | `CityPulse South Africa` |
| `VITE_APP_ENV` | Environment (production, development) | `production` |
| `VITE_APP_URL` | Application URL | `https://citypulse-sa.vercel.app` |

## Setting Up Environment Variables in Vercel

1. **Log in to your Vercel dashboard**
   - Go to [vercel.com](https://vercel.com/) and log in

2. **Select your project**
   - Click on the "citypulse-sa" project

3. **Go to Project Settings**
   - Click on the "Settings" tab in the top navigation

4. **Navigate to Environment Variables**
   - Click on "Environment Variables" in the left sidebar

5. **Add Environment Variables**
   - Click "Add New" for each variable
   - Enter the variable name and value
   - Select which environments it should apply to (Production, Preview, Development)
   - For sensitive values like API keys, check the "Sensitive" checkbox
   - Click "Add"

6. **Redeploy Your Application**
   - After adding all variables, go to the "Deployments" tab
   - Find your latest deployment
   - Click the three dots menu and select "Redeploy"
   - This will apply the new environment variables

## Getting API Keys

### Stripe
1. Create a Stripe account at [stripe.com](https://stripe.com/)
2. Go to Developers > API keys
3. Copy your publishable key and secret key

### MailerSend
1. Create a MailerSend account at [mailersend.com](https://mailersend.com/)
2. Go to Email Settings > API Keys
3. Create a new API key with appropriate permissions

### Twilio
1. Create a Twilio account at [twilio.com](https://twilio.com/)
2. Go to the Twilio Console
3. Find your Account SID and Auth Token
4. Set up a Verify service and note the Service SID

## Testing Environment Variables

After setting up your environment variables, you can test them by:

1. Deploying your application
2. Testing the following features:
   - Authentication (Supabase)
   - Payment processing (Stripe)
   - Email functionality (MailerSend)
   - SMS authentication (Twilio)

If any feature doesn't work, check the browser console for errors related to missing or incorrect environment variables.
