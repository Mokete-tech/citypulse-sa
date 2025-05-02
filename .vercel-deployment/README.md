# CityPulse South Africa Deployment Package

This package contains the built application and deployment scripts for CityPulse South Africa.

## Deployment Instructions

1. **Install Vercel CLI**:
   ```sh
   npm install -g vercel
   ```

2. **Run the deployment script**:
   ```sh
   ./deploy.sh
   ```

3. **Follow the prompts** to set up environment variables and complete the deployment.

## Environment Variables

The following environment variables are required for deployment:

```
# Supabase Configuration
VITE_SUPABASE_URL=https://qghojdkspxhyjeurxagx.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_51IRNxfHieGkyNl5wOGvmEAtaXxZ6VHEPmHcXuwfsfOPTt0umFFEY9QpsJMXo4IAo0uzl0R66CpaJFRKCaXo0k5DZ00uGSXCeCN
STRIPE_SECRET_KEY=your-stripe-secret-key

# MailerSend Configuration
MAILERSEND_API_KEY=your-mailersend-api-key
MAILERSEND_FROM_EMAIL=noreply@citypulse-sa.com
MAILERSEND_FROM_NAME=CityPulse South Africa
MAILERSEND_DOMAIN=your-mailersend-domain

# Twilio Configuration
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_VERIFY_SERVICE_SID=your-twilio-verify-service-sid
TWILIO_PHONE_NUMBER=your-twilio-phone-number

# Application Configuration
VITE_APP_NAME=CityPulse South Africa
VITE_APP_ENV=production
VITE_APP_URL=https://citypulse-sa.vercel.app
```

## Troubleshooting

If you encounter any issues during deployment:

1. Check that all environment variables are set correctly
2. Ensure you have the necessary permissions for the Vercel project
3. Check the Vercel deployment logs for any errors

For more detailed instructions, refer to the main project README.md file.
