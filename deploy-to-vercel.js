#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to execute shell commands
function exec(command) {
  try {
    return execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error.message);
    process.exit(1);
  }
}

// Function to prompt for confirmation
function confirm(question) {
  return new Promise((resolve) => {
    rl.question(`${question} (y/n): `, (answer) => {
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

// Main deployment function
async function deploy() {
  console.log('🚀 Starting deployment to Vercel...');

  // Check if Vercel CLI is installed
  try {
    execSync('vercel --version', { stdio: 'ignore' });
    console.log('✅ Vercel CLI is installed');
  } catch (error) {
    console.log('⚠️ Vercel CLI is not installed. Installing...');
    exec('npm install -g vercel');
  }

  // Build the application
  console.log('🔨 Building the application...');
  exec('npm run build');

  // Check if build was successful
  if (!fs.existsSync(path.join(process.cwd(), 'dist'))) {
    console.error('❌ Build failed! Check for errors above.');
    process.exit(1);
  }

  console.log('✅ Build successful');

  // Create or update vercel.json
  const vercelConfig = {
    version: 2,
    builds: [
      {
        src: 'package.json',
        use: '@vercel/static-build',
        config: {
          distDir: 'dist'
        }
      }
    ],
    routes: [
      {
        src: '/assets/(.*)',
        headers: {
          'cache-control': 'public, max-age=31536000, immutable'
        },
        continue: true
      },
      {
        src: '/(.*\\.(js|css|svg|ico|jpg|jpeg|png|webp|avif|gif|woff|woff2)$)',
        headers: {
          'cache-control': 'public, max-age=31536000, immutable'
        },
        continue: true
      },
      {
        src: '/(.*)',
        dest: '/index.html'
      }
    ],
    env: {
      VITE_SUPABASE_URL: 'https://qghojdkspxhyjeurxagx.supabase.co',
      VITE_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnaG9qZGtzcHhoeWpldXJ4YWd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg3NjQ4MDAsImV4cCI6MjAxNDM0MDgwMH0.fallback-key-for-development',
      VITE_APP_NAME: 'CityPulse South Africa',
      VITE_APP_ENV: 'production',
      VITE_STRIPE_PUBLISHABLE_KEY: 'pk_live_51IRNxfHieGkyNl5wOGvmEAtaXxZ6VHEPmHcXuwfsfOPTt0umFFEY9QpsJMXo4IAo0uzl0R66CpaJFRKCaXo0k5DZ00uGSXCeCN'
    },
    build: {
      env: {
        VITE_SUPABASE_URL: 'https://qghojdkspxhyjeurxagx.supabase.co',
        VITE_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnaG9qZGtzcHhoeWpldXJ4YWd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg3NjQ4MDAsImV4cCI6MjAxNDM0MDgwMH0.fallback-key-for-development',
        VITE_APP_NAME: 'CityPulse South Africa',
        VITE_APP_ENV: 'production',
        VITE_STRIPE_PUBLISHABLE_KEY: 'pk_live_51IRNxfHieGkyNl5wOGvmEAtaXxZ6VHEPmHcXuwfsfOPTt0umFFEY9QpsJMXo4IAo0uzl0R66CpaJFRKCaXo0k5DZ00uGSXCeCN'
      }
    }
  };

  fs.writeFileSync(
    path.join(process.cwd(), 'vercel.json'),
    JSON.stringify(vercelConfig, null, 2)
  );

  console.log('✅ vercel.json created/updated');

  // Ask for confirmation before deploying
  const shouldDeploy = await confirm('Do you want to deploy to Vercel now?');
  
  if (shouldDeploy) {
    console.log('🚀 Deploying to Vercel...');
    
    // Ask if this is a production deployment
    const isProd = await confirm('Is this a production deployment?');
    
    if (isProd) {
      console.log('🚀 Deploying to production...');
      exec('vercel --prod');
    } else {
      console.log('🚀 Deploying to preview environment...');
      exec('vercel');
    }
    
    console.log('✅ Deployment complete!');
  } else {
    console.log('⚠️ Deployment cancelled');
  }

  rl.close();
}

// Run the deployment function
deploy().catch(error => {
  console.error('❌ Deployment failed:', error);
  process.exit(1);
});
