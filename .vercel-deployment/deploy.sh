#!/bin/bash

# Deployment script for CityPulse South Africa
# This script deploys the application to Vercel

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI is not installed. Installing..."
    npm install -g vercel
fi

# Login to Vercel (if not already logged in)
vercel login

# Set environment variables
echo "Setting environment variables..."
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY --secret
vercel env add VITE_STRIPE_PUBLISHABLE_KEY
vercel env add STRIPE_SECRET_KEY --secret
vercel env add MAILERSEND_API_KEY --secret
vercel env add MAILERSEND_FROM_EMAIL
vercel env add MAILERSEND_FROM_NAME
vercel env add MAILERSEND_DOMAIN
vercel env add TWILIO_ACCOUNT_SID --secret
vercel env add TWILIO_AUTH_TOKEN --secret
vercel env add TWILIO_VERIFY_SERVICE_SID --secret
vercel env add TWILIO_PHONE_NUMBER --secret
vercel env add VITE_APP_NAME
vercel env add VITE_APP_ENV
vercel env add VITE_APP_URL

# Deploy to Vercel
echo "Deploying to Vercel..."
vercel --prod

echo "Deployment complete!"
