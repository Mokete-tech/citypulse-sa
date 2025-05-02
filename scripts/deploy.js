#!/usr/bin/env node

/**
 * Deployment script for CityPulse South Africa
 * 
 * This script checks if all required environment variables are set
 * and provides instructions for setting them up in Vercel.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Define required environment variables
const requiredEnvVars = [
  // Supabase
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  
  // Stripe
  'VITE_STRIPE_PUBLISHABLE_KEY',
  'STRIPE_SECRET_KEY',
  
  // MailerSend
  'MAILERSEND_API_KEY',
  'MAILERSEND_FROM_EMAIL',
  'MAILERSEND_FROM_NAME',
  'MAILERSEND_DOMAIN',
  
  // Twilio
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
  'TWILIO_VERIFY_SERVICE_SID',
  'TWILIO_PHONE_NUMBER',
  
  // App Config
  'VITE_APP_NAME',
  'VITE_APP_ENV',
  'VITE_APP_URL'
];

// Define sensitive variables that should be set as secrets in Vercel
const sensitiveVars = [
  'VITE_SUPABASE_ANON_KEY',
  'STRIPE_SECRET_KEY',
  'TWILIO_AUTH_TOKEN',
  'TWILIO_VERIFY_SERVICE_SID'
];

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

// Check if .env file exists
const envPath = path.resolve(process.cwd(), '.env');
const envExists = fs.existsSync(envPath);

console.log(`${colors.blue}=== CityPulse South Africa Deployment Script ===${colors.reset}\n`);

if (!envExists) {
  console.log(`${colors.yellow}Warning: No .env file found.${colors.reset}`);
  console.log(`Creating .env file from .env.example...\n`);
  
  // Copy .env.example to .env if it exists
  const envExamplePath = path.resolve(process.cwd(), '.env.example');
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log(`${colors.green}Created .env file from .env.example${colors.reset}\n`);
  } else {
    console.log(`${colors.red}Error: No .env.example file found.${colors.reset}`);
    console.log(`Please create a .env file manually with the required environment variables.\n`);
    process.exit(1);
  }
}

// Read .env file
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

// Parse .env file
envContent.split('\n').forEach(line => {
  // Skip comments and empty lines
  if (line.startsWith('#') || !line.trim()) return;
  
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    const value = match[2].trim();
    envVars[key] = value;
  }
});

// Check if all required environment variables are set
const missingVars = [];
const placeholderVars = [];

requiredEnvVars.forEach(varName => {
  if (!envVars[varName]) {
    missingVars.push(varName);
  } else if (
    envVars[varName].includes('your-') || 
    envVars[varName].includes('placeholder') ||
    envVars[varName] === ''
  ) {
    placeholderVars.push(varName);
  }
});

// Display results
console.log(`${colors.blue}Environment Variables Check:${colors.reset}\n`);

if (missingVars.length === 0 && placeholderVars.length === 0) {
  console.log(`${colors.green}✓ All required environment variables are set.${colors.reset}\n`);
} else {
  if (missingVars.length > 0) {
    console.log(`${colors.red}Missing environment variables:${colors.reset}`);
    missingVars.forEach(varName => {
      console.log(`  - ${varName}`);
    });
    console.log('');
  }
  
  if (placeholderVars.length > 0) {
    console.log(`${colors.yellow}Environment variables with placeholder values:${colors.reset}`);
    placeholderVars.forEach(varName => {
      console.log(`  - ${varName}: ${envVars[varName]}`);
    });
    console.log('');
  }
  
  console.log(`${colors.yellow}Please update these variables in your .env file before deploying.${colors.reset}\n`);
}

// Vercel deployment instructions
console.log(`${colors.blue}Vercel Deployment Instructions:${colors.reset}\n`);
console.log(`1. Make sure you have the Vercel CLI installed:`);
console.log(`   npm install -g vercel\n`);

console.log(`2. Set up environment variables in Vercel:`);
console.log(`   These can be set in the Vercel dashboard or using the CLI:\n`);

// Regular environment variables
console.log(`   ${colors.cyan}Regular environment variables:${colors.reset}`);
requiredEnvVars
  .filter(varName => !sensitiveVars.includes(varName))
  .forEach(varName => {
    console.log(`   vercel env add ${varName}`);
  });
console.log('');

// Secret environment variables
console.log(`   ${colors.magenta}Secret environment variables:${colors.reset}`);
sensitiveVars.forEach(varName => {
  console.log(`   vercel env add ${varName} --secret`);
});
console.log('');

console.log(`3. Deploy to Vercel:`);
console.log(`   vercel --prod\n`);

// Build the project
console.log(`${colors.blue}Building the project:${colors.reset}\n`);
try {
  console.log(`Running npm run build...\n`);
  execSync('npm run build', { stdio: 'inherit' });
  console.log(`\n${colors.green}✓ Build successful!${colors.reset}\n`);
} catch (error) {
  console.log(`\n${colors.red}✗ Build failed!${colors.reset}\n`);
  process.exit(1);
}

console.log(`${colors.green}Your project is ready for deployment!${colors.reset}`);
console.log(`Follow the instructions above to deploy to Vercel.\n`);
