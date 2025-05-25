import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { validateAmount } from '@/utils/payment';
import { PaymentStatus, PaymentType, PaymentMethod } from '@/types/payment';

interface PaymentMetadata {
  item_type: 'deal' | 'event';
  item_id: string;
  [key: string]: any;
}

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  type: PaymentType;
  method: PaymentMethod;
  metadata: PaymentMetadata;
  created_at?: string;
  updated_at?: string;
}

interface CreatePaymentParams {
  amount: number;
  currency: string;
  metadata: PaymentMetadata;
  retryCount?: number;
}

interface UsePaymentReturn {
  payment: Payment | null;
  paymentHistory: Payment[];
  loading: boolean;
  error: Error | null;
  createPayment: (params: CreatePaymentParams) => Promise<void>;
  fetchPaymentHistory: () => Promise<void>;
  updatePaymentStatus: (paymentId: string, status: PaymentStatus) => Promise<void>;
  retryFailedPayment: (paymentId: string) => Promise<void>;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function usePayment(): UsePaymentReturn {
  const [payment, setPayment] = useState<Payment | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createPayment = async ({ amount, currency, metadata, retryCount = 0 }: CreatePaymentParams) => {
    try {
      setLoading(true);
      setError(null);

      // Validate amount
      if (!validateAmount(amount)) {
        throw new Error('Invalid payment amount');
      }

      // Create payment record with retry logic
      let attempts = 0;
      let lastError: Error | null = null;

      while (attempts < MAX_RETRIES) {
        try {
          const { data, error: dbError } = await supabase
            .from('payment_intents')
            .insert({
              amount,
              currency,
              status: PaymentStatus.PENDING,
              type: PaymentType.PAYMENT,
              method: PaymentMethod.CARD,
              metadata
            })
            .select()
            .single();

          if (dbError) {
            throw dbError;
          }

          setPayment(data);
          toast.success('Payment initialized successfully');
          return;
        } catch (err: any) {
          lastError = err;
          attempts++;
          if (attempts < MAX_RETRIES) {
            await sleep(RETRY_DELAY * attempts);
          }
        }
      }

      throw lastError || new Error('Failed to create payment after multiple attempts');
    } catch (err: any) {
      setError(err);
      toast.error('Failed to create payment', {
        description: err.message || 'An error occurred while creating the payment'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: dbError } = await supabase
        .from('payment_intents')
        .select('*')
        .order('created_at', { ascending: false });

      if (dbError) {
        throw dbError;
      }

      setPaymentHistory(data || []);
    } catch (err: any) {
      setError(err);
      toast.error('Failed to fetch payment history', {
        description: err.message || 'An error occurred while fetching payment history'
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentStatus = async (paymentId: string, status: PaymentStatus) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: dbError } = await supabase
        .from('payment_intents')
        .update({ status })
        .eq('id', paymentId)
        .select()
        .single();

      if (dbError) {
        throw dbError;
      }

      setPayment(data);
      toast.success('Payment status updated successfully');
    } catch (err: any) {
      setError(err);
      toast.error('Failed to update payment status', {
        description: err.message || 'An error occurred while updating payment status'
      });
    } finally {
      setLoading(false);
    }
  };

  const retryFailedPayment = async (paymentId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Get the failed payment
      const { data: failedPayment, error: fetchError } = await supabase
        .from('payment_intents')
        .select('*')
        .eq('id', paymentId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      if (!failedPayment) {
        throw new Error('Payment not found');
      }

      // Create a new payment with the same details
      await createPayment({
        amount: failedPayment.amount,
        currency: failedPayment.currency,
        metadata: failedPayment.metadata,
        retryCount: 1
      });

      toast.success('Payment retry initiated');
    } catch (err: any) {
      setError(err);
      toast.error('Failed to retry payment', {
        description: err.message || 'An error occurred while retrying the payment'
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    payment,
    paymentHistory,
    loading,
    error,
    createPayment,
    fetchPaymentHistory,
    updatePaymentStatus,
    retryFailedPayment
  };
} 