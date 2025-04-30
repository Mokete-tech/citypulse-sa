-- Setup Reactions System
-- This script creates the necessary tables and functions for the reactions feature

-- Create reactions table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.reactions (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    item_id INTEGER NOT NULL,
    item_type TEXT NOT NULL,
    reaction_type TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Add a unique constraint to prevent duplicate reactions
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'reactions_user_item_unique'
    ) THEN
        ALTER TABLE public.reactions
        ADD CONSTRAINT reactions_user_item_unique
        UNIQUE (user_id, item_id, item_type);
    END IF;
END
$$;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS reactions_item_idx ON public.reactions(item_id, item_type);
CREATE INDEX IF NOT EXISTS reactions_user_idx ON public.reactions(user_id);

-- Function to get reaction count for an item
CREATE OR REPLACE FUNCTION public.get_reaction_count(p_item_id INTEGER, p_item_type TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM reactions WHERE item_id = p_item_id AND item_type = p_item_type);
END;
$$;

-- Function to check if a user has reacted to an item
CREATE OR REPLACE FUNCTION public.has_user_reacted(p_user_id UUID, p_item_id INTEGER, p_item_type TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM reactions WHERE user_id = p_user_id AND item_id = p_item_id AND item_type = p_item_type);
END;
$$;

-- Set up Row Level Security (RLS)
-- Enable RLS on the reactions table
ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;

-- Create policies
-- 1. Allow users to see all reactions (public data)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'reactions' AND policyname = 'reactions_select_policy'
    ) THEN
        CREATE POLICY reactions_select_policy ON public.reactions
        FOR SELECT USING (true);
    END IF;
END
$$;

-- 2. Allow authenticated users to insert their own reactions
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'reactions' AND policyname = 'reactions_insert_policy'
    ) THEN
        CREATE POLICY reactions_insert_policy ON public.reactions
        FOR INSERT TO authenticated
        WITH CHECK (auth.uid() = user_id);
    END IF;
END
$$;

-- 3. Allow users to delete only their own reactions
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'reactions' AND policyname = 'reactions_delete_policy'
    ) THEN
        CREATE POLICY reactions_delete_policy ON public.reactions
        FOR DELETE TO authenticated
        USING (auth.uid() = user_id);
    END IF;
END
$$;

-- Grant permissions to authenticated and anon users
GRANT SELECT ON public.reactions TO anon, authenticated;
GRANT INSERT, DELETE ON public.reactions TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.reactions_id_seq TO authenticated;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION public.get_reaction_count TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_user_reacted TO anon, authenticated;

-- Add a trigger to update the item's reaction count (optional enhancement)
-- This would require adding a reactions_count column to the deals and events tables
-- Uncomment and modify if you want to implement this feature

/*
-- Add reactions_count column to deals and events tables if needed
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS reactions_count INTEGER DEFAULT 0;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS reactions_count INTEGER DEFAULT 0;

-- Create function to update reaction counts
CREATE OR REPLACE FUNCTION update_reaction_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Increment the count
        IF NEW.item_type = 'deal' THEN
            UPDATE public.deals SET reactions_count = reactions_count + 1 WHERE id = NEW.item_id;
        ELSIF NEW.item_type = 'event' THEN
            UPDATE public.events SET reactions_count = reactions_count + 1 WHERE id = NEW.item_id;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        -- Decrement the count
        IF OLD.item_type = 'deal' THEN
            UPDATE public.deals SET reactions_count = GREATEST(0, reactions_count - 1) WHERE id = OLD.item_id;
        ELSIF OLD.item_type = 'event' THEN
            UPDATE public.events SET reactions_count = GREATEST(0, reactions_count - 1) WHERE id = OLD.item_id;
        END IF;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$;

-- Create triggers
DROP TRIGGER IF EXISTS reactions_insert_trigger ON public.reactions;
CREATE TRIGGER reactions_insert_trigger
AFTER INSERT ON public.reactions
FOR EACH ROW
EXECUTE FUNCTION update_reaction_count();

DROP TRIGGER IF EXISTS reactions_delete_trigger ON public.reactions;
CREATE TRIGGER reactions_delete_trigger
AFTER DELETE ON public.reactions
FOR EACH ROW
EXECUTE FUNCTION update_reaction_count();
*/
