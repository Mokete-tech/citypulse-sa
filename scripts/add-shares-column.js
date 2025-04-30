/**
 * Script to add a 'shares' column to the deals and events tables
 * 
 * This script adds a 'shares' column to track how many times a deal or event has been shared.
 * 
 * Usage:
 * node scripts/add-shares-column.js
 * 
 * Environment variables:
 * SUPABASE_URL - The URL of your Supabase project
 * SUPABASE_SERVICE_ROLE_KEY - The service role key for your Supabase project
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

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

async function addSharesColumn() {
  console.log('Adding shares column to deals and events tables...');
  
  try {
    // Check if the deals table exists
    const { data: dealsTable, error: dealsTableError } = await supabase
      .from('deals')
      .select('id')
      .limit(1);
    
    if (dealsTableError) {
      console.error('Error checking deals table:', dealsTableError.message);
    } else {
      // Add shares column to deals table
      const { error: dealsError } = await supabase.rpc('add_column_if_not_exists', {
        table_name: 'deals',
        column_name: 'shares',
        column_type: 'integer',
        column_default: '0'
      });
      
      if (dealsError) {
        console.error('Error adding shares column to deals table:', dealsError.message);
      } else {
        console.log('✅ Added shares column to deals table');
      }
    }
    
    // Check if the events table exists
    const { data: eventsTable, error: eventsTableError } = await supabase
      .from('events')
      .select('id')
      .limit(1);
    
    if (eventsTableError) {
      console.error('Error checking events table:', eventsTableError.message);
    } else {
      // Add shares column to events table
      const { error: eventsError } = await supabase.rpc('add_column_if_not_exists', {
        table_name: 'events',
        column_name: 'shares',
        column_type: 'integer',
        column_default: '0'
      });
      
      if (eventsError) {
        console.error('Error adding shares column to events table:', eventsError.message);
      } else {
        console.log('✅ Added shares column to events table');
      }
    }
    
    console.log('Migration completed!');
  } catch (error) {
    console.error('Error during migration:', error.message);
    process.exit(1);
  }
}

// Run the migration
addSharesColumn();
