import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@12.18.0?target=deno";

// Get environment variables
const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

// Validate environment variables
if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
  throw new Error("Missing Stripe environment variables");
}

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing Supabase environment variables");
}

// Initialize Stripe
const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

// Initialize Supabase client
const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY
);

// Helper function to log events
const logEvent = async (event: any, status: 'success' | 'error', message?: string) => {
  try {
    await supabase.from('stripe_webhook_logs').insert({
      event_id: event.id,
      event_type: event.type,
      status,
      message: message || '',
      payload: event.data.object,
      created_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to log webhook event:', error);
  }
};

serve(async (req) => {
  try {
    // Get the signature from the headers
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      throw new Error('No Stripe signature found');
    }

    // Get the raw body
    const body = await req.text();

    // Verify the event
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return new Response(
        JSON.stringify({ error: 'Webhook signature verification failed' }),
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        
        // Update payment intent status in database
        const { error } = await supabase
          .from('payment_intents')
          .update({ status: 'succeeded' })
          .eq('id', paymentIntent.id);

        if (error) {
          throw new Error(`Failed to update payment intent: ${error.message}`);
        }

        // Create transaction record
        const { error: transactionError } = await supabase
          .from('transactions')
          .insert({
            id: `txn_${Date.now()}`,
            payment_intent_id: paymentIntent.id,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            status: 'succeeded',
            type: 'payment',
            description: paymentIntent.description || 'Payment successful',
            metadata: paymentIntent.metadata
          });

        if (transactionError) {
          throw new Error(`Failed to create transaction: ${transactionError.message}`);
        }

        // Update item status if needed
        if (paymentIntent.metadata?.item_type && paymentIntent.metadata?.item_id) {
          const { error: updateError } = await supabase
            .from(paymentIntent.metadata.item_type === 'deal' ? 'deals' : 'events')
            .update({
              status: 'active',
              paid: true,
              payment_id: paymentIntent.id
            })
            .eq('id', paymentIntent.metadata.item_id);

          if (updateError) {
            throw new Error(`Failed to update item status: ${updateError.message}`);
          }
        }

        await logEvent(event, 'success');
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        
        // Update payment intent status
        const { error } = await supabase
          .from('payment_intents')
          .update({ 
            status: 'failed',
            metadata: {
              ...paymentIntent.metadata,
              failure_reason: paymentIntent.last_payment_error?.message
            }
          })
          .eq('id', paymentIntent.id);

        if (error) {
          throw new Error(`Failed to update payment intent: ${error.message}`);
        }

        await logEvent(event, 'success');
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object;
        
        // Create refund record
        const { error } = await supabase
          .from('refunds')
          .insert({
            id: `ref_${Date.now()}`,
            transaction_id: charge.payment_intent,
            amount: charge.amount_refunded,
            currency: charge.currency,
            status: 'succeeded',
            reason: charge.refund_reason || 'Customer requested refund',
            metadata: charge.metadata
          });

        if (error) {
          throw new Error(`Failed to create refund record: ${error.message}`);
        }

        await logEvent(event, 'success');
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
        await logEvent(event, 'success', 'Unhandled event type');
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    await logEvent(event, 'error', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}); 