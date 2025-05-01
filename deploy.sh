#!/bin/bash

# Simple deployment script for CityPulse South Africa

echo "🚀 Deploying CityPulse South Africa to Vercel..."

# Build the project
echo "📦 Building project..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
  echo "❌ Build failed! Check for errors above."
  exit 1
fi

echo "✅ Build successful!"

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
npx vercel --prod

echo "✅ Deployment complete!"
echo ""
echo "🔍 Important: After deployment, check that the Client Login button is visible in the top right corner."
echo "   If it's not visible, you may need to clear your browser cache or check the Vercel logs."
echo ""
echo "📝 Remember to set these environment variables in your Vercel project settings:"
echo "   - VITE_SUPABASE_URL=https://qghojdkspxhyjeurxagx.supabase.co"
echo "   - VITE_SUPABASE_ANON_KEY=your-anon-key"
echo "   - VITE_APP_NAME=CityPulse South Africa"
echo "   - VITE_APP_ENV=production"
echo "   - VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-key"
