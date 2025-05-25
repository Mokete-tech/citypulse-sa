-- Create payment_intents table
CREATE TABLE IF NOT EXISTS payment_intents (
    id TEXT PRIMARY KEY,
    amount INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'ZAR',
    status TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create payment_methods table
CREATE TABLE IF NOT EXISTS payment_methods (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    card_last4 TEXT,
    card_brand TEXT,
    card_exp_month INTEGER,
    card_exp_year INTEGER,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    payment_intent_id TEXT REFERENCES payment_intents(id) ON DELETE SET NULL,
    amount INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'ZAR',
    status TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create refunds table
CREATE TABLE IF NOT EXISTS refunds (
    id TEXT PRIMARY KEY,
    transaction_id TEXT REFERENCES transactions(id) ON DELETE SET NULL,
    amount INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'ZAR',
    status TEXT NOT NULL,
    reason TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE payment_intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;

-- Payment Intents policies
CREATE POLICY "Users can view their own payment intents"
    ON payment_intents FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create payment intents"
    ON payment_intents FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payment intents"
    ON payment_intents FOR UPDATE
    USING (auth.uid() = user_id);

-- Payment Methods policies
CREATE POLICY "Users can view their own payment methods"
    ON payment_methods FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own payment methods"
    ON payment_methods FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payment methods"
    ON payment_methods FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own payment methods"
    ON payment_methods FOR DELETE
    USING (auth.uid() = user_id);

-- Transactions policies
CREATE POLICY "Users can view their own transactions"
    ON transactions FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM payment_intents
        WHERE payment_intents.id = transactions.payment_intent_id
        AND payment_intents.user_id = auth.uid()
    ));

CREATE POLICY "Users can create transactions"
    ON transactions FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM payment_intents
        WHERE payment_intents.id = transactions.payment_intent_id
        AND payment_intents.user_id = auth.uid()
    ));

-- Refunds policies
CREATE POLICY "Users can view their own refunds"
    ON refunds FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM transactions
        JOIN payment_intents ON payment_intents.id = transactions.payment_intent_id
        WHERE transactions.id = refunds.transaction_id
        AND payment_intents.user_id = auth.uid()
    ));

CREATE POLICY "Users can create refunds"
    ON refunds FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM transactions
        JOIN payment_intents ON payment_intents.id = transactions.payment_intent_id
        WHERE transactions.id = refunds.transaction_id
        AND payment_intents.user_id = auth.uid()
    ));

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_payment_intents_user ON payment_intents(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_intents_status ON payment_intents(status);
CREATE INDEX IF NOT EXISTS idx_payment_methods_user ON payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_payment_intent ON transactions(payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_refunds_transaction ON refunds(transaction_id);
CREATE INDEX IF NOT EXISTS idx_refunds_status ON refunds(status);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_payment_intents_updated_at
    BEFORE UPDATE ON payment_intents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_methods_updated_at
    BEFORE UPDATE ON payment_methods
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_refunds_updated_at
    BEFORE UPDATE ON refunds
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 