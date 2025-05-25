import { formatAmountForDisplay, validateAmount, formatCurrency } from '../payment';

describe('Payment Utilities', () => {
  describe('formatAmountForDisplay', () => {
    it('formats amount correctly for ZAR', () => {
      expect(formatAmountForDisplay(1000)).toBe('R10.00');
      expect(formatAmountForDisplay(100)).toBe('R1.00');
      expect(formatAmountForDisplay(0)).toBe('R0.00');
      expect(formatAmountForDisplay(100000)).toBe('R1,000.00');
    });

    it('handles negative amounts', () => {
      expect(formatAmountForDisplay(-1000)).toBe('-R10.00');
      expect(formatAmountForDisplay(-100)).toBe('-R1.00');
    });

    it('handles large amounts', () => {
      expect(formatAmountForDisplay(1000000)).toBe('R10,000.00');
      expect(formatAmountForDisplay(10000000)).toBe('R100,000.00');
    });
  });

  describe('validateAmount', () => {
    it('validates positive integer amounts', () => {
      expect(validateAmount(1000)).toBe(true);
      expect(validateAmount(0)).toBe(true);
      expect(validateAmount(100000000)).toBe(true); // Maximum amount
    });

    it('rejects invalid amounts', () => {
      expect(validateAmount(-1000)).toBe(false);
      expect(validateAmount(100000001)).toBe(false); // Exceeds maximum
      expect(validateAmount(10.5)).toBe(false); // Not an integer
      expect(validateAmount(NaN)).toBe(false);
      expect(validateAmount(Infinity)).toBe(false);
    });
  });

  describe('formatCurrency', () => {
    it('formats different currencies correctly', () => {
      // ZAR (2 decimal places)
      expect(formatCurrency(1000, 'ZAR')).toBe('R10.00');
      expect(formatCurrency(100000, 'ZAR')).toBe('R1,000.00');

      // JPY (0 decimal places)
      expect(formatCurrency(1000, 'JPY')).toBe('¥1,000');
      expect(formatCurrency(100000, 'JPY')).toBe('¥100,000');

      // BHD (3 decimal places)
      expect(formatCurrency(1000, 'BHD')).toBe('BD1.000');
      expect(formatCurrency(100000, 'BHD')).toBe('BD100.000');
    });

    it('handles edge cases', () => {
      expect(formatCurrency(0, 'ZAR')).toBe('R0.00');
      expect(formatCurrency(-1000, 'ZAR')).toBe('-R10.00');
      expect(formatCurrency(1000000000, 'ZAR')).toBe('R10,000,000.00');
    });

    it('uses correct currency symbols', () => {
      expect(formatCurrency(1000, 'USD')).toBe('$10.00');
      expect(formatCurrency(1000, 'EUR')).toBe('€10.00');
      expect(formatCurrency(1000, 'GBP')).toBe('£10.00');
    });

    it('handles large numbers with proper grouping', () => {
      expect(formatCurrency(1000000000, 'ZAR')).toBe('R10,000,000.00');
      expect(formatCurrency(1000000000, 'JPY')).toBe('¥1,000,000,000');
      expect(formatCurrency(1000000000, 'BHD')).toBe('BD1,000,000.000');
    });
  });
}); 