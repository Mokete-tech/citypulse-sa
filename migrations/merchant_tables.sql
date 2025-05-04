-- Create merchant_profiles table
CREATE TABLE IF NOT EXISTS merchant_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  business_name TEXT NOT NULL,
  business_description TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  website_url TEXT,
  logo_url TEXT,
  banner_url TEXT,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  location_lat FLOAT,
  location_lng FLOAT,
  business_hours JSONB,
  categories TEXT[],
  is_verified BOOLEAN DEFAULT FALSE,
  verification_documents JSONB,
  subscription_tier TEXT DEFAULT 'free',
  subscription_status TEXT DEFAULT 'active',
  subscription_expiry TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create merchant_deals table
CREATE TABLE IF NOT EXISTS merchant_deals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  merchant_id UUID REFERENCES merchant_profiles(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  discount TEXT NOT NULL,
  location TEXT,
  location_lat FLOAT,
  location_lng FLOAT,
  media_url TEXT,
  media_type TEXT DEFAULT 'image',
  is_premium BOOLEAN DEFAULT FALSE,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  expiration_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'pending',
  views INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  reactions INTEGER DEFAULT 0,
  target_audience TEXT[],
  terms_conditions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create merchant_events table
CREATE TABLE IF NOT EXISTS merchant_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  merchant_id UUID REFERENCES merchant_profiles(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT,
  location_lat FLOAT,
  location_lng FLOAT,
  media_url TEXT,
  media_type TEXT DEFAULT 'image',
  is_premium BOOLEAN DEFAULT FALSE,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  event_end_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending',
  views INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  reactions INTEGER DEFAULT 0,
  capacity INTEGER,
  price TEXT,
  ticket_url TEXT,
  target_audience TEXT[],
  terms_conditions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create merchant_payments table
CREATE TABLE IF NOT EXISTS merchant_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  merchant_id UUID REFERENCES merchant_profiles(id) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'ZAR',
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending',
  transaction_id TEXT,
  item_id UUID,
  item_type TEXT,
  subscription_period TEXT,
  invoice_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create merchant_analytics table
CREATE TABLE IF NOT EXISTS merchant_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  merchant_id UUID REFERENCES merchant_profiles(id) NOT NULL,
  date DATE NOT NULL,
  views INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  reactions INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  revenue DECIMAL(10, 2) DEFAULT 0,
  item_id UUID,
  item_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (merchant_id, date, item_id, item_type)
);

-- Create RLS policies for merchant_profiles
ALTER TABLE merchant_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchants can view their own profiles"
  ON merchant_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Merchants can update their own profiles"
  ON merchant_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Merchants can insert their own profiles"
  ON merchant_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for merchant_deals
ALTER TABLE merchant_deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active deals"
  ON merchant_deals FOR SELECT
  USING (status = 'active');

CREATE POLICY "Merchants can view all their deals"
  ON merchant_deals FOR SELECT
  USING (merchant_id IN (SELECT id FROM merchant_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Merchants can insert their own deals"
  ON merchant_deals FOR INSERT
  WITH CHECK (merchant_id IN (SELECT id FROM merchant_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Merchants can update their own deals"
  ON merchant_deals FOR UPDATE
  USING (merchant_id IN (SELECT id FROM merchant_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Merchants can delete their own deals"
  ON merchant_deals FOR DELETE
  USING (merchant_id IN (SELECT id FROM merchant_profiles WHERE user_id = auth.uid()));

-- Create RLS policies for merchant_events
ALTER TABLE merchant_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active events"
  ON merchant_events FOR SELECT
  USING (status = 'active');

CREATE POLICY "Merchants can view all their events"
  ON merchant_events FOR SELECT
  USING (merchant_id IN (SELECT id FROM merchant_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Merchants can insert their own events"
  ON merchant_events FOR INSERT
  WITH CHECK (merchant_id IN (SELECT id FROM merchant_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Merchants can update their own events"
  ON merchant_events FOR UPDATE
  USING (merchant_id IN (SELECT id FROM merchant_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Merchants can delete their own events"
  ON merchant_events FOR DELETE
  USING (merchant_id IN (SELECT id FROM merchant_profiles WHERE user_id = auth.uid()));

-- Create RLS policies for merchant_payments
ALTER TABLE merchant_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchants can view their own payments"
  ON merchant_payments FOR SELECT
  USING (merchant_id IN (SELECT id FROM merchant_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Merchants can insert their own payments"
  ON merchant_payments FOR INSERT
  WITH CHECK (merchant_id IN (SELECT id FROM merchant_profiles WHERE user_id = auth.uid()));

-- Create RLS policies for merchant_analytics
ALTER TABLE merchant_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchants can view their own analytics"
  ON merchant_analytics FOR SELECT
  USING (merchant_id IN (SELECT id FROM merchant_profiles WHERE user_id = auth.uid()));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS merchant_deals_merchant_id_idx ON merchant_deals(merchant_id);
CREATE INDEX IF NOT EXISTS merchant_deals_status_idx ON merchant_deals(status);
CREATE INDEX IF NOT EXISTS merchant_deals_category_idx ON merchant_deals(category);
CREATE INDEX IF NOT EXISTS merchant_deals_expiration_date_idx ON merchant_deals(expiration_date);

CREATE INDEX IF NOT EXISTS merchant_events_merchant_id_idx ON merchant_events(merchant_id);
CREATE INDEX IF NOT EXISTS merchant_events_status_idx ON merchant_events(status);
CREATE INDEX IF NOT EXISTS merchant_events_category_idx ON merchant_events(category);
CREATE INDEX IF NOT EXISTS merchant_events_event_date_idx ON merchant_events(event_date);

CREATE INDEX IF NOT EXISTS merchant_payments_merchant_id_idx ON merchant_payments(merchant_id);
CREATE INDEX IF NOT EXISTS merchant_payments_payment_status_idx ON merchant_payments(payment_status);

CREATE INDEX IF NOT EXISTS merchant_analytics_merchant_id_idx ON merchant_analytics(merchant_id);
CREATE INDEX IF NOT EXISTS merchant_analytics_date_idx ON merchant_analytics(date);
