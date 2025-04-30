# Twilio Setup Guide for CityPulse South Africa

This guide will walk you through setting up Twilio for SMS authentication in the CityPulse South Africa application.

## Prerequisites

1. A Twilio account - [Sign up here](https://www.twilio.com/try-twilio)
2. Your Twilio Account SID and Auth Token (found in your Twilio Console)
3. A Twilio phone number or Messaging Service SID

## Step 1: Set Up Your Twilio Account

1. Sign up for a Twilio account at [https://www.twilio.com/try-twilio](https://www.twilio.com/try-twilio)
2. Verify your email address and phone number
3. Complete the account setup process

## Step 2: Get Your Twilio Credentials

1. Log in to your Twilio Console at [https://www.twilio.com/console](https://www.twilio.com/console)
2. Your **Account SID** and **Auth Token** are displayed on the dashboard
3. Copy these values for later use

## Step 3: Get a Twilio Phone Number

1. In the Twilio Console, navigate to "Phone Numbers" > "Manage" > "Active Numbers"
2. Click "Buy a Number" or use an existing number
3. Make sure the number has SMS capabilities
4. Copy the phone number for later use

## Step 4: Create a Messaging Service (Recommended)

A Messaging Service provides better deliverability and features like fallback numbers.

1. In the Twilio Console, navigate to "Messaging" > "Services"
2. Click "Create Messaging Service"
3. Name it "CityPulse Authentication"
4. Select "Verify, protect, or send notifications to your users" as the use case
5. Add your Twilio phone number to the service
6. Copy the Messaging Service SID (starts with "MG") for later use

## Step 5: Update Your Environment Variables

1. Open your `.env` file
2. Update the Twilio configuration section:

```
# Twilio Configuration (for SMS authentication)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
TWILIO_MESSAGE_SERVICE_SID=your_messaging_service_sid
```

## Step 6: Configure Supabase to Use Twilio

1. Run the setup script:

```bash
npm run setup:twilio
```

2. This script will update your Supabase project to use Twilio for SMS authentication

## Step 7: Test the Twilio Integration

1. Run the test script with a phone number:

```bash
npm run test:twilio +1234567890
```

Replace `+1234567890` with a valid phone number (including country code) to receive the test message.

## Troubleshooting

### Common Issues

1. **Authentication Error (401)**
   - Check that your Account SID and Auth Token are correct
   - Verify that your Twilio account is active

2. **Invalid Phone Number Format (21211)**
   - Make sure to include the country code (e.g., +27 for South Africa)
   - Example of valid format: +27123456789

3. **Unverified Phone Number in Trial Mode (21608)**
   - Twilio trial accounts can only send messages to verified numbers
   - Verify the recipient number in your [Twilio Console](https://www.twilio.com/console/phone-numbers/verified)

4. **Rate Limiting**
   - Twilio has rate limits on how many messages you can send
   - Check the [Twilio rate limits documentation](https://www.twilio.com/docs/messaging/sms/api#rate-limits)

### Getting Help

If you're still having issues, check the following resources:

- [Twilio SMS Troubleshooting Guide](https://www.twilio.com/docs/messaging/guides/troubleshooting-sms)
- [Twilio Support](https://support.twilio.com/)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth/phone-login)

## Production Considerations

When moving to production:

1. **Secure Your Auth Token**
   - Never expose your Auth Token in client-side code
   - Use environment variables and server-side code

2. **Monitor Usage**
   - Set up usage alerts in the Twilio Console
   - Monitor your Twilio usage to avoid unexpected charges

3. **Compliance**
   - Ensure you comply with local regulations regarding SMS messaging
   - Include opt-out instructions in your messages

4. **Fallback Mechanisms**
   - Implement email fallbacks for users who can't receive SMS
   - Consider using Twilio Verify for more advanced verification
