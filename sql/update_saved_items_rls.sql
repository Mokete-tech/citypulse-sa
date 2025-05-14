-- Ensure the saved_items table exists
CREATE TABLE IF NOT EXISTS saved_items (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id INTEGER NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('deal', 'event')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, item_id, item_type)
);

-- Enable Row Level Security
ALTER TABLE saved_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own saved items" ON saved_items;
DROP POLICY IF EXISTS "Users can insert their own saved items" ON saved_items;
DROP POLICY IF EXISTS "Users can delete their own saved items" ON saved_items;

-- Create RLS policies for saved_items table
-- Policy: Users can view their own saved items
CREATE POLICY "Users can view their own saved items"
  ON saved_items FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own saved items
CREATE POLICY "Users can insert their own saved items"
  ON saved_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own saved items
CREATE POLICY "Users can delete their own saved items"
  ON saved_items FOR DELETE
  USING (auth.uid() = user_id);

-- Create or replace function to toggle saved items
CREATE OR REPLACE FUNCTION toggle_saved_item(
  p_user_id UUID,
  p_item_id INTEGER,
  p_item_type TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  item_exists BOOLEAN;
BEGIN
  -- Check if the item is already saved
  SELECT EXISTS (
    SELECT 1 FROM saved_items
    WHERE user_id = p_user_id
    AND item_id = p_item_id
    AND item_type = p_item_type
  ) INTO item_exists;

  -- If item exists, delete it; otherwise, insert it
  IF item_exists THEN
    DELETE FROM saved_items
    WHERE user_id = p_user_id
    AND item_id = p_item_id
    AND item_type = p_item_type;
    RETURN FALSE;
  ELSE
    INSERT INTO saved_items (user_id, item_id, item_type)
    VALUES (p_user_id, p_item_id, p_item_type);
    RETURN TRUE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
