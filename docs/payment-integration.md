# Payment Integration Guide

This guide explains how to set up payment processing for CityPulse South Africa.

## Stripe Integration

CityPulse uses Stripe for payment processing. Stripe is a popular payment gateway that supports credit cards, debit cards, and various local payment methods in South Africa.

### Setting Up Stripe

1. **Create a Stripe Account**:
   - Go to [Stripe.com](https://stripe.com) and sign up for an account
   - Complete the verification process for your business
   - Stripe is now available in South Africa and supports ZAR payments

2. **Get Your API Keys**:
   - In your Stripe Dashboard, go to Developers > API keys
   - Copy your Publishable Key and Secret Key
   - Add these to your environment variables:
     ```
     VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
     STRIPE_SECRET_KEY=sk_test_your_secret_key
     ```

3. **Configure Webhook Endpoints**:
   - Create a webhook endpoint in your Stripe Dashboard
   - Point it to `https://your-domain.com/api/stripe-webhook`
   - Select the events you want to receive (at minimum: `payment_intent.succeeded`, `payment_intent.failed`)
   - Copy the webhook signing secret and add it to your environment variables:
     ```
     STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
     ```

### Testing Stripe Integration

For testing, you can use Stripe's test cards:

- **Test Card Success**: `4242 4242 4242 4242`
- **Test Card Decline**: `4000 0000 0000 0002`
- **Test 3D Secure**: `4000 0000 0000 3220`

Use any future expiration date, any 3-digit CVC, and any postal code.

## Alternative Payment Methods

### PayFast

If you prefer to use PayFast instead of Stripe, you can modify the integration:

1. Replace the `StripePaymentForm` component with a `PayFastForm` component
2. Update your environment variables with PayFast credentials:
   ```
   VITE_PAYFAST_MERCHANT_ID=your_merchant_id
   VITE_PAYFAST_MERCHANT_KEY=your_merchant_key
   VITE_PAYFAST_PASSPHRASE=your_passphrase (if you use one)
   ```

### Yoco

Yoco is another popular South African payment provider:

1. Sign up for a Yoco account at [Yoco.com](https://www.yoco.com)
2. Integrate using their JavaScript SDK
3. Set up your environment variables:
   ```
   VITE_YOCO_PUBLIC_KEY=your_public_key
   ```

## Deployment Considerations

When deploying to Vercel:

1. Add all payment-related environment variables to your Vercel project
2. Ensure your webhook endpoints are accessible from the internet
3. Update your webhook URLs in your payment provider dashboard after deployment

For more information, see the [Vercel Deployment Guide](./vercel-deployment.md).
