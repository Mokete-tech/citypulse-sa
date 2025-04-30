/**
 * Script to configure Twilio as the SMS provider for Supabase
 *
 * This script updates the Supabase auth configuration to use Twilio for SMS authentication.
 *
 * Usage:
 * node scripts/setup-twilio.js
 *
 * Environment variables:
 * SUPABASE_URL - The URL of your Supabase project
 * SUPABASE_SERVICE_ROLE_KEY - The service role key for your Supabase project
 * TWILIO_ACCOUNT_SID - Your Twilio account SID
 * TWILIO_AUTH_TOKEN - Your Twilio auth token
 * TWILIO_MESSAGE_SERVICE_SID - Your Twilio message service SID
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Get environment variables
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://qghojdkspxhyjeurxagx.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || 'AC8df01f1461b436ff688395221a76bb04';
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || '92b971ae5e33b59a8904cd4072a13fcc';
const TWILIO_MESSAGE_SERVICE_SID = process.env.TWILIO_MESSAGE_SERVICE_SID || 'MG123456789'; // Replace with your actual Message Service SID

// Validate required environment variables
if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY is required');
  process.exit(1);
}

if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_MESSAGE_SERVICE_SID) {
  console.error('Error: Twilio credentials are required (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_MESSAGE_SERVICE_SID)');
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function configureTwilio() {
  console.log('Configuring Twilio as the SMS provider...');

  try {
    // Update Supabase auth configuration
    const response = await fetch(`${SUPABASE_URL}/admin/v1/auth/config`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({
        sms_provider: 'twilio',
        sms_twilio_account_sid: TWILIO_ACCOUNT_SID,
        sms_twilio_auth_token: TWILIO_AUTH_TOKEN,
        sms_twilio_message_service_sid: TWILIO_MESSAGE_SERVICE_SID
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to update auth config: ${JSON.stringify(errorData)}`);
    }

    console.log('✅ Twilio configured successfully!');

    // Verify the configuration
    await verifyConfiguration();

  } catch (error) {
    console.error('❌ Error configuring Twilio:', error.message);
    process.exit(1);
  }
}

async function verifyConfiguration() {
  try {
    console.log('\nVerifying Twilio configuration...');

    const response = await fetch(`${SUPABASE_URL}/admin/v1/auth/config`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get auth config');
    }

    const config = await response.json();

    if (config.sms_provider === 'twilio' &&
        config.sms_twilio_account_sid === TWILIO_ACCOUNT_SID &&
        config.sms_twilio_message_service_sid === TWILIO_MESSAGE_SERVICE_SID) {
      console.log('✅ Twilio configuration verified');
    } else {
      console.warn('⚠️ Twilio configuration may not be complete');
      console.log('Current configuration:');
      console.log(`- SMS Provider: ${config.sms_provider}`);
      console.log(`- Twilio Account SID: ${config.sms_twilio_account_sid ? 'Set' : 'Not set'}`);
      console.log(`- Twilio Message Service SID: ${config.sms_twilio_message_service_sid ? 'Set' : 'Not set'}`);
    }

  } catch (error) {
    console.error('Error during verification:', error.message);
  }
}

// Run the configuration
configureTwilio();
