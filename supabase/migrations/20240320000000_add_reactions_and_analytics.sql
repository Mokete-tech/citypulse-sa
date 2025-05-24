-- Create reactions table
CREATE TABLE IF NOT EXISTS reactions (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    item_id BIGINT NOT NULL,
    item_type TEXT NOT NULL CHECK (item_type IN ('deal', 'event')),
    reaction_type TEXT NOT NULL CHECK (reaction_type IN ('like', 'heart')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, item_id, item_type, reaction_type)
);

-- Create analytics table
CREATE TABLE IF NOT EXISTS analytics (
    id BIGSERIAL PRIMARY KEY,
    business_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL CHECK (event_type IN ('view', 'reaction', 'share')),
    event_source TEXT NOT NULL CHECK (event_source IN ('deal', 'event')),
    source_id BIGINT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_reactions_item ON reactions(item_id, item_type);
CREATE INDEX IF NOT EXISTS idx_reactions_user ON reactions(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_business ON analytics(business_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event ON analytics(event_type, event_source, source_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at);

-- Add RLS policies
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Reactions policies
CREATE POLICY "Users can view all reactions"
    ON reactions FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create reactions"
    ON reactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reactions"
    ON reactions FOR DELETE
    USING (auth.uid() = user_id);

-- Analytics policies
CREATE POLICY "Businesses can view their own analytics"
    ON analytics FOR SELECT
    USING (auth.uid() = business_id);

CREATE POLICY "Authenticated users can create analytics"
    ON analytics FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create function to update reaction counts
CREATE OR REPLACE FUNCTION update_reaction_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Increment count
        IF NEW.item_type = 'deal' THEN
            UPDATE deals
            SET likes_count = likes_count + (CASE WHEN NEW.reaction_type = 'like' THEN 1 ELSE 0 END),
                hearts_count = hearts_count + (CASE WHEN NEW.reaction_type = 'heart' THEN 1 ELSE 0 END)
            WHERE id = NEW.item_id;
        ELSIF NEW.item_type = 'event' THEN
            UPDATE events
            SET likes_count = likes_count + (CASE WHEN NEW.reaction_type = 'like' THEN 1 ELSE 0 END),
                hearts_count = hearts_count + (CASE WHEN NEW.reaction_type = 'heart' THEN 1 ELSE 0 END)
            WHERE id = NEW.item_id;
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        -- Decrement count
        IF OLD.item_type = 'deal' THEN
            UPDATE deals
            SET likes_count = likes_count - (CASE WHEN OLD.reaction_type = 'like' THEN 1 ELSE 0 END),
                hearts_count = hearts_count - (CASE WHEN OLD.reaction_type = 'heart' THEN 1 ELSE 0 END)
            WHERE id = OLD.item_id;
        ELSIF OLD.item_type = 'event' THEN
            UPDATE events
            SET likes_count = likes_count - (CASE WHEN OLD.reaction_type = 'like' THEN 1 ELSE 0 END),
                hearts_count = hearts_count - (CASE WHEN OLD.reaction_type = 'heart' THEN 1 ELSE 0 END)
            WHERE id = OLD.item_id;
        END IF;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for reaction counts
CREATE TRIGGER update_deal_reaction_counts
    AFTER INSERT OR DELETE ON reactions
    FOR EACH ROW
    EXECUTE FUNCTION update_reaction_counts();

-- Add reaction count columns to deals and events if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'deals' AND column_name = 'likes_count') THEN
        ALTER TABLE deals ADD COLUMN likes_count INTEGER DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'deals' AND column_name = 'hearts_count') THEN
        ALTER TABLE deals ADD COLUMN hearts_count INTEGER DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'deals' AND column_name = 'comments_count') THEN
        ALTER TABLE deals ADD COLUMN comments_count INTEGER DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'likes_count') THEN
        ALTER TABLE events ADD COLUMN likes_count INTEGER DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'hearts_count') THEN
        ALTER TABLE events ADD COLUMN hearts_count INTEGER DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'comments_count') THEN
        ALTER TABLE events ADD COLUMN comments_count INTEGER DEFAULT 0;
    END IF;
END $$; 