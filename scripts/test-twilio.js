/**
 * Script to test Twilio SMS integration
 * 
 * This script sends a test SMS message using Twilio to verify your configuration.
 * 
 * Usage:
 * node scripts/test-twilio.js +1234567890
 * 
 * Where +1234567890 is the phone number to send the test message to (including country code)
 */

require('dotenv').config();
const axios = require('axios');
const qs = require('querystring');

// Get environment variables
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || 'AC8df01f1461b436ff688395221a76bb04';
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || '92b971ae5e33b59a8904cd4072a13fcc';
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || '';

// Get the phone number from command line arguments
const toPhoneNumber = process.argv[2];

if (!toPhoneNumber) {
  console.error('Error: Please provide a phone number as an argument');
  console.error('Usage: node scripts/test-twilio.js +1234567890');
  process.exit(1);
}

if (!TWILIO_PHONE_NUMBER) {
  console.error('Warning: TWILIO_PHONE_NUMBER is not set in your .env file');
  console.error('You can still test with a Messaging Service SID instead');
}

async function sendTestSMS() {
  console.log(`Sending test SMS to ${toPhoneNumber}...`);
  
  try {
    // Prepare the request data
    const data = {
      To: toPhoneNumber,
      Body: 'This is a test message from CityPulse South Africa. Your verification code is 123456.',
    };
    
    // Use either a phone number or messaging service SID
    if (TWILIO_PHONE_NUMBER) {
      data.From = TWILIO_PHONE_NUMBER;
    } else {
      data.MessagingServiceSid = 'MG123456789'; // Replace with your actual Messaging Service SID
    }
    
    // Make the request to Twilio API
    const response = await axios({
      method: 'post',
      url: `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      data: qs.stringify(data),
      auth: {
        username: TWILIO_ACCOUNT_SID,
        password: TWILIO_AUTH_TOKEN
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    console.log('✅ SMS sent successfully!');
    console.log('Message SID:', response.data.sid);
    console.log('Status:', response.data.status);
    
  } catch (error) {
    console.error('❌ Error sending SMS:');
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(`Status: ${error.response.status}`);
      console.error('Error details:', error.response.data);
      
      // Provide helpful troubleshooting tips based on common errors
      if (error.response.status === 401) {
        console.error('\nTroubleshooting tips:');
        console.error('- Check that your TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN are correct');
        console.error('- Verify that your Twilio account is active and not suspended');
      } else if (error.response.data && error.response.data.code === 21608) {
        console.error('\nTroubleshooting tips:');
        console.error('- Your Twilio account may be in trial mode, which restricts sending to unverified numbers');
        console.error('- Verify the recipient phone number in your Twilio console: https://www.twilio.com/console/phone-numbers/verified');
      } else if (error.response.data && error.response.data.code === 21211) {
        console.error('\nTroubleshooting tips:');
        console.error('- The phone number format is invalid. Make sure to include the country code (e.g., +1 for US)');
        console.error('- Example of valid format: +27123456789 for South Africa');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from Twilio API');
      console.error('\nTroubleshooting tips:');
      console.error('- Check your internet connection');
      console.error('- Verify that the Twilio API endpoint is accessible from your network');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up the request:', error.message);
    }
    
    process.exit(1);
  }
}

// Run the test
sendTestSMS();
