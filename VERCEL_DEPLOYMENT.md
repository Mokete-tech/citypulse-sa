# Deploying to Vercel

This guide provides step-by-step instructions for deploying CityPulse South Africa to Vercel.

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

## Prerequisites

- A Vercel account (sign up at [vercel.com](https://vercel.com))
- Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

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
VITE_SUPABASE_URL=https://qghojdkspxhyjeurxagx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Email Configuration (if using SendGrid)
VITE_SENDGRID_API_KEY=your-sendgrid-api-key
VITE_SENDGRID_FROM_EMAIL=noreply@citypulse-sa.com
VITE_SENDGRID_FROM_NAME=CityPulse South Africa

# Payment Configuration (Stripe)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_51IRNxfHieGkyNl5wOGvmEAtaXxZ6VHEPmHcXuwfsfOPTt0umFFEY9QpsJMXo4IAo0uzl0R66CpaJFRKCaXo0k5DZ00uGSXCeCN

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
