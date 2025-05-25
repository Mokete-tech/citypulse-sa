-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    question TEXT NOT NULL,
    response TEXT NOT NULL,
    language VARCHAR(2) NOT NULL DEFAULT 'en',
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS conversations_timestamp_idx ON conversations(timestamp DESC);
CREATE INDEX IF NOT EXISTS conversations_language_idx ON conversations(language);
CREATE INDEX IF NOT EXISTS conversations_user_id_idx ON conversations(user_id);

-- Add RLS policies
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own conversations
CREATE POLICY "Users can view their own conversations"
    ON conversations
    FOR SELECT
    USING (auth.uid() = user_id);

-- Allow users to insert their own conversations
CREATE POLICY "Users can insert their own conversations"
    ON conversations
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own conversations
CREATE POLICY "Users can delete their own conversations"
    ON conversations
    FOR DELETE
    USING (auth.uid() = user_id);

-- Add function to clean up old conversations
CREATE OR REPLACE FUNCTION cleanup_old_conversations()
RETURNS void AS $$
BEGIN
    -- Delete conversations older than 30 days
    DELETE FROM conversations
    WHERE timestamp < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to run cleanup every day
SELECT cron.schedule(
    'cleanup-old-conversations',
    '0 0 * * *',  -- Run at midnight every day
    $$SELECT cleanup_old_conversations()$$
); 