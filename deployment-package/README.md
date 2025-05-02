# CityPulse South Africa - Deployment Package

This package contains the built files for the CityPulse South Africa application.

## Deployment Instructions

### Option 1: Deploy to Vercel

1. Install the Vercel CLI:
   ```
   npm install -g vercel
   ```

2. Log in to Vercel:
   ```
   vercel login
   ```

3. Deploy the application:
   ```
   vercel --prod
   ```

4. Set up the following environment variables in the Vercel dashboard:
   - VITE_SUPABASE_URL=https://qghojdkspxhyjeurxagx.supabase.co
   - VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   - VITE_APP_NAME=CityPulse South Africa
   - VITE_APP_ENV=production
   - VITE_STRIPE_PUBLISHABLE_KEY=pk_live_51IRNxfHieGkyNl5wOGvmEAtaXxZ6VHEPmHcXuwfsfOPTt0umFFEY9QpsJMXo4IAo0uzl0R66CpaJFRKCaXo0k5DZ00uGSXCeCN

### Option 2: Deploy to any static hosting

1. Upload the contents of this directory to your web server
2. Configure your server to redirect all requests to index.html for client-side routing
3. Set up the environment variables as mentioned above

## Features

- Geolocation for nearby deals and events
- User accounts and profiles
- Multiple payment methods
- E-statements for merchants
- Enhanced UI with stylish tick buttons
