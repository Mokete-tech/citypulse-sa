/**
 * Payment status enum
 */
export enum PaymentStatus {
  PENDING = 'pending',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

/**
 * Payment type enum
 */
export enum PaymentType {
  PAYMENT = 'payment',
  REFUND = 'refund',
  TRANSFER = 'transfer'
}

/**
 * Payment method enum
 */
export enum PaymentMethod {
  CARD = 'card',
  EFT = 'eft',
  MOBILE = 'mobile',
  INSTANT = 'instant'
}

/**
 * Payment metadata interface
 */
export interface PaymentMetadata {
  item_type: 'deal' | 'event';
  item_id: string;
  [key: string]: any;
}

/**
 * Payment interface
 */
export interface Payment {
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

/**
 * Payment intent interface
 */
export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  metadata: PaymentMetadata;
  created_at?: string;
  updated_at?: string;
}

/**
 * Payment confirmation interface
 */
export interface PaymentConfirmation {
  payment_intent_id: string;
  status: PaymentStatus;
  transaction_id?: string;
  error_message?: string;
}

/**
 * Payment error interface
 */
export interface PaymentError {
  code: string;
  message: string;
  details?: any;
}

/**
 * Payment validation result interface
 */
export interface PaymentValidationResult {
  isValid: boolean;
  errors: string[];
} 