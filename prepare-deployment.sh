#!/bin/bash

# Script to prepare the CityPulse South Africa app for deployment

echo "🚀 Preparing CityPulse South Africa for deployment..."

# Create a deployment directory
DEPLOY_DIR="deployment-package"
echo "📁 Creating deployment directory: $DEPLOY_DIR"
mkdir -p $DEPLOY_DIR

# Build the application
echo "🔨 Building the application..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
  echo "❌ Build failed! Check for errors above."
  exit 1
fi

# Copy the built files to the deployment directory
echo "📋 Copying built files to deployment directory..."
cp -r dist/* $DEPLOY_DIR/

# Copy necessary configuration files
echo "📋 Copying configuration files..."
cp vercel.json $DEPLOY_DIR/

# Create a README file with deployment instructions
cat > $DEPLOY_DIR/README.md << 'EOL'
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
EOL

# Create a .env.example file
cat > $DEPLOY_DIR/.env.example << 'EOL'
# Supabase Configuration
VITE_SUPABASE_URL=https://qghojdkspxhyjeurxagx.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Application Settings
VITE_APP_NAME=CityPulse South Africa
VITE_APP_ENV=production

# Payment Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_51IRNxfHieGkyNl5wOGvmEAtaXxZ6VHEPmHcXuwfsfOPTt0umFFEY9QpsJMXo4IAo0uzl0R66CpaJFRKCaXo0k5DZ00uGSXCeCN
EOL

# Create a zip file of the deployment package
echo "📦 Creating deployment zip file..."
zip -r citypulse-south-africa-deployment.zip $DEPLOY_DIR

echo "✅ Deployment package created successfully!"
echo "📁 Deployment directory: $DEPLOY_DIR"
echo "📦 Deployment zip: citypulse-south-africa-deployment.zip"
echo ""
echo "To deploy to Vercel, follow the instructions in $DEPLOY_DIR/README.md"
