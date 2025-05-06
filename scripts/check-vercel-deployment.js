#!/usr/bin/env node

/**
 * Vercel Deployment Status Checker
 *
 * This script checks the status of your Vercel deployment and provides
 * helpful information for troubleshooting.
 */

const https = require('https');
const fs = require('fs');
const { execSync } = require('child_process');

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

console.log(`${colors.bright}${colors.blue}CityPulse South Africa - Vercel Deployment Status Checker${colors.reset}\n`);

// Check if the site is accessible
function checkSite(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          data: data
        });
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Main function
async function main() {
  const url = 'https://citypulse-sa-git-main-velleyvelley-gmailcoms-projects.vercel.app';

  console.log(`${colors.cyan}Checking deployment status for ${url}...${colors.reset}`);

  try {
    const response = await checkSite(url);

    if (response.statusCode === 200) {
      console.log(`${colors.green}✅ Site is accessible (Status: ${response.statusCode})${colors.reset}`);

      // Check if the site is showing the fallback content
      if (response.data.includes('Welcome to Our App') &&
          response.data.includes('50% Off Coffee') &&
          response.data.includes('Buy 1 Get 1 Free Pizza')) {
        console.log(`${colors.yellow}⚠️ Site appears to be showing fallback data${colors.reset}`);
        console.log(`${colors.yellow}This may indicate that your Supabase connection is not properly configured${colors.reset}`);
      } else {
        console.log(`${colors.green}✅ Site appears to be showing real data${colors.reset}`);
      }

      // Check if the Member Login button is visible
      if (response.data.includes('Member Login')) {
        console.log(`${colors.green}✅ Member Login button appears to be present${colors.reset}`);
      } else {
        console.log(`${colors.yellow}⚠️ Member Login button may be missing${colors.reset}`);
      }
    } else {
      console.log(`${colors.red}❌ Site returned status code ${response.statusCode}${colors.reset}`);
    }
  } catch (error) {
    console.error(`${colors.red}❌ Error checking site: ${error.message}${colors.reset}`);
  }

  // Check environment variables
  console.log(`\n${colors.cyan}Checking environment variables...${colors.reset}`);

  if (fs.existsSync('.env.vercel')) {
    console.log(`${colors.green}✅ .env.vercel file exists${colors.reset}`);

    const envFile = fs.readFileSync('.env.vercel', 'utf8');

    if (envFile.includes('VITE_SUPABASE_URL')) {
      console.log(`${colors.green}✅ VITE_SUPABASE_URL is defined in .env.vercel${colors.reset}`);
    } else {
      console.log(`${colors.red}❌ VITE_SUPABASE_URL is missing from .env.vercel${colors.reset}`);
    }

    if (envFile.includes('VITE_SUPABASE_ANON_KEY')) {
      console.log(`${colors.green}✅ VITE_SUPABASE_ANON_KEY is defined in .env.vercel${colors.reset}`);
    } else {
      console.log(`${colors.red}❌ VITE_SUPABASE_ANON_KEY is missing from .env.vercel${colors.reset}`);
    }
  } else {
    console.log(`${colors.red}❌ .env.vercel file does not exist${colors.reset}`);
  }

  // Check vercel.json
  console.log(`\n${colors.cyan}Checking vercel.json...${colors.reset}`);

  if (fs.existsSync('vercel.json')) {
    console.log(`${colors.green}✅ vercel.json file exists${colors.reset}`);

    const vercelConfig = fs.readFileSync('vercel.json', 'utf8');

    if (vercelConfig.includes('"rewrites"')) {
      console.log(`${colors.green}✅ Rewrites configuration is present in vercel.json${colors.reset}`);
    } else {
      console.log(`${colors.red}❌ Rewrites configuration is missing from vercel.json${colors.reset}`);
    }
  } else {
    console.log(`${colors.red}❌ vercel.json file does not exist${colors.reset}`);
  }

  // Provide next steps
  console.log(`\n${colors.magenta}${colors.bright}Next Steps:${colors.reset}`);
  console.log(`1. Make sure you've set up all environment variables in your Vercel project settings`);
  console.log(`2. Check that your Supabase project is active and properly configured`);
  console.log(`3. Verify that the Member Login button is styled correctly in the UserLoginDialog component`);
  console.log(`4. If issues persist, try redeploying with: ${colors.bright}npm run deploy:vercel${colors.reset}`);
}

main().catch(error => {
  console.error(`${colors.red}Unhandled error: ${error.message}${colors.reset}`);
  process.exit(1);
});
