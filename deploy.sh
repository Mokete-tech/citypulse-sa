#!/bin/bash

# CityPulse South Africa Deployment Script
# This script builds and deploys the application to Vercel

# Exit on error
set -e

echo "🚀 Starting deployment process for CityPulse South Africa..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Build the application
echo "🔨 Building the application..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Build failed. Check the logs above for errors."
    exit 1
fi

echo "✅ Build successful!"

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel dist --prod

echo "✅ Deployment complete!"
echo "🌐 Your application is now live!"
echo "📝 Don't forget to check the post-deployment steps in the DEPLOYMENT_GUIDE.md file."

# Provide instructions for manual deployment if needed
echo ""
echo "📋 For manual deployment:"
echo "1. Copy the contents of the 'dist' directory to your web server"
echo "2. Configure your server to redirect all requests to index.html"
echo "3. Set up the environment variables as mentioned in the .env.example file"

exit 0
