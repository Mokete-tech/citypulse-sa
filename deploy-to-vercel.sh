#!/bin/bash

# This script prepares and deploys the CityPulse application to Vercel

echo "🚀 Preparing CityPulse South Africa for Vercel deployment..."

# 1. Create a production build
echo "📦 Creating production build..."
npm run build

# 2. Verify the build was successful
if [ ! -d "dist" ]; then
  echo "❌ Build failed! The dist directory was not created."
  exit 1
fi

# 3. Deploy to Vercel
echo "🚀 Deploying to Vercel..."
npx vercel --prod

echo "✅ Deployment complete! Your application should now be live on Vercel."
echo "🔍 Check your Vercel dashboard for the deployment URL and status."
echo ""
echo "⚠️ IMPORTANT: Make sure to set the following environment variables in your Vercel project settings:"
echo "- VITE_SUPABASE_URL=https://qghojdkspxhyjeurxagx.supabase.co"
echo "- VITE_SUPABASE_ANON_KEY=your-supabase-anon-key"
echo "- VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key"
echo "- VITE_APP_NAME=CityPulse South Africa"
echo "- VITE_APP_ENV=production"
