-- Create reactions table if it doesn't exist
CREATE TABLE IF NOT EXISTS reactions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id INTEGER NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('deal', 'event')),
  reaction_type TEXT NOT NULL DEFAULT 'tick',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, item_id, item_type)
);

-- Enable Row Level Security
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can view all reactions
CREATE POLICY "Anyone can view reactions"
  ON reactions FOR SELECT
  USING (true);

-- Users can only insert their own reactions
CREATE POLICY "Users can insert their own reactions"
  ON reactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own reactions
CREATE POLICY "Users can update their own reactions"
  ON reactions FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can only delete their own reactions
CREATE POLICY "Users can delete their own reactions"
  ON reactions FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to get reaction count for an item
CREATE OR REPLACE FUNCTION get_reaction_count(
  p_item_id INTEGER,
  p_item_type TEXT
)
RETURNS INTEGER AS $$
DECLARE
  reaction_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO reaction_count
  FROM reactions
  WHERE item_id = p_item_id
  AND item_type = p_item_type;
  
  RETURN reaction_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if a user has reacted to an item
CREATE OR REPLACE FUNCTION has_user_reacted(
  p_user_id UUID,
  p_item_id INTEGER,
  p_item_type TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  has_reacted BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM reactions
    WHERE user_id = p_user_id
    AND item_id = p_item_id
    AND item_type = p_item_type
  ) INTO has_reacted;
  
  RETURN has_reacted;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
