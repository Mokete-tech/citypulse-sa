-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  preferences JSONB DEFAULT '{"categories": [], "locations": [], "notification_email": true, "notification_sms": false, "notification_push": true}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create saved_items table
CREATE TABLE IF NOT EXISTS saved_items (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id INTEGER NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('deal', 'event')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, item_id, item_type)
);

-- Create function to handle profile creation on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, phone)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.phone
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create RLS policies for profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create RLS policies for saved_items table
ALTER TABLE saved_items ENABLE ROW LEVEL SECURITY;

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

-- Create function to toggle saved items
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
