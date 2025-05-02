import { supabase } from '@/integrations/supabase/client';

export interface EmailOptions {
  to: string;
  subject?: string;
  templateId?: string;
  variables?: Record<string, any>;
  text?: string;
  html?: string;
}

/**
 * Service for sending emails using MailerSend
 */
export const emailService = {
  /**
   * Send an email
   * @param options Email options including recipient, subject, and content
   * @returns Promise resolving to success status
   */
  async sendEmail(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
    try {
      // Call Supabase Edge Function to send email
      // This keeps API keys secure on the server side
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          to: options.to,
          subject: options.subject,
          templateId: options.templateId,
          variables: options.variables,
          text: options.text,
          html: options.html
        }
      });

      if (error) {
        console.error('Error sending email:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Failed to send email:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },

  /**
   * Send a welcome email to a new user
   * @param email User's email address
   * @param name User's name
   * @returns Promise resolving to success status
   */
  async sendWelcomeEmail(email: string, name: string): Promise<{ success: boolean; error?: string }> {
    return this.sendEmail({
      to: email,
      templateId: 'welcome-email',
      variables: {
        name,
        app_name: 'CityPulse South Africa',
        login_url: `${window.location.origin}/login`
      }
    });
  },

  /**
   * Send a password reset email
   * @param email User's email address
   * @param resetToken Password reset token
   * @returns Promise resolving to success status
   */
  async sendPasswordResetEmail(email: string, resetToken: string): Promise<{ success: boolean; error?: string }> {
    const resetUrl = `${window.location.origin}/reset-password?token=${resetToken}`;
    
    return this.sendEmail({
      to: email,
      templateId: 'password-reset',
      variables: {
        reset_url: resetUrl,
        app_name: 'CityPulse South Africa'
      }
    });
  },

  /**
   * Send a verification email
   * @param email User's email address
   * @param verificationToken Verification token
   * @returns Promise resolving to success status
   */
  async sendVerificationEmail(email: string, verificationToken: string): Promise<{ success: boolean; error?: string }> {
    const verificationUrl = `${window.location.origin}/verify-email?token=${verificationToken}`;
    
    return this.sendEmail({
      to: email,
      templateId: 'email-verification',
      variables: {
        verification_url: verificationUrl,
        app_name: 'CityPulse South Africa'
      }
    });
  },

  /**
   * Send a notification about a new deal
   * @param email User's email address
   * @param dealName Name of the deal
   * @param dealUrl URL to view the deal
   * @returns Promise resolving to success status
   */
  async sendDealNotification(email: string, dealName: string, dealUrl: string): Promise<{ success: boolean; error?: string }> {
    return this.sendEmail({
      to: email,
      templateId: 'deal-notification',
      variables: {
        deal_name: dealName,
        deal_url: dealUrl,
        app_name: 'CityPulse South Africa'
      }
    });
  },

  /**
   * Send a notification about a new event
   * @param email User's email address
   * @param eventName Name of the event
   * @param eventUrl URL to view the event
   * @param eventDate Date of the event
   * @returns Promise resolving to success status
   */
  async sendEventNotification(email: string, eventName: string, eventUrl: string, eventDate: string): Promise<{ success: boolean; error?: string }> {
    return this.sendEmail({
      to: email,
      templateId: 'event-notification',
      variables: {
        event_name: eventName,
        event_url: eventUrl,
        event_date: eventDate,
        app_name: 'CityPulse South Africa'
      }
    });
  }
};

export default emailService;
