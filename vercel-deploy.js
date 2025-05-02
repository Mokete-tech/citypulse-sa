#!/usr/bin/env node

/**
 * Vercel Deployment Helper Script
 *
 * This script helps deploy the CityPulse South Africa application to Vercel
 * by setting up the necessary environment variables and configuration.
 */

import fs from 'fs';
import { execSync } from 'child_process';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

console.log(`${colors.bright}${colors.blue}CityPulse South Africa - Vercel Deployment Helper${colors.reset}\n`);

// Check if .env.vercel exists
if (!fs.existsSync('.env.vercel')) {
  console.log(`${colors.yellow}Warning: .env.vercel file not found. Creating one with default values.${colors.reset}`);

  const defaultEnv = `# Supabase Configuration
VITE_SUPABASE_URL=https://qghojdkspxhyjeurxagx.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Email Configuration
VITE_SENDGRID_API_KEY=
VITE_SENDGRID_FROM_EMAIL=noreply@citypulse-sa.com
VITE_SENDGRID_FROM_NAME=CityPulse South Africa

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key

# Application Settings
VITE_APP_NAME=CityPulse South Africa
VITE_APP_ENV=production
`;

  fs.writeFileSync('.env.vercel', defaultEnv);
  console.log(`${colors.green}Created .env.vercel file with default values.${colors.reset}`);
}

// Check if vercel.json exists
if (!fs.existsSync('vercel.json')) {
  console.log(`${colors.yellow}Warning: vercel.json file not found. Creating one with default values.${colors.reset}`);

  const defaultVercelConfig = `{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ],
  "env": {
    "VITE_SUPABASE_URL": "https://qghojdkspxhyjeurxagx.supabase.co",
    "VITE_APP_NAME": "CityPulse South Africa",
    "VITE_APP_ENV": "production"
  },
  "build": {
    "env": {
      "VITE_SUPABASE_URL": "https://qghojdkspxhyjeurxagx.supabase.co",
      "VITE_APP_NAME": "CityPulse South Africa",
      "VITE_APP_ENV": "production"
    }
  }
}`;

  fs.writeFileSync('vercel.json', defaultVercelConfig);
  console.log(`${colors.green}Created vercel.json file with default values.${colors.reset}`);
}

// Function to deploy to Vercel
function deployToVercel() {
  console.log(`\n${colors.cyan}Building project for production...${colors.reset}`);
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log(`${colors.green}Build successful!${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}Build failed. Please fix the errors and try again.${colors.reset}`);
    process.exit(1);
  }

  console.log(`\n${colors.cyan}Deploying to Vercel...${colors.reset}`);
  try {
    execSync('vercel --prod', { stdio: 'inherit' });
    console.log(`${colors.green}Deployment successful!${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}Deployment failed. Please check the error message above.${colors.reset}`);
    process.exit(1);
  }
}

// Ask user if they want to deploy
rl.question(`${colors.yellow}Do you want to deploy to Vercel now? (y/n) ${colors.reset}`, (answer) => {
  if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
    deployToVercel();
  } else {
    console.log(`\n${colors.cyan}Deployment cancelled. You can deploy manually by running:${colors.reset}`);
    console.log(`${colors.bright}npm run build && vercel --prod${colors.reset}`);
  }

  rl.close();
});

// Display important information
console.log(`\n${colors.magenta}Important Notes:${colors.reset}`);
console.log(`1. Make sure you have the Vercel CLI installed (npm install -g vercel)`);
console.log(`2. Make sure you're logged in to Vercel (vercel login)`);
console.log(`3. After deployment, set up your environment variables in the Vercel dashboard`);
console.log(`4. Configure your Supabase authentication settings to use your Vercel URL`);
