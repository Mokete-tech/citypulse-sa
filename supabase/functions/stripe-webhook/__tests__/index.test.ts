import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@12.18.0?target=deno";

// Mock dependencies
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      insert: jest.fn().mockResolvedValue({ error: null }),
      update: jest.fn().mockResolvedValue({ error: null })
    }))
  }))
}));

jest.mock('stripe', () => ({
  default: jest.fn(() => ({
    webhooks: {
      constructEvent: jest.fn()
    }
  }))
}));

describe('Stripe Webhook Handler', () => {
  const mockEvent = {
    id: 'evt_test_123',
    type: 'payment_intent.succeeded',
    data: {
      object: {
        id: 'pi_test_123',
        amount: 1000,
        currency: 'zar',
        status: 'succeeded',
        metadata: {
          item_type: 'deal',
          item_id: '123'
        }
      }
    }
  };

  const mockRequest = {
    headers: new Headers({
      'stripe-signature': 'test_signature'
    }),
    text: jest.fn().mockResolvedValue(JSON.stringify(mockEvent))
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.STRIPE_SECRET_KEY = 'test_key';
    process.env.STRIPE_WEBHOOK_SECRET = 'test_webhook_secret';
    process.env.SUPABASE_URL = 'test_url';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test_key';
  });

  it('handles payment_intent.succeeded event', async () => {
    const stripe = new Stripe('test_key');
    stripe.webhooks.constructEvent.mockReturnValue(mockEvent);

    const response = await serve(mockRequest);
    const data = await response.json();

    expect(data.received).toBe(true);
    expect(stripe.webhooks.constructEvent).toHaveBeenCalledWith(
      JSON.stringify(mockEvent),
      'test_signature',
      'test_webhook_secret'
    );
  });

  it('handles payment_intent.payment_failed event', async () => {
    const failedEvent = {
      ...mockEvent,
      type: 'payment_intent.payment_failed',
      data: {
        object: {
          ...mockEvent.data.object,
          status: 'failed',
          last_payment_error: {
            message: 'Card declined'
          }
        }
      }
    };

    const stripe = new Stripe('test_key');
    stripe.webhooks.constructEvent.mockReturnValue(failedEvent);

    const response = await serve(mockRequest);
    const data = await response.json();

    expect(data.received).toBe(true);
  });

  it('handles charge.refunded event', async () => {
    const refundEvent = {
      ...mockEvent,
      type: 'charge.refunded',
      data: {
        object: {
          payment_intent: 'pi_test_123',
          amount_refunded: 1000,
          currency: 'zar',
          refund_reason: 'requested_by_customer'
        }
      }
    };

    const stripe = new Stripe('test_key');
    stripe.webhooks.constructEvent.mockReturnValue(refundEvent);

    const response = await serve(mockRequest);
    const data = await response.json();

    expect(data.received).toBe(true);
  });

  it('handles invalid signature', async () => {
    const stripe = new Stripe('test_key');
    stripe.webhooks.constructEvent.mockImplementation(() => {
      throw new Error('Invalid signature');
    });

    const response = await serve(mockRequest);
    expect(response.status).toBe(400);
  });

  it('handles missing environment variables', async () => {
    delete process.env.STRIPE_SECRET_KEY;
    delete process.env.STRIPE_WEBHOOK_SECRET;
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;

    const response = await serve(mockRequest);
    expect(response.status).toBe(500);
  });

  it('handles database errors', async () => {
    const stripe = new Stripe('test_key');
    stripe.webhooks.constructEvent.mockReturnValue(mockEvent);

    const supabase = createClient('test_url', 'test_key');
    supabase.from().update.mockResolvedValue({ error: new Error('Database error') });

    const response = await serve(mockRequest);
    expect(response.status).toBe(500);
  });

  it('logs webhook events', async () => {
    const stripe = new Stripe('test_key');
    stripe.webhooks.constructEvent.mockReturnValue(mockEvent);

    const supabase = createClient('test_url', 'test_key');
    await serve(mockRequest);

    expect(supabase.from).toHaveBeenCalledWith('stripe_webhook_logs');
    expect(supabase.from().insert).toHaveBeenCalledWith(
      expect.objectContaining({
        event_id: 'evt_test_123',
        event_type: 'payment_intent.succeeded',
        status: 'success'
      })
    );
  });
}); 