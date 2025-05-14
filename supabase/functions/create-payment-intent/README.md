# Create Payment Intent Edge Function

This Supabase Edge Function creates a Stripe Payment Intent and returns the client secret to the client.

## Setup

1. Copy `.env.example` to `.env` and fill in the values
2. Deploy the function to your Supabase project:

```bash
supabase functions deploy create-payment-intent --project-ref your-project-ref
```

3. Set the environment variables:

```bash
supabase secrets set --env-file .env --project-ref your-project-ref
```

## Usage

Send a POST request to the function with the following JSON body:

```json
{
  "amount": 1000, // Amount in cents
  "currency": "zar", // Optional, defaults to "zar"
  "metadata": {     // Optional metadata
    "user_id": "123",
    "item_type": "deal",
    "item_id": 456,
    "item_name": "Example Deal",
    "premium": true
  }
}
```

The function will return a JSON response with the client secret:

```json
{
  "clientSecret": "pi_123_secret_456",
  "paymentIntentId": "pi_123",
  "status": "requires_payment_method",
  "amount": 1000,
  "currency": "zar"
}
```

## Error Handling

If there's an error, the function will return a JSON response with an error message:

```json
{
  "error": "Error message",
  "success": false
}
```

## Database Integration

The function stores payment intents in the `payment_intents` table for tracking purposes.
