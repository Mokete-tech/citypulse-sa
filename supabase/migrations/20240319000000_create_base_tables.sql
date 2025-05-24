-- Create deals table
CREATE TABLE IF NOT EXISTS deals (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    location TEXT,
    status TEXT DEFAULT 'active',
    image_url TEXT,
    discount_percentage INTEGER,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    location TEXT,
    status TEXT DEFAULT 'active',
    image_url TEXT,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies for deals and events
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Deals policies
CREATE POLICY "Anyone can view deals"
    ON deals FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create deals"
    ON deals FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own deals"
    ON deals FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own deals"
    ON deals FOR DELETE
    USING (auth.uid() = user_id);

-- Events policies
CREATE POLICY "Anyone can view events"
    ON events FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create events"
    ON events FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own events"
    ON events FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own events"
    ON events FOR DELETE
    USING (auth.uid() = user_id); 