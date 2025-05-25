import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { usePayment } from '../usePayment';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Mock dependencies
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: jest.fn().mockResolvedValue({ error: null }),
      select: jest.fn().mockResolvedValue({ data: [], error: null })
    }))
  }
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

describe('usePayment', () => {
  const mockPayment = {
    id: 'pi_test_123',
    amount: 1000,
    currency: 'ZAR',
    status: 'succeeded',
    metadata: {
      item_type: 'deal',
      item_id: '123'
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with correct default values', () => {
    const { result } = renderHook(() => usePayment());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.payment).toBeNull();
  });

  it('creates payment successfully', async () => {
    supabase.from().insert.mockResolvedValueOnce({
      data: mockPayment,
      error: null
    });

    const { result } = renderHook(() => usePayment());

    await act(async () => {
      await result.current.createPayment({
        amount: 1000,
        currency: 'ZAR',
        metadata: {
          item_type: 'deal',
          item_id: '123'
        }
      });
    });

    expect(result.current.payment).toEqual(mockPayment);
    expect(result.current.error).toBeNull();
    expect(toast.success).toHaveBeenCalled();
  });

  it('handles payment creation error', async () => {
    const error = new Error('Failed to create payment');
    supabase.from().insert.mockResolvedValueOnce({
      data: null,
      error
    });

    const { result } = renderHook(() => usePayment());

    await act(async () => {
      await result.current.createPayment({
        amount: 1000,
        currency: 'ZAR',
        metadata: {
          item_type: 'deal',
          item_id: '123'
        }
      });
    });

    expect(result.current.payment).toBeNull();
    expect(result.current.error).toBe(error);
    expect(toast.error).toHaveBeenCalled();
  });

  it('fetches payment history successfully', async () => {
    const mockPayments = [mockPayment];
    supabase.from().select.mockResolvedValueOnce({
      data: mockPayments,
      error: null
    });

    const { result } = renderHook(() => usePayment());

    await act(async () => {
      await result.current.fetchPaymentHistory();
    });

    expect(result.current.paymentHistory).toEqual(mockPayments);
    expect(result.current.error).toBeNull();
  });

  it('handles payment history fetch error', async () => {
    const error = new Error('Failed to fetch payment history');
    supabase.from().select.mockResolvedValueOnce({
      data: null,
      error
    });

    const { result } = renderHook(() => usePayment());

    await act(async () => {
      await result.current.fetchPaymentHistory();
    });

    expect(result.current.paymentHistory).toEqual([]);
    expect(result.current.error).toBe(error);
    expect(toast.error).toHaveBeenCalled();
  });

  it('validates payment amount before creation', async () => {
    const { result } = renderHook(() => usePayment());

    await act(async () => {
      await result.current.createPayment({
        amount: -1000,
        currency: 'ZAR',
        metadata: {
          item_type: 'deal',
          item_id: '123'
        }
      });
    });

    expect(result.current.payment).toBeNull();
    expect(result.current.error).toBeTruthy();
    expect(toast.error).toHaveBeenCalled();
  });

  it('handles payment status updates', async () => {
    const updatedPayment = {
      ...mockPayment,
      status: 'failed'
    };

    supabase.from().insert.mockResolvedValueOnce({
      data: mockPayment,
      error: null
    });

    supabase.from().update.mockResolvedValueOnce({
      data: updatedPayment,
      error: null
    });

    const { result } = renderHook(() => usePayment());

    await act(async () => {
      await result.current.createPayment({
        amount: 1000,
        currency: 'ZAR',
        metadata: {
          item_type: 'deal',
          item_id: '123'
        }
      });

      await result.current.updatePaymentStatus(mockPayment.id, 'failed');
    });

    expect(result.current.payment).toEqual(updatedPayment);
    expect(result.current.error).toBeNull();
  });

  it('handles payment status update error', async () => {
    const error = new Error('Failed to update payment status');
    supabase.from().update.mockResolvedValueOnce({
      data: null,
      error
    });

    const { result } = renderHook(() => usePayment());

    await act(async () => {
      await result.current.updatePaymentStatus(mockPayment.id, 'failed');
    });

    expect(result.current.error).toBe(error);
    expect(toast.error).toHaveBeenCalled();
  });
}); 