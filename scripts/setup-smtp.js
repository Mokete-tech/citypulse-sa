/**
 * Script to configure SMTP settings in Supabase
 * 
 * This script updates the Supabase auth configuration to use your SMTP provider.
 * 
 * Usage:
 * node scripts/setup-smtp.js
 * 
 * Environment variables:
 * SUPABASE_URL - The URL of your Supabase project
 * SUPABASE_SERVICE_ROLE_KEY - The service role key for your Supabase project
 * SMTP_HOST - Your SMTP host (e.g., smtp.mailgun.org)
 * SMTP_PORT - Your SMTP port (e.g., 587)
 * SMTP_USER - Your SMTP username
 * SMTP_PASS - Your SMTP password
 * SMTP_ADMIN_EMAIL - The admin email address
 * SMTP_SENDER_NAME - The sender name for emails
 */

require('dotenv').config();
const axios = require('axios');

// Get environment variables
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://qghojdkspxhyjeurxagx.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT || '587';
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_ADMIN_EMAIL = process.env.SMTP_ADMIN_EMAIL || 'admin@citypulse-sa.com';
const SMTP_SENDER_NAME = process.env.SMTP_SENDER_NAME || 'CityPulse South Africa';

// Validate required environment variables
if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY is required');
  process.exit(1);
}

if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
  console.error('Error: SMTP credentials are required (SMTP_HOST, SMTP_USER, SMTP_PASS)');
  process.exit(1);
}

async function configureSMTP() {
  console.log('Configuring SMTP settings in Supabase...');
  
  try {
    // Update Supabase auth configuration
    const response = await axios({
      method: 'PATCH',
      url: `${SUPABASE_URL}/admin/v1/auth/config`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
      },
      data: {
        smtp_host: SMTP_HOST,
        smtp_port: SMTP_PORT,
        smtp_user: SMTP_USER,
        smtp_pass: SMTP_PASS,
        smtp_admin_email: SMTP_ADMIN_EMAIL,
        smtp_sender_name: SMTP_SENDER_NAME,
        smtp_max_frequency: 60
      }
    });
    
    console.log('✅ SMTP configured successfully!');
    
    // Verify the configuration
    await verifyConfiguration();
    
  } catch (error) {
    console.error('❌ Error configuring SMTP:');
    
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Error details:', error.response.data);
    } else if (error.request) {
      console.error('No response received from Supabase API');
    } else {
      console.error('Error setting up the request:', error.message);
    }
    
    process.exit(1);
  }
}

async function verifyConfiguration() {
  try {
    console.log('\nVerifying SMTP configuration...');
    
    const response = await axios({
      method: 'GET',
      url: `${SUPABASE_URL}/admin/v1/auth/config`,
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
      }
    });
    
    const config = response.data;
    
    if (config.smtp_host === SMTP_HOST && 
        config.smtp_user === SMTP_USER) {
      console.log('✅ SMTP configuration verified');
      console.log('\nCurrent SMTP configuration:');
      console.log(`- SMTP Host: ${config.smtp_host}`);
      console.log(`- SMTP Port: ${config.smtp_port}`);
      console.log(`- SMTP User: ${config.smtp_user}`);
      console.log(`- SMTP Admin Email: ${config.smtp_admin_email}`);
      console.log(`- SMTP Sender Name: ${config.smtp_sender_name}`);
    } else {
      console.warn('⚠️ SMTP configuration may not be complete');
      console.log('Current configuration:');
      console.log(`- SMTP Host: ${config.smtp_host}`);
      console.log(`- SMTP Port: ${config.smtp_port}`);
      console.log(`- SMTP User: ${config.smtp_user}`);
      console.log(`- SMTP Admin Email: ${config.smtp_admin_email}`);
      console.log(`- SMTP Sender Name: ${config.smtp_sender_name}`);
    }
    
    console.log('\n📧 Next steps:');
    console.log('1. Send a test email to verify your SMTP configuration is working');
    console.log('2. Update your email templates in the Supabase dashboard if needed');
    console.log('3. Make sure your domain is properly configured for email deliverability');
    
  } catch (error) {
    console.error('Error during verification:', error.message);
  }
}

// Run the configuration
configureSMTP();
