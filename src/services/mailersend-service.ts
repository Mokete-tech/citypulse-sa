import { supabase } from '@/integrations/supabase/client';

interface EmailOptions {
  to: string | { email: string; name?: string }[];
  subject: string;
  html?: string;
  text?: string;
  templateId?: string;
  variables?: Record<string, any>;
  attachments?: Array<{
    filename: string;
    content: string; // Base64 encoded content
    disposition?: 'attachment' | 'inline';
    id?: string;
  }>;
  tags?: string[];
}

/**
 * Service for sending emails using MailerSend
 */
export const mailerSendService = {
  /**
   * Send an email via MailerSend
   * @param options Email options
   * @returns Promise resolving to success status
   */
  async sendEmail(options: EmailOptions): Promise<{ success: boolean; error?: string; messageId?: string }> {
    try {
      // Call Supabase Edge Function to send email via MailerSend
      // This keeps API keys secure on the server side
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          to: options.to,
          subject: options.subject,
          html: options.html,
          text: options.text,
          templateId: options.templateId,
          variables: options.variables,
          attachments: options.attachments,
          tags: options.tags
        }
      });

      if (error) {
        console.error('Error sending email:', error);
        return { success: false, error: error.message };
      }

      // Log the email in analytics
      await supabase.from('analytics').insert({
        event_type: 'email_sent',
        event_source: 'mailersend_service',
        source_id: 0,
        metadata: {
          to: typeof options.to === 'string' ? options.to : options.to.map(r => r.email).join(','),
          subject: options.subject,
          templateId: options.templateId || 'custom',
          success: true
        }
      });

      return {
        success: true,
        messageId: data?.messageId
      };
    } catch (error: any) {
      console.error('Error in MailerSend service:', error);
      return { success: false, error: error.message };
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
      to: { email, name },
      subject: 'Welcome to CityPulse South Africa!',
      templateId: 'welcome-template',
      variables: {
        name: name || 'there',
        current_year: new Date().getFullYear().toString()
      },
      tags: ['welcome', 'onboarding']
    });
  },

  /**
   * Send a verification email
   * @param email User's email address
   * @param verificationUrl URL for email verification
   * @returns Promise resolving to success status
   */
  async sendVerificationEmail(email: string, verificationUrl: string): Promise<{ success: boolean; error?: string }> {
    return this.sendEmail({
      to: email,
      subject: 'Verify your email address',
      templateId: 'verification-template',
      variables: {
        verification_url: verificationUrl,
        expiry_hours: '24'
      },
      tags: ['verification']
    });
  },

  /**
   * Send a password reset email
   * @param email User's email address
   * @param resetUrl URL for password reset
   * @returns Promise resolving to success status
   */
  async sendPasswordResetEmail(email: string, resetUrl: string): Promise<{ success: boolean; error?: string }> {
    return this.sendEmail({
      to: email,
      subject: 'Reset your password',
      templateId: 'password-reset-template',
      variables: {
        reset_url: resetUrl,
        expiry_hours: '1'
      },
      tags: ['password-reset']
    });
  },

  /**
   * Send a merchant receipt email
   * @param email Merchant's email address
   * @param merchantName Merchant's name
   * @param dealTitle Title of the deal
   * @param amount Payment amount
   * @param transactionId Transaction ID
   * @returns Promise resolving to success status
   */
  async sendMerchantReceiptEmail(
    email: string,
    merchantName: string,
    dealTitle: string,
    amount: string,
    transactionId: string
  ): Promise<{ success: boolean; error?: string }> {
    return this.sendEmail({
      to: email,
      subject: 'Payment Receipt for Your CityPulse Listing',
      templateId: 'merchant-receipt-template',
      variables: {
        merchant_name: merchantName,
        deal_title: dealTitle,
        amount: amount,
        transaction_id: transactionId,
        payment_date: new Date().toLocaleDateString('en-ZA'),
        dashboard_url: 'https://citypulse-sa-git-main-velleyvelley-gmailcoms-projects.vercel.app/merchant/dashboard'
      },
      tags: ['receipt', 'merchant']
    });
  },

  /**
   * Send a merchant statement email
   * @param email Merchant's email address
   * @param merchantName Merchant's name
   * @param statementPdfUrl URL to the statement PDF
   * @param period Statement period (e.g., "April 2025")
   * @returns Promise resolving to success status
   */
  async sendMerchantStatementEmail(
    email: string,
    merchantName: string,
    statementPdfUrl: string,
    period: string
  ): Promise<{ success: boolean; error?: string }> {
    return this.sendEmail({
      to: email,
      subject: `Your CityPulse Statement for ${period}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(to right, #0EA5E9, #10B981); padding: 20px; color: white; text-align: center;">
            <h1>CityPulse South Africa</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
            <p>Hello ${merchantName},</p>
            <p>Your statement for the period <strong>${period}</strong> is now available.</p>
            <p>You can view and download your statement by clicking the button below:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${statementPdfUrl}" style="background-color: #0EA5E9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">View Statement</a>
            </div>
            <p>Or you can access all your statements from your <a href="https://citypulse-sa-git-main-velleyvelley-gmailcoms-projects.vercel.app/merchant/dashboard" style="color: #0EA5E9; text-decoration: none;">Merchant Dashboard</a>.</p>
            <p>Thank you for your partnership with CityPulse South Africa.</p>
            <p>Best regards,<br>The CityPulse Team</p>
          </div>
          <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
            <p>© ${new Date().getFullYear()} CityPulse South Africa. All rights reserved.</p>
            <p>If you have any questions, please contact us at <a href="mailto:info@citypulse.co.za" style="color: #0EA5E9;">info@citypulse.co.za</a></p>
          </div>
        </div>
      `,
      tags: ['statement', 'merchant']
    });
  }
};
