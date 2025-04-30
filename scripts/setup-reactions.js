/**
 * Script to set up the reactions system in Supabase
 * 
 * This script creates the necessary tables, functions, and policies for the reactions feature.
 * 
 * Usage:
 * node scripts/setup-reactions.js
 * 
 * Environment variables:
 * SUPABASE_URL - The URL of your Supabase project
 * SUPABASE_SERVICE_ROLE_KEY - The service role key for your Supabase project
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Get environment variables
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://qghojdkspxhyjeurxagx.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate required environment variables
if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY is required');
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Read the SQL script
const sqlScript = fs.readFileSync(path.join(__dirname, 'sql', 'setup-reactions.sql'), 'utf8');

// Function to execute the SQL script
async function setupReactions() {
  console.log('Setting up reactions system...');
  
  try {
    // Execute the SQL script
    const { error } = await supabase.rpc('pgexec', { sql: sqlScript });
    
    if (error) {
      throw error;
    }
    
    console.log('✅ Reactions system set up successfully!');
    
    // Verify the setup
    await verifySetup();
    
  } catch (error) {
    console.error('❌ Error setting up reactions system:', error.message);
    
    // Provide more detailed error information if available
    if (error.details) {
      console.error('Details:', error.details);
    }
    if (error.hint) {
      console.error('Hint:', error.hint);
    }
    
    process.exit(1);
  }
}

// Function to verify the setup
async function verifySetup() {
  try {
    console.log('\nVerifying setup...');
    
    // Check if the reactions table exists
    const { data: tableExists, error: tableError } = await supabase
      .from('reactions')
      .select('id')
      .limit(1);
    
    if (tableError) {
      console.error('❌ Reactions table verification failed:', tableError.message);
    } else {
      console.log('✅ Reactions table exists');
    }
    
    // Check if the functions exist
    const { data: functions, error: functionsError } = await supabase.rpc('pgexec', { 
      sql: "SELECT proname FROM pg_proc WHERE proname IN ('get_reaction_count', 'has_user_reacted') AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')"
    });
    
    if (functionsError) {
      console.error('❌ Functions verification failed:', functionsError.message);
    } else {
      console.log('✅ Required functions exist');
    }
    
    // Check if RLS is enabled
    const { data: rls, error: rlsError } = await supabase.rpc('pgexec', { 
      sql: "SELECT relrowsecurity FROM pg_class WHERE relname = 'reactions' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')"
    });
    
    if (rlsError) {
      console.error('❌ RLS verification failed:', rlsError.message);
    } else if (rls && rls[0] && rls[0].relrowsecurity) {
      console.log('✅ Row Level Security is enabled');
    } else {
      console.warn('⚠️ Row Level Security might not be enabled');
    }
    
    console.log('\nSetup verification completed');
    
  } catch (error) {
    console.error('Error during verification:', error.message);
  }
}

// Alternative implementation using direct SQL query if rpc method is not available
async function setupReactionsAlternative() {
  console.log('Setting up reactions system using alternative method...');
  
  try {
    // Execute the SQL script directly
    const { error } = await supabase
      .from('_pgexec')
      .select('*')
      .eq('query', sqlScript);
    
    if (error) {
      throw error;
    }
    
    console.log('✅ Reactions system set up successfully!');
    
  } catch (error) {
    console.error('❌ Error with alternative method. Trying direct database query...');
    
    try {
      // Try using the database query endpoint
      const { error } = await supabase.rpc('pgexec', { sql: sqlScript });
      
      if (error) {
        throw error;
      }
      
      console.log('✅ Reactions system set up successfully using direct query!');
      
    } catch (secondError) {
      console.error('❌ All methods failed. Error setting up reactions system:', secondError.message);
      process.exit(1);
    }
  }
}

// Run the setup
setupReactions().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
