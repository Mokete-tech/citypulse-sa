/**
 * Script to automate the setup of OAuth providers in Supabase
 *
 * Usage:
 * node scripts/setup-oauth-providers.js
 *
 * Environment variables:
 * SUPABASE_URL - The URL of your Supabase project
 * SUPABASE_SERVICE_ROLE_KEY - The service role key for your Supabase project
 * GOOGLE_CLIENT_ID - The client ID for Google OAuth
 * GOOGLE_CLIENT_SECRET - The client secret for Google OAuth
 * FACEBOOK_CLIENT_ID - The client ID for Facebook OAuth
 * FACEBOOK_CLIENT_SECRET - The client secret for Facebook OAuth
 * SITE_URL - The URL of your site (default: https://citypulse-sa-git-main-velleyvelley-gmailcoms-projects.vercel.app)
 */

const fetch = require('node-fetch');
require('dotenv').config();

// Get environment variables
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://qghojdkspxhyjeurxagx.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID;
const FACEBOOK_CLIENT_SECRET = process.env.FACEBOOK_CLIENT_SECRET;
const SITE_URL = process.env.SITE_URL || 'https://citypulse-sa-git-main-velleyvelley-gmailcoms-projects.vercel.app';

// Validate required environment variables
if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY is required');
  process.exit(1);
}

// Function to update auth settings
async function updateAuthSettings(settings) {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/auth/config`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify(settings)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to update auth settings: ${error}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating auth settings:', error);
    throw error;
  }
}

// Main function
async function main() {
  try {
    console.log('Setting up OAuth providers...');

    // Prepare settings object
    const settings = {
      site_url: SITE_URL,
      uri_allow_list: `${SITE_URL}/auth/callback,http://localhost:5173/auth/callback,http://localhost:3000/auth/callback`
    };

    // Add Google OAuth settings if provided
    if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
      console.log('Setting up Google OAuth...');
      settings.external_google_enabled = true;
      settings.external_google_client_id = GOOGLE_CLIENT_ID;
      settings.external_google_secret = GOOGLE_CLIENT_SECRET;
    }

    // Add Facebook OAuth settings if provided
    if (FACEBOOK_CLIENT_ID && FACEBOOK_CLIENT_SECRET) {
      console.log('Setting up Facebook OAuth...');
      settings.external_facebook_enabled = true;
      settings.external_facebook_client_id = FACEBOOK_CLIENT_ID;
      settings.external_facebook_secret = FACEBOOK_CLIENT_SECRET;
    }

    // Update auth settings
    await updateAuthSettings(settings);

    console.log('OAuth providers setup completed successfully!');

    // Print instructions for Google and Facebook developer consoles
    console.log('\nNext steps:');

    if (GOOGLE_CLIENT_ID) {
      console.log('\nGoogle OAuth Setup:');
      console.log('1. Go to https://console.developers.google.com/');
      console.log('2. Select your project');
      console.log('3. Go to "Credentials" > "OAuth 2.0 Client IDs" > Select your client');
      console.log('4. Add the following Authorized redirect URIs:');
      console.log(`   - ${SITE_URL}/auth/v1/callback`);
      console.log('   - http://localhost:5173/auth/v1/callback');
      console.log('   - http://localhost:3000/auth/v1/callback');
    }

    if (FACEBOOK_CLIENT_ID) {
      console.log('\nFacebook OAuth Setup:');
      console.log('1. Go to https://developers.facebook.com/apps/');
      console.log('2. Select your app');
      console.log('3. Go to "Facebook Login" > "Settings"');
      console.log('4. Add the following Valid OAuth Redirect URIs:');
      console.log(`   - ${SITE_URL}/auth/v1/callback`);
      console.log('   - http://localhost:5173/auth/v1/callback');
      console.log('   - http://localhost:3000/auth/v1/callback');
    }

  } catch (error) {
    console.error('Error setting up OAuth providers:', error);
    process.exit(1);
  }
}

// Run the main function
main();
