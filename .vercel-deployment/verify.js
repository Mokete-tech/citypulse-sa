#!/usr/bin/env node

/**
 * Deployment verification script for CityPulse South Africa
 * 
 * This script checks if the deployed application is working correctly
 * by making requests to key endpoints.
 */

const https = require('https');

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

// Get the deployment URL from command line arguments or use default
const deploymentUrl = process.argv[2] || 'https://citypulse-sa.vercel.app';

console.log(`${colors.blue}=== CityPulse South Africa Deployment Verification ===${colors.reset}\n`);
console.log(`Checking deployment at: ${deploymentUrl}\n`);

// Function to make a GET request to a URL
function checkEndpoint(url, description) {
  return new Promise((resolve, reject) => {
    console.log(`${colors.cyan}Checking ${description}...${colors.reset}`);
    
    https.get(url, (res) => {
      const { statusCode } = res;
      
      if (statusCode === 200) {
        console.log(`${colors.green}✓ ${description} is working (Status: ${statusCode})${colors.reset}\n`);
        resolve(true);
      } else {
        console.log(`${colors.red}✗ ${description} returned status code ${statusCode}${colors.reset}\n`);
        resolve(false);
      }
    }).on('error', (err) => {
      console.log(`${colors.red}✗ ${description} check failed: ${err.message}${colors.reset}\n`);
      resolve(false);
    });
  });
}

// Main function to run all checks
async function runChecks() {
  const checks = [
    { url: `${deploymentUrl}`, description: 'Main page' },
    { url: `${deploymentUrl}/deals`, description: 'Deals page' },
    { url: `${deploymentUrl}/events`, description: 'Events page' },
    { url: `${deploymentUrl}/contact`, description: 'Contact page' },
    { url: `${deploymentUrl}/merchant`, description: 'Merchant page' }
  ];
  
  let successCount = 0;
  
  for (const check of checks) {
    const success = await checkEndpoint(check.url, check.description);
    if (success) successCount++;
  }
  
  console.log(`${colors.blue}=== Verification Summary ===${colors.reset}\n`);
  console.log(`${successCount} out of ${checks.length} checks passed.\n`);
  
  if (successCount === checks.length) {
    console.log(`${colors.green}✓ All checks passed! The deployment is working correctly.${colors.reset}\n`);
  } else {
    console.log(`${colors.yellow}⚠ Some checks failed. Please review the issues above.${colors.reset}\n`);
  }
}

// Run the checks
runChecks();
