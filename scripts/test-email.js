/**
 * Script to test email functionality in Supabase
 * 
 * This script sends a test password reset email to verify that SMTP is configured correctly.
 * 
 * Usage:
 * node scripts/test-email.js test@example.com
 * 
 * Where test@example.com is the email address to send the test email to
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Get environment variables
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://qghojdkspxhyjeurxagx.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Get the email address from command line arguments
const testEmail = process.argv[2];

if (!testEmail) {
  console.error('Error: Please provide an email address as an argument');
  console.error('Usage: node scripts/test-email.js test@example.com');
  process.exit(1);
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY is required in your .env file');
  process.exit(1);
}

async function testEmailFunctionality() {
  console.log(`Testing email functionality with address: ${testEmail}`);
  
  try {
    // Create Supabase client with service role key
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Send a password reset email
    const { error } = await supabase.auth.resetPasswordForEmail(testEmail, {
      redirectTo: `${SUPABASE_URL}/auth/reset-password`,
    });
    
    if (error) {
      throw error;
    }
    
    console.log('✅ Password reset email sent successfully!');
    console.log(`Check the inbox of ${testEmail} for the password reset email.`);
    console.log('\nIf you don\'t receive the email:');
    console.log('1. Check your spam/junk folder');
    console.log('2. Verify that your SMTP credentials are correct');
    console.log('3. Check if your email provider has any sending limits');
    
  } catch (error) {
    console.error('❌ Error sending email:');
    console.error(error.message);
    
    if (error.status === 401) {
      console.error('\nAuthentication error:');
      console.error('- Check that your SUPABASE_SERVICE_ROLE_KEY is correct');
    } else if (error.status === 422) {
      console.error('\nValidation error:');
      console.error('- Check that the email address is valid');
    } else {
      console.error('\nSMTP error:');
      console.error('- Check that your SMTP credentials are correct');
      console.error('- Verify that your SMTP host is accessible');
      console.error('- Check if your email provider has any sending restrictions');
    }
    
    process.exit(1);
  }
}

// Run the test
testEmailFunctionality();
