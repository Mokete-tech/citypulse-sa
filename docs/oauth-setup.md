# OAuth Provider Setup Guide

This guide explains how to set up Google and Facebook OAuth providers for the CityPulse South Africa application.

## Prerequisites

1. A Supabase project
2. Google Developer account (for Google OAuth)
3. Facebook Developer account (for Facebook OAuth)

## Setting Up Google OAuth

### 1. Create OAuth Credentials in Google Cloud Console

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Select "Web application" as the application type
6. Add a name for your OAuth client
7. Add the following Authorized JavaScript origins:
   - `https://citypulse-sa.vercel.app` (or your production URL)
   - `http://localhost:5173` (for Vite development)
   - `http://localhost:3000` (for alternative development)
8. Add the following Authorized redirect URIs:
   - `https://citypulse-sa.vercel.app/auth/v1/callback`
   - `http://localhost:5173/auth/v1/callback`
   - `http://localhost:3000/auth/v1/callback`
9. Click "Create"
10. Note down the Client ID and Client Secret

### 2. Configure Google OAuth in Supabase

1. Go to your Supabase project dashboard
2. Navigate to "Authentication" > "Providers"
3. Find "Google" in the list and click "Enable"
4. Enter the Client ID and Client Secret from the Google Cloud Console
5. Save the changes

## Setting Up Facebook OAuth

### 1. Create OAuth App in Facebook Developer Console

1. Go to the [Facebook Developer Portal](https://developers.facebook.com/)
2. Create a new app or select an existing one
3. Add the "Facebook Login" product to your app
4. Navigate to "Facebook Login" > "Settings"
5. Add the following Valid OAuth Redirect URIs:
   - `https://citypulse-sa.vercel.app/auth/v1/callback`
   - `http://localhost:5173/auth/v1/callback`
   - `http://localhost:3000/auth/v1/callback`
6. Save the changes
7. Navigate to "Basic" settings
8. Note down the App ID and App Secret

### 2. Configure Facebook OAuth in Supabase

1. Go to your Supabase project dashboard
2. Navigate to "Authentication" > "Providers"
3. Find "Facebook" in the list and click "Enable"
4. Enter the App ID and App Secret from the Facebook Developer Console
5. Save the changes

## Automated Setup

You can use the provided script to automate the setup of OAuth providers in Supabase:

1. Create a `.env` file with the following variables:
   ```
   SUPABASE_URL=https://your-project-url.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   FACEBOOK_CLIENT_ID=your-facebook-app-id
   FACEBOOK_CLIENT_SECRET=your-facebook-app-secret
   SITE_URL=https://your-site-url.com
   ```

2. Run the setup script:
   ```
   node scripts/setup-oauth-providers.js
   ```

3. Follow the instructions printed by the script to complete the setup in the Google and Facebook developer consoles.

## Testing OAuth Login

After setting up the OAuth providers, you can test the login functionality:

1. Run your application locally or deploy it
2. Click on the "Sign In" button in the navbar
3. Click on the "Google" or "Facebook" button in the login dialog
4. You should be redirected to the respective OAuth provider for authentication
5. After successful authentication, you should be redirected back to your application and logged in

## Troubleshooting

If you encounter issues with OAuth login:

1. Check that the Client ID and Client Secret are correctly configured in Supabase
2. Verify that the redirect URIs are correctly set up in the OAuth provider consoles
3. Check the browser console for any errors
4. Check the Supabase logs for authentication errors
5. Ensure that the OAuth providers are enabled in Supabase
