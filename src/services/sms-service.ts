import { supabase } from '@/integrations/supabase/client';

interface SMSOptions {
  to: string;
  message: string;
  templateId?: string;
  variables?: Record<string, string>;
}

/**
 * Service for sending SMS messages using Twilio or alternative provider
 */
export const smsService = {
  /**
   * Send an SMS message
   * @param options SMS options including recipient and message
   * @returns Promise resolving to success status
   */
  async sendSMS(options: SMSOptions): Promise<{ success: boolean; error?: string }> {
    try {
      // Call Supabase Edge Function to send SMS
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
        event_source: 'sms_service',
        source_id: 0,
        metadata: {
          to: options.to,
          templateId: options.templateId || 'custom',
          success: true
        }
      });

      return { success: true };
    } catch (error: any) {
      console.error('Error in SMS service:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Send verification code via SMS
   * @param phoneNumber Phone number to send verification to
   * @returns Promise resolving to success status
   */
  async sendVerificationCode(phoneNumber: string): Promise<{ success: boolean; error?: string }> {
    // Generate a random 6-digit code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store the code in Supabase with expiration
    const { error: storeError } = await supabase.from('verification_codes').insert({
      phone_number: phoneNumber,
      code: verificationCode,
      expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes expiration
    });

    if (storeError) {
      console.error('Error storing verification code:', storeError);
      return { success: false, error: storeError.message };
    }

    // Send the code via SMS
    return this.sendSMS({
      to: phoneNumber,
      message: `Your CityPulse verification code is: ${verificationCode}. It expires in 10 minutes.`,
      templateId: 'verification'
    });
  },

  /**
   * Verify a code sent to a phone number
   * @param phoneNumber Phone number to verify
   * @param code Verification code
   * @returns Promise resolving to verification result
   */
  async verifyCode(phoneNumber: string, code: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Get the verification code from Supabase
      const { data, error } = await supabase
        .from('verification_codes')
        .select('*')
        .eq('phone_number', phoneNumber)
        .eq('code', code)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error || !data) {
        return { 
          success: false, 
          error: 'Invalid or expired verification code. Please try again.' 
        };
      }

      // Mark the code as used
      await supabase
        .from('verification_codes')
        .update({ used: true })
        .eq('id', data.id);

      return { success: true };
    } catch (error: any) {
      console.error('Error verifying code:', error);
      return { success: false, error: error.message };
    }
  }
};
