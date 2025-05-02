-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  merchant_id TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'ZAR',
  payment_method TEXT NOT NULL,
  status TEXT NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('deal', 'event')),
  item_id INTEGER NOT NULL,
  item_name TEXT NOT NULL,
  premium BOOLEAN NOT NULL DEFAULT false,
  payment_intent_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Merchants can view their own payments
CREATE POLICY "Merchants can view their own payments"
  ON payments FOR SELECT
  USING (merchant_id = auth.uid()::text);

-- Users can view their own payments
CREATE POLICY "Users can view their own payments"
  ON payments FOR SELECT
  USING (user_id = auth.uid());

-- Only the system can insert payments
CREATE POLICY "System can insert payments"
  ON payments FOR INSERT
  WITH CHECK (true);

-- Create function to get merchant revenue
CREATE OR REPLACE FUNCTION get_merchant_revenue(
  p_merchant_id TEXT,
  p_start_date TIMESTAMP WITH TIME ZONE,
  p_end_date TIMESTAMP WITH TIME ZONE
)
RETURNS TABLE (
  total_revenue DECIMAL(10, 2),
  deal_revenue DECIMAL(10, 2),
  event_revenue DECIMAL(10, 2),
  premium_revenue DECIMAL(10, 2),
  standard_revenue DECIMAL(10, 2),
  transaction_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(SUM(amount), 0) AS total_revenue,
    COALESCE(SUM(CASE WHEN item_type = 'deal' THEN amount ELSE 0 END), 0) AS deal_revenue,
    COALESCE(SUM(CASE WHEN item_type = 'event' THEN amount ELSE 0 END), 0) AS event_revenue,
    COALESCE(SUM(CASE WHEN premium = true THEN amount ELSE 0 END), 0) AS premium_revenue,
    COALESCE(SUM(CASE WHEN premium = false THEN amount ELSE 0 END), 0) AS standard_revenue,
    COUNT(*) AS transaction_count
  FROM
    payments
  WHERE
    merchant_id = p_merchant_id
    AND status = 'succeeded'
    AND created_at >= p_start_date
    AND created_at <= p_end_date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
