-- Create payment_intents table to track Stripe payment intents
CREATE TABLE IF NOT EXISTS payment_intents (
  id BIGSERIAL PRIMARY KEY,
  payment_intent_id TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id),
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'zar',
  status TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create payment_logs table for detailed payment tracking
CREATE TABLE IF NOT EXISTS payment_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  payment_intent_id TEXT,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'zar',
  status TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create merchant_packages table to define available packages
CREATE TABLE IF NOT EXISTS merchant_packages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('deal', 'event')),
  variant TEXT NOT NULL CHECK (variant IN ('standard', 'premium')),
  price DECIMAL(10, 2) NOT NULL,
  duration_days INTEGER NOT NULL,
  features JSONB,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create merchant_subscriptions table to track merchant package purchases
CREATE TABLE IF NOT EXISTS merchant_subscriptions (
  id BIGSERIAL PRIMARY KEY,
  merchant_id UUID REFERENCES auth.users(id),
  package_id INTEGER REFERENCES merchant_packages(id),
  payment_intent_id TEXT,
  start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_date TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default packages
INSERT INTO merchant_packages (name, description, type, variant, price, duration_days, features)
VALUES
  ('Standard Deal', 'Basic visibility for your deal', 'deal', 'standard', 99.00, 30, 
   '["Basic listing", "7 days featured", "Standard analytics"]'::jsonb),
  
  ('Premium Deal', 'Maximum exposure for your deal', 'deal', 'premium', 250.00, 30, 
   '["Premium listing", "14 days featured", "Priority placement", "Advanced analytics", "Social media promotion"]'::jsonb),
  
  ('Standard Event', 'Basic visibility for your event', 'event', 'standard', 299.00, 60, 
   '["Basic listing", "7 days featured", "Standard analytics"]'::jsonb),
  
  ('Premium Event', 'Maximum exposure for your event', 'event', 'premium', 460.00, 60, 
   '["Premium listing", "21 days featured", "Priority placement", "Advanced analytics", "Social media promotion", "Email newsletter feature"]'::jsonb)
ON CONFLICT DO NOTHING;

-- Create RLS policies
ALTER TABLE payment_intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchant_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchant_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies for payment_intents
CREATE POLICY "Users can view their own payment intents"
  ON payment_intents FOR SELECT
  USING (auth.uid() = user_id);

-- Policies for payment_logs
CREATE POLICY "Users can view their own payment logs"
  ON payment_logs FOR SELECT
  USING (auth.uid() = user_id);

-- Policies for merchant_packages
CREATE POLICY "Anyone can view active merchant packages"
  ON merchant_packages FOR SELECT
  USING (is_active = TRUE);

-- Policies for merchant_subscriptions
CREATE POLICY "Merchants can view their own subscriptions"
  ON merchant_subscriptions FOR SELECT
  USING (auth.uid() = merchant_id);

-- Admin policies
CREATE POLICY "Admins can view all payment intents"
  ON payment_intents FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.role = 'admin'
  ));

CREATE POLICY "Admins can view all payment logs"
  ON payment_logs FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.role = 'admin'
  ));

CREATE POLICY "Admins can manage merchant packages"
  ON merchant_packages FOR ALL
  USING (EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.role = 'admin'
  ));

CREATE POLICY "Admins can view all merchant subscriptions"
  ON merchant_subscriptions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.role = 'admin'
  ));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_payment_intents_updated_at
BEFORE UPDATE ON payment_intents
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_merchant_packages_updated_at
BEFORE UPDATE ON merchant_packages
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_merchant_subscriptions_updated_at
BEFORE UPDATE ON merchant_subscriptions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
