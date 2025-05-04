#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase URL and key must be provided as environment variables.');
  console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Path to migrations directory
const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');

// Check if migrations directory exists
if (!fs.existsSync(migrationsDir)) {
  console.error(`Error: Migrations directory not found at ${migrationsDir}`);
  process.exit(1);
}

// Get all migration files
const migrationFiles = fs.readdirSync(migrationsDir)
  .filter(file => file.endsWith('.sql'))
  .sort(); // Sort to ensure migrations are applied in order

if (migrationFiles.length === 0) {
  console.log('No migration files found.');
  process.exit(0);
}

console.log(`Found ${migrationFiles.length} migration files.`);

// Function to apply a migration
async function applyMigration(filePath) {
  try {
    const sql = fs.readFileSync(filePath, 'utf8');
    
    // Split the SQL file into individual statements
    const statements = sql.split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);
    
    console.log(`Applying migration: ${path.basename(filePath)}`);
    console.log(`Found ${statements.length} SQL statements.`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`Executing statement ${i + 1}/${statements.length}...`);
      
      const { error } = await supabase.rpc('exec_sql', { sql: statement });
      
      if (error) {
        console.error(`Error executing statement: ${error.message}`);
        console.error(`Statement: ${statement}`);
        return false;
      }
    }
    
    console.log(`Migration ${path.basename(filePath)} applied successfully.`);
    return true;
  } catch (error) {
    console.error(`Error applying migration ${path.basename(filePath)}: ${error.message}`);
    return false;
  }
}

// Apply all migrations
async function applyMigrations() {
  let success = true;
  
  for (const file of migrationFiles) {
    const filePath = path.join(migrationsDir, file);
    const result = await applyMigration(filePath);
    
    if (!result) {
      success = false;
      break;
    }
  }
  
  if (success) {
    console.log('All migrations applied successfully.');
  } else {
    console.error('Migration failed. See above for details.');
    process.exit(1);
  }
}

// Run the migrations
applyMigrations().catch(error => {
  console.error(`Unexpected error: ${error.message}`);
  process.exit(1);
});
