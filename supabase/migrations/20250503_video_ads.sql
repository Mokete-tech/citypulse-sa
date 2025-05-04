-- Create video_ads table
CREATE TABLE IF NOT EXISTS video_ads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  advertiser_name TEXT,
  advertiser_logo TEXT,
  cta_text TEXT,
  cta_url TEXT,
  placement TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_shown TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ad_analytics table
CREATE TABLE IF NOT EXISTS ad_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ad_id UUID REFERENCES video_ads(id),
  event_type TEXT NOT NULL,
  placement TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS video_ads_placement_idx ON video_ads(placement);
CREATE INDEX IF NOT EXISTS video_ads_active_idx ON video_ads(active);
CREATE INDEX IF NOT EXISTS ad_analytics_ad_id_idx ON ad_analytics(ad_id);
CREATE INDEX IF NOT EXISTS ad_analytics_event_type_idx ON ad_analytics(event_type);

-- Add sample video ads
INSERT INTO video_ads (
  title,
  description,
  video_url,
  thumbnail_url,
  advertiser_name,
  advertiser_logo,
  cta_text,
  cta_url,
  placement,
  active,
  start_date,
  end_date
) VALUES 
(
  'Discover Cape Town',
  'Experience the beauty of Cape Town with our exclusive tour packages',
  'https://storage.googleapis.com/citypulse-assets/ads/cape-town-ad.mp4',
  'https://storage.googleapis.com/citypulse-assets/ads/cape-town-thumbnail.jpg',
  'Cape Town Tourism',
  'https://storage.googleapis.com/citypulse-assets/logos/cape-town-tourism.png',
  'Book Now',
  'https://capetown.travel',
  'feed',
  true,
  NOW(),
  NOW() + INTERVAL '30 days'
),
(
  'Johannesburg Food Festival',
  'Join us for the biggest food festival in Johannesburg',
  'https://storage.googleapis.com/citypulse-assets/ads/joburg-food-festival.mp4',
  'https://storage.googleapis.com/citypulse-assets/ads/joburg-food-festival-thumbnail.jpg',
  'Joburg Events',
  'https://storage.googleapis.com/citypulse-assets/logos/joburg-events.png',
  'Get Tickets',
  'https://joburgfoodfest.co.za',
  'detail',
  true,
  NOW(),
  NOW() + INTERVAL '14 days'
),
(
  'Durban Beach Resort',
  'Relax at the most luxurious beach resort in Durban',
  'https://storage.googleapis.com/citypulse-assets/ads/durban-resort.mp4',
  'https://storage.googleapis.com/citypulse-assets/ads/durban-resort-thumbnail.jpg',
  'Durban Resorts',
  'https://storage.googleapis.com/citypulse-assets/logos/durban-resorts.png',
  'Book Your Stay',
  'https://durbanresorts.co.za',
  'sidebar',
  true,
  NOW(),
  NOW() + INTERVAL '60 days'
);

-- Create RLS policies
ALTER TABLE video_ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_analytics ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read active video ads
CREATE POLICY "Anyone can read active video ads" 
  ON video_ads FOR SELECT 
  USING (active = true);

-- Only authenticated users can insert ad analytics
CREATE POLICY "Authenticated users can insert ad analytics" 
  ON ad_analytics FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

-- Only admins can manage video ads
CREATE POLICY "Admins can manage video ads" 
  ON video_ads FOR ALL 
  TO authenticated 
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Only admins can read ad analytics
CREATE POLICY "Admins can read ad analytics" 
  ON ad_analytics FOR SELECT 
  TO authenticated 
  USING (auth.jwt() ->> 'role' = 'admin');

-- Create function to update last_shown timestamp
CREATE OR REPLACE FUNCTION update_video_ad_last_shown()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE video_ads
  SET last_shown = NOW()
  WHERE id = NEW.ad_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update last_shown timestamp when an impression is recorded
CREATE TRIGGER update_video_ad_last_shown_trigger
AFTER INSERT ON ad_analytics
FOR EACH ROW
WHEN (NEW.event_type = 'impression')
EXECUTE FUNCTION update_video_ad_last_shown();
