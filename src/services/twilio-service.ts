import { supabase } from '@/integrations/supabase/client';

interface SMSOptions {
  to: string;
  message: string;
  templateId?: string;
  variables?: Record<string, string>;
}

/**
 * Service for sending SMS messages using Twilio
 */
export const twilioService = {
  /**
   * Send an SMS message via Twilio
   * @param options SMS options including recipient and message
   * @returns Promise resolving to success status
   */
  async sendSMS(options: SMSOptions): Promise<{ success: boolean; error?: string }> {
    try {
      // Call Supabase Edge Function to send SMS via Twilio
      // This keeps API keys secure on the server side
      const { data, error } = await supabase.functions.invoke('send-sms', {
        body: {
          to: options.to,
          message: options.message,
          templateId: options.templateId,
          variables: options.variables
        }
      });

      if (error) {
        console.error('Error sending SMS:', error);
        return { success: false, error: error.message };
      }

      // Log the SMS in analytics
      await supabase.from('analytics').insert({
        event_type: 'sms_sent',
        event_source: 'twilio_service',
        source_id: 0,
        metadata: {
          to: options.to,
          templateId: options.templateId || 'custom',
          success: true
        }
      });

      return { success: true };
    } catch (error: any) {
      console.error('Error in Twilio service:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Send verification code via SMS
   * @param phoneNumber Phone number to send verification to
   * @returns Promise resolving to success status
   */
  async sendVerificationCode(phoneNumber: string): Promise<{ success: boolean; error?: string; verificationId?: string }> {
    try {
      // Call Supabase Edge Function to initiate Twilio Verify
      const { data, error } = await supabase.functions.invoke('twilio-verify', {
        body: {
          action: 'send',
          phoneNumber: phoneNumber
        }
      });

      if (error) {
        console.error('Error sending verification code:', error);
        return { success: false, error: error.message };
      }

      return { 
        success: true, 
        verificationId: data?.verificationId 
      };
    } catch (error: any) {
      console.error('Error in verification service:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Verify a code sent to a phone number
   * @param phoneNumber Phone number to verify
   * @param code Verification code
   * @returns Promise resolving to verification result
   */
  async verifyCode(phoneNumber: string, code: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Call Supabase Edge Function to check Twilio Verify code
      const { data, error } = await supabase.functions.invoke('twilio-verify', {
        body: {
          action: 'check',
          phoneNumber: phoneNumber,
          code: code
        }
      });

      if (error || !data?.valid) {
        return { 
          success: false, 
          error: error?.message || 'Invalid or expired verification code. Please try again.' 
        };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error verifying code:', error);
      return { success: false, error: error.message };
    }
  }
};
