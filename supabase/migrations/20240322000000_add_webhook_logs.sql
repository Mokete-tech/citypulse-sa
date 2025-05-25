-- Create webhook logs table
CREATE TABLE IF NOT EXISTS stripe_webhook_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    status TEXT NOT NULL,
    message TEXT,
    payload JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_webhook_logs_event_id ON stripe_webhook_logs(event_id);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_event_type ON stripe_webhook_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_status ON stripe_webhook_logs(status);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_created_at ON stripe_webhook_logs(created_at);

-- Enable RLS
ALTER TABLE stripe_webhook_logs ENABLE ROW LEVEL SECURITY;

-- Only allow admins to view webhook logs
CREATE POLICY "Only admins can view webhook logs"
    ON stripe_webhook_logs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    ); 