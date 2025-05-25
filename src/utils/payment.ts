/**
 * Formats an amount in cents to a display-friendly string with currency symbol
 * @param amount Amount in cents
 * @returns Formatted string (e.g., "R10.00")
 */
export const formatAmountForDisplay = (amount: number): string => {
  return formatCurrency(amount, 'ZAR');
};

/**
 * Validates a payment amount
 * @param amount Amount in cents
 * @returns Whether the amount is valid
 */
export const validateAmount = (amount: number): boolean => {
  // Amount must be a positive integer
  if (!Number.isInteger(amount) || amount < 0) {
    return false;
  }

  // Maximum amount is R1,000,000.00 (100,000,000 cents)
  const MAX_AMOUNT = 100000000;
  if (amount > MAX_AMOUNT) {
    return false;
  }

  return true;
};

/**
 * Formats an amount with the appropriate currency symbol and formatting
 * @param amount Amount in cents
 * @param currency Currency code (e.g., 'ZAR', 'USD')
 * @returns Formatted string with currency symbol
 */
export const formatCurrency = (amount: number, currency: string): string => {
  const formatter = new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency,
    minimumFractionDigits: getDecimalPlaces(currency),
    maximumFractionDigits: getDecimalPlaces(currency)
  });

  return formatter.format(amount / 100);
};

/**
 * Gets the number of decimal places for a currency
 * @param currency Currency code
 * @returns Number of decimal places
 */
const getDecimalPlaces = (currency: string): number => {
  // Currencies with no decimal places
  const zeroDecimalCurrencies = ['JPY', 'KRW', 'VND'];
  if (zeroDecimalCurrencies.includes(currency)) {
    return 0;
  }

  // Currencies with 3 decimal places
  const threeDecimalCurrencies = ['BHD', 'IQD', 'JOD', 'KWD', 'LYD', 'OMR', 'TND'];
  if (threeDecimalCurrencies.includes(currency)) {
    return 3;
  }

  // Default to 2 decimal places
  return 2;
};

/**
 * Validates a currency code
 * @param currency Currency code to validate
 * @returns Whether the currency code is valid
 */
export const validateCurrency = (currency: string): boolean => {
  try {
    // Check if the currency code is in the correct format
    if (!/^[A-Z]{3}$/.test(currency)) {
      return false;
    }

    // Try to format a number with the currency to validate it
    new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency
    });

    return true;
  } catch {
    return false;
  }
};

/**
 * Converts an amount from one currency to another
 * @param amount Amount in cents
 * @param fromCurrency Source currency code
 * @param toCurrency Target currency code
 * @param exchangeRate Exchange rate (target currency / source currency)
 * @returns Converted amount in cents
 */
export const convertCurrency = (
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  exchangeRate: number
): number => {
  // Validate currencies
  if (!validateCurrency(fromCurrency) || !validateCurrency(toCurrency)) {
    throw new Error('Invalid currency code');
  }

  // Convert amount using exchange rate
  const convertedAmount = amount * exchangeRate;

  // Round to nearest cent
  return Math.round(convertedAmount);
};

/**
 * Formats a payment status for display
 * @param status Payment status
 * @returns Formatted status string
 */
export const formatPaymentStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: 'Pending',
    succeeded: 'Successful',
    failed: 'Failed',
    refunded: 'Refunded'
  };

  return statusMap[status.toLowerCase()] || status;
};

/**
 * Validates a payment metadata object
 * @param metadata Payment metadata to validate
 * @returns Whether the metadata is valid
 */
export const validatePaymentMetadata = (metadata: any): boolean => {
  if (!metadata || typeof metadata !== 'object') {
    return false;
  }

  // Check required fields
  if (!metadata.item_type || !['deal', 'event'].includes(metadata.item_type)) {
    return false;
  }

  if (!metadata.item_id || typeof metadata.item_id !== 'string') {
    return false;
  }

  return true;
}; 