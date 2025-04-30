/**
 * This script updates the Supabase SMTP settings using the SendGrid configuration.
 * Run this script when you want to update the SMTP settings in Supabase.
 * 
 * Usage: npx ts-node scripts/update-supabase-smtp.ts
 */

import { createClient } from '@supabase/supabase-js';
import { SENDGRID_CONFIG, isConfigValid } from '../src/integrations/sendgrid/config';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Supabase admin client (requires service role key)
const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

async function updateSmtpSettings() {
  if (!isConfigValid()) {
    console.error('SendGrid configuration is incomplete. Please check your environment variables.');
    process.exit(1);
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('SUPABASE_SERVICE_ROLE_KEY is required to update SMTP settings.');
    process.exit(1);
  }

  try {
    // Update SMTP settings
    const { error } = await supabaseAdmin.functions.invoke('update-smtp-settings', {
      body: {
        smtp_admin_email: SENDGRID_CONFIG.FROM_EMAIL,
        smtp_host: SENDGRID_CONFIG.SMTP.host,
        smtp_port: SENDGRID_CONFIG.SMTP.port,
        smtp_user: SENDGRID_CONFIG.SMTP.user,
        smtp_pass: SENDGRID_CONFIG.SMTP.pass,
        smtp_sender_name: SENDGRID_CONFIG.FROM_NAME,
      },
    });

    if (error) {
      console.error('Error updating SMTP settings:', error);
      process.exit(1);
    }

    console.log('SMTP settings updated successfully!');
  } catch (error) {
    console.error('Error updating SMTP settings:', error);
    process.exit(1);
  }
}

updateSmtpSettings();
