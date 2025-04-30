# SMTP Setup Guide for CityPulse South Africa

This guide will walk you through setting up SMTP for email delivery in the CityPulse South Africa application. Proper SMTP configuration is essential for sending password reset emails, account verification emails, and other transactional emails.

## Email Provider Options

Here are some recommended email providers you can use:

### 1. Mailgun

**Pros:**
- Developer-friendly API
- Good deliverability rates
- Free tier with 5,000 emails/month for 3 months
- Detailed analytics

**Setup:**
1. Go to [Mailgun's website](https://www.mailgun.com/) and sign up
2. Verify your account (may require credit card for verification)
3. Add and verify your domain
4. Get your SMTP credentials from the "Sending" > "Domain settings" section

**SMTP Settings:**
- Host: `smtp.mailgun.org`
- Port: `587` (or `465` for SSL)
- Username: Your Mailgun SMTP username (usually looks like `postmaster@yourdomain.com`)
- Password: Your Mailgun SMTP password

### 2. SMTP2GO

**Pros:**
- Simple setup process
- Good for small to medium volume
- Free tier with 1,000 emails/month
- Good deliverability

**Setup:**
1. Go to [SMTP2GO's website](https://www.smtp2go.com/) and sign up
2. Verify your account
3. Go to "Settings" > "SMTP Users"
4. Create a new SMTP user or use the default one

**SMTP Settings:**
- Host: `mail.smtp2go.com`
- Port: `587` (or `2525` as an alternative)
- Username: Your SMTP2GO username
- Password: Your SMTP2GO password

### 3. Amazon SES (Simple Email Service)

**Pros:**
- Very cost-effective for high volume
- Excellent deliverability
- Highly reliable
- Detailed sending statistics

**Setup:**
1. Sign in to your AWS account or create one
2. Navigate to the SES service
3. Verify your domain and email address
4. If your account is in the sandbox, request production access
5. Create SMTP credentials from the "SMTP Settings" section

**SMTP Settings:**
- Host: `email-smtp.us-east-1.amazonaws.com` (replace with your region)
- Port: `587` (or `465` for SSL)
- Username: Your SES SMTP username
- Password: Your SES SMTP password

### 4. Brevo (formerly Sendinblue)

**Pros:**
- User-friendly interface
- Good deliverability
- Free tier with 300 emails/day
- Marketing features included

**Setup:**
1. Go to [Brevo's website](https://www.brevo.com/) and sign up
2. Verify your account
3. Go to "SMTP & API" under the settings menu
4. Get your SMTP credentials

**SMTP Settings:**
- Host: `smtp-relay.brevo.com`
- Port: `587`
- Username: Your Brevo account email
- Password: Your SMTP key (generated in the SMTP & API section)

## Setting Up SMTP in CityPulse

### Step 1: Choose an Email Provider

Select one of the email providers above based on your needs and budget.

### Step 2: Get Your SMTP Credentials

Follow the setup instructions for your chosen provider to get your SMTP credentials.

### Step 3: Update Your Environment Variables

Add your SMTP credentials to your `.env` file:

```
# SMTP Configuration
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
SMTP_ADMIN_EMAIL=admin@citypulse-sa.com
SMTP_SENDER_NAME=CityPulse South Africa
```

### Step 4: Run the SMTP Setup Script

Run the setup script to configure Supabase with your SMTP settings:

```bash
npm run setup:smtp
```

This script will:
1. Update your Supabase project with your SMTP credentials
2. Verify that the configuration was successful
3. Provide next steps for testing

### Step 5: Test Email Delivery

To test that your SMTP configuration is working:

1. Try the password reset functionality in your application
2. Check that the email is delivered to your inbox
3. Verify that the email looks correct with proper formatting

## Troubleshooting

### Common Issues

1. **Emails Not Being Sent**
   - Check that your SMTP credentials are correct
   - Verify that your email provider account is active
   - Check if there are any sending limits on your account

2. **Emails Going to Spam**
   - Set up proper SPF, DKIM, and DMARC records for your domain
   - Use a recognizable sender name and email address
   - Avoid spam trigger words in your email templates

3. **Authentication Errors**
   - Double-check your SMTP username and password
   - Make sure you're using the correct SMTP port
   - Some providers require specific security settings

### Email Deliverability Tips

1. **Set Up Domain Authentication**
   - Configure SPF, DKIM, and DMARC records for your domain
   - This significantly improves deliverability and prevents spoofing

2. **Use a Dedicated IP Address**
   - For high-volume sending, consider a dedicated IP address
   - This gives you more control over your sender reputation

3. **Monitor Your Sending Reputation**
   - Use tools like [MXToolbox](https://mxtoolbox.com/) to check your domain reputation
   - Monitor bounce rates and spam complaints

4. **Warm Up Your Email Domain**
   - Start with low volumes and gradually increase
   - This helps establish a good sending reputation

## Email Template Customization

Supabase allows you to customize email templates for various transactional emails. To customize your templates:

1. Go to the Supabase dashboard
2. Navigate to "Authentication" > "Email Templates"
3. Edit the templates for:
   - Confirmation emails
   - Invitation emails
   - Magic link emails
   - Reset password emails

Make sure your templates:
- Include your brand identity
- Have clear call-to-action buttons
- Are mobile-responsive
- Include both HTML and plain text versions

## Getting Help

If you're still having issues with your SMTP configuration, check the following resources:

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth/auth-smtp)
- Your email provider's documentation and support
- Email deliverability testing tools like [Mail Tester](https://www.mail-tester.com/)

---

Remember, proper email delivery is crucial for user authentication flows and password resets. Take the time to set up your SMTP configuration correctly to ensure a smooth user experience.
