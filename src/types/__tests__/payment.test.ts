import { PaymentStatus, PaymentType, PaymentMethod } from '../payment';

describe('Payment Types', () => {
  describe('PaymentStatus', () => {
    it('has correct values', () => {
      expect(PaymentStatus.PENDING).toBe('pending');
      expect(PaymentStatus.SUCCEEDED).toBe('succeeded');
      expect(PaymentStatus.FAILED).toBe('failed');
      expect(PaymentStatus.REFUNDED).toBe('refunded');
    });

    it('is a valid enum', () => {
      const status = PaymentStatus.PENDING;
      expect(Object.values(PaymentStatus)).toContain(status);
    });
  });

  describe('PaymentType', () => {
    it('has correct values', () => {
      expect(PaymentType.PAYMENT).toBe('payment');
      expect(PaymentType.REFUND).toBe('refund');
      expect(PaymentType.TRANSFER).toBe('transfer');
    });

    it('is a valid enum', () => {
      const type = PaymentType.PAYMENT;
      expect(Object.values(PaymentType)).toContain(type);
    });
  });

  describe('PaymentMethod', () => {
    it('has correct values', () => {
      expect(PaymentMethod.CARD).toBe('card');
      expect(PaymentMethod.EFT).toBe('eft');
      expect(PaymentMethod.MOBILE).toBe('mobile');
      expect(PaymentMethod.INSTANT).toBe('instant');
    });

    it('is a valid enum', () => {
      const method = PaymentMethod.CARD;
      expect(Object.values(PaymentMethod)).toContain(method);
    });
  });

  describe('Type Guards', () => {
    it('validates payment status', () => {
      expect(isValidPaymentStatus('pending')).toBe(true);
      expect(isValidPaymentStatus('succeeded')).toBe(true);
      expect(isValidPaymentStatus('failed')).toBe(true);
      expect(isValidPaymentStatus('refunded')).toBe(true);
      expect(isValidPaymentStatus('invalid')).toBe(false);
    });

    it('validates payment type', () => {
      expect(isValidPaymentType('payment')).toBe(true);
      expect(isValidPaymentType('refund')).toBe(true);
      expect(isValidPaymentType('transfer')).toBe(true);
      expect(isValidPaymentType('invalid')).toBe(false);
    });

    it('validates payment method', () => {
      expect(isValidPaymentMethod('card')).toBe(true);
      expect(isValidPaymentMethod('eft')).toBe(true);
      expect(isValidPaymentMethod('mobile')).toBe(true);
      expect(isValidPaymentMethod('instant')).toBe(true);
      expect(isValidPaymentMethod('invalid')).toBe(false);
    });
  });
});

// Helper functions for type validation
function isValidPaymentStatus(status: string): status is PaymentStatus {
  return Object.values(PaymentStatus).includes(status as PaymentStatus);
}

function isValidPaymentType(type: string): type is PaymentType {
  return Object.values(PaymentType).includes(type as PaymentType);
}

function isValidPaymentMethod(method: string): method is PaymentMethod {
  return Object.values(PaymentMethod).includes(method as PaymentMethod);
} 