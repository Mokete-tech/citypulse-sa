#!/usr/bin/env node

/**
 * This script helps set up environment variables for Vercel deployment
 * It reads from .env.local or .env and outputs commands to set up Vercel env vars
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Define environment variable groups
const ENV_GROUPS = {
  SUPABASE: ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY', 'NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'],
  STRIPE: ['VITE_STRIPE_PUBLISHABLE_KEY', 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', 'STRIPE_SECRET_KEY'],
  MAILERSEND: ['MAILERSEND_API_KEY', 'MAILERSEND_FROM_EMAIL', 'MAILERSEND_FROM_NAME', 'MAILERSEND_DOMAIN'],
  TWILIO: ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_VERIFY_SERVICE_SID', 'TWILIO_PHONE_NUMBER'],
  APP: ['VITE_APP_NAME', 'VITE_APP_ENV', 'VITE_APP_URL']
};

// Define sensitive variables that should be marked as such
const SENSITIVE_VARS = [
  'VITE_SUPABASE_ANON_KEY', 
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'STRIPE_SECRET_KEY', 
  'MAILERSEND_API_KEY', 
  'TWILIO_ACCOUNT_SID', 
  'TWILIO_AUTH_TOKEN'
];

// Try to find .env files
const envFiles = ['.env.local', '.env'];
let envPath = null;

for (const file of envFiles) {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    envPath = filePath;
    break;
  }
}

if (!envPath) {
  console.error('No .env or .env.local file found. Please create one first.');
  process.exit(1);
}

// Read the .env file
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

// Parse environment variables
envContent.split('\n').forEach(line => {
  // Skip comments and empty lines
  if (line.startsWith('#') || !line.trim()) return;
  
  // Parse key-value pairs
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    const value = match[2].trim();
    envVars[key] = value;
  }
});

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Ask which group of variables to set up
console.log('\nWhich environment variables would you like to set up?');
console.log('1. All variables');
console.log('2. Supabase variables');
console.log('3. Stripe variables');
console.log('4. MailerSend variables');
console.log('5. Twilio variables');
console.log('6. App variables');

rl.question('\nEnter your choice (1-6): ', (choice) => {
  let varsToSetup = [];
  
  switch (choice) {
    case '1':
      varsToSetup = Object.values(ENV_GROUPS).flat();
      break;
    case '2':
      varsToSetup = ENV_GROUPS.SUPABASE;
      break;
    case '3':
      varsToSetup = ENV_GROUPS.STRIPE;
      break;
    case '4':
      varsToSetup = ENV_GROUPS.MAILERSEND;
      break;
    case '5':
      varsToSetup = ENV_GROUPS.TWILIO;
      break;
    case '6':
      varsToSetup = ENV_GROUPS.APP;
      break;
    default:
      console.log('Invalid choice. Exiting.');
      rl.close();
      return;
  }
  
  // Generate Vercel CLI commands
  console.log('\n=== Vercel CLI Commands ===');
  console.log('Run these commands to set up your environment variables in Vercel:');
  console.log('');
  
  varsToSetup.forEach(key => {
    if (envVars[key]) {
      const isSensitive = SENSITIVE_VARS.includes(key);
      console.log(`vercel env add ${key} ${isSensitive ? '--sensitive' : ''}`);
    }
  });
  
  console.log('\n=== Missing Variables ===');
  const missingVars = varsToSetup.filter(key => !envVars[key]);
  
  if (missingVars.length > 0) {
    console.log('The following variables are missing from your .env file:');
    missingVars.forEach(key => console.log(`- ${key}`));
  } else {
    console.log('All variables are present in your .env file.');
  }
  
  console.log('\n=== Vercel Dashboard Instructions ===');
  console.log('Alternatively, you can set these variables in the Vercel dashboard:');
  console.log('1. Go to https://vercel.com/');
  console.log('2. Select your project');
  console.log('3. Go to Settings > Environment Variables');
  console.log('4. Add each variable with its value');
  console.log('5. Mark sensitive variables as "Sensitive"');
  
  rl.close();
});
