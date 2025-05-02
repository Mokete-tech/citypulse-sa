
-- Function to increment deal views
CREATE OR REPLACE FUNCTION increment_deal_views(deal_id INT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.deals
  SET views = COALESCE(views, 0) + 1
  WHERE id = deal_id;
END;
$$;

-- Add RLS policy to allow anyone to call this function
GRANT EXECUTE ON FUNCTION increment_deal_views(INT) TO anon, authenticated;
