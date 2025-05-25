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
  user_id?: string;
  merchant_id?: string;
  description?: string;
  customer_email?: string;
  customer_name?: string;
  additional_data?: Record<string, string | number | boolean>;
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
  status: 'succeeded' | 'processing' | 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'canceled';
  clientSecret: string;
  paymentMethod?: PaymentMethod;
  created: number;
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
  type: 'card_error' | 'validation_error' | 'invalid_request_error' | 'api_error' | 'rate_limit_error';
  declineCode?: string;
  raw?: Record<string, unknown>;
}

/**
 * Payment validation result interface
 */
export interface PaymentValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account' | 'paypal';
  last4: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export interface PaymentResponse {
  success: boolean;
  error?: PaymentError;
  paymentIntent?: PaymentIntent;
}

export interface PaymentOptions {
  amount: number;
  currency: string;
  paymentMethodId?: string;
  customerId?: string;
  metadata?: Record<string, string>;
  description?: string;
}

export interface PaymentResult {
  success: boolean;
  error?: PaymentError;
  paymentIntent?: PaymentIntent;
  requiresAction?: boolean;
  actionType?: 'redirect' | 'confirm' | 'authenticate';
  actionUrl?: string;
}

export interface PaymentWebhookEvent {
  id: string;
  type: string;
  data: {
    object: PaymentIntent;
    previousAttributes?: Partial<PaymentIntent>;
  };
  created: number;
}

export interface PaymentWebhookHandler {
  (event: PaymentWebhookEvent): Promise<void>;
}

export interface PaymentConfig {
  publishableKey: string;
  secretKey: string;
  webhookSecret: string;
  apiVersion: string;
} 