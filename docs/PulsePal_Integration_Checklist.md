# PulsePal Integration Checklist

This checklist ensures that PulsePal (the AI assistant) is integrated into your CityPulse app without breaking existing authentication, Stripe, or Supabase features.

## Environment Variables
Make sure your `.env.local` file contains the following keys:
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
VITE_GEMINI_API_KEY=your-gemini-api-key-here
```

## Supabase Client Integration
- File: `src/integrations/supabase/client.ts`
- Should export a Supabase client using the environment variables.

## Stripe Client Integration
- File: `src/integrations/stripe/client.ts`
- Should export a Stripe promise using the publishable key from environment variables.

## Auth Context
- File: `src/contexts/AuthContext.tsx`
- Provides user authentication context using Supabase.
- Should remain unchanged to avoid breaking auth.

## Main App File
- File: `src/App.tsx`
- Should import and use `<PulsePal apiKey={import.meta.env.VITE_GEMINI_API_KEY || ""} />`
- Should wrap the app in `<AuthProvider>`

## PulsePal Component
- File: `src/components/ai/PulsePal.tsx`
- Implements the AI assistant UI and logic.
- Fetches deals from Supabase and queries Gemini API.

## Other Core Components
- Ensure your existing components like `DealsCrud`, `PaymentsList`, and `PaymentForm` remain unchanged.

## Final Checks
- `.env.local` has all required keys.
- All files above exist and are correctly implemented.
- Test the app to verify PulsePal works alongside authentication and payments.

---

If you need to see or update any of these files, refer to the integration guide or ask for assistance.
