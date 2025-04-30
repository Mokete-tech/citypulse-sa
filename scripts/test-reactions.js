/**
 * Script to test the reactions system in Supabase
 * 
 * This script tests the reactions system by:
 * 1. Adding a test reaction
 * 2. Checking if the reaction count is correct
 * 3. Checking if the user has reacted
 * 4. Removing the test reaction
 * 
 * Usage:
 * node scripts/test-reactions.js
 * 
 * Environment variables:
 * SUPABASE_URL - The URL of your Supabase project
 * SUPABASE_SERVICE_ROLE_KEY - The service role key for your Supabase project
 */

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

// Test data
const TEST_USER_ID = '00000000-0000-0000-0000-000000000000'; // A dummy user ID for testing
const TEST_ITEM_ID = 9999;
const TEST_ITEM_TYPE = 'test';

// Function to run the tests
async function testReactionsSystem() {
  console.log('Testing reactions system...');
  
  try {
    // Step 1: Clean up any existing test data
    console.log('\n1. Cleaning up test data...');
    await cleanupTestData();
    
    // Step 2: Add a test reaction
    console.log('\n2. Adding test reaction...');
    const { error: insertError } = await supabase
      .from('reactions')
      .insert({
        user_id: TEST_USER_ID,
        item_id: TEST_ITEM_ID,
        item_type: TEST_ITEM_TYPE,
        reaction_type: 'tick'
      });
    
    if (insertError) throw insertError;
    console.log('✅ Test reaction added successfully');
    
    // Step 3: Check reaction count
    console.log('\n3. Checking reaction count...');
    const { data: countData, error: countError } = await supabase
      .rpc('get_reaction_count', {
        p_item_id: TEST_ITEM_ID,
        p_item_type: TEST_ITEM_TYPE
      });
    
    if (countError) throw countError;
    
    if (countData === 1) {
      console.log('✅ Reaction count is correct:', countData);
    } else {
      console.error('❌ Reaction count is incorrect. Expected 1, got:', countData);
    }
    
    // Step 4: Check if user has reacted
    console.log('\n4. Checking if user has reacted...');
    const { data: hasReactedData, error: hasReactedError } = await supabase
      .rpc('has_user_reacted', {
        p_user_id: TEST_USER_ID,
        p_item_id: TEST_ITEM_ID,
        p_item_type: TEST_ITEM_TYPE
      });
    
    if (hasReactedError) throw hasReactedError;
    
    if (hasReactedData === true) {
      console.log('✅ User reaction check is correct:', hasReactedData);
    } else {
      console.error('❌ User reaction check is incorrect. Expected true, got:', hasReactedData);
    }
    
    // Step 5: Remove the test reaction
    console.log('\n5. Removing test reaction...');
    await cleanupTestData();
    console.log('✅ Test reaction removed successfully');
    
    // Step 6: Verify reaction is removed
    console.log('\n6. Verifying reaction removal...');
    const { data: finalCountData, error: finalCountError } = await supabase
      .rpc('get_reaction_count', {
        p_item_id: TEST_ITEM_ID,
        p_item_type: TEST_ITEM_TYPE
      });
    
    if (finalCountError) throw finalCountError;
    
    if (finalCountData === 0) {
      console.log('✅ Final reaction count is correct:', finalCountData);
    } else {
      console.error('❌ Final reaction count is incorrect. Expected 0, got:', finalCountData);
    }
    
    console.log('\n✅ All tests passed! The reactions system is working correctly.');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.details) console.error('Details:', error.details);
    if (error.hint) console.error('Hint:', error.hint);
    
    // Clean up test data even if tests fail
    await cleanupTestData();
    process.exit(1);
  }
}

// Function to clean up test data
async function cleanupTestData() {
  try {
    const { error } = await supabase
      .from('reactions')
      .delete()
      .eq('user_id', TEST_USER_ID)
      .eq('item_id', TEST_ITEM_ID)
      .eq('item_type', TEST_ITEM_TYPE);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error cleaning up test data:', error.message);
  }
}

// Run the tests
testReactionsSystem();
