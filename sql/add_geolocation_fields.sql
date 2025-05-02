-- Add geolocation fields to deals table
ALTER TABLE deals 
ADD COLUMN latitude DOUBLE PRECISION,
ADD COLUMN longitude DOUBLE PRECISION,
ADD COLUMN address TEXT;

-- Add geolocation fields to events table
ALTER TABLE events 
ADD COLUMN latitude DOUBLE PRECISION,
ADD COLUMN longitude DOUBLE PRECISION,
ADD COLUMN address TEXT;

-- Create a function to calculate distance between two points
CREATE OR REPLACE FUNCTION calculate_distance(
  lat1 DOUBLE PRECISION,
  lon1 DOUBLE PRECISION,
  lat2 DOUBLE PRECISION,
  lon2 DOUBLE PRECISION
) RETURNS DOUBLE PRECISION AS $$
DECLARE
  R DOUBLE PRECISION := 6371; -- Earth radius in kilometers
  dLat DOUBLE PRECISION;
  dLon DOUBLE PRECISION;
  a DOUBLE PRECISION;
  c DOUBLE PRECISION;
  d DOUBLE PRECISION;
BEGIN
  -- Convert degrees to radians
  dLat := radians(lat2 - lat1);
  dLon := radians(lon2 - lon1);
  lat1 := radians(lat1);
  lat2 := radians(lat2);

  -- Haversine formula
  a := sin(dLat/2) * sin(dLat/2) + sin(dLon/2) * sin(dLon/2) * cos(lat1) * cos(lat2);
  c := 2 * asin(sqrt(a));
  d := R * c;

  RETURN d;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get nearby deals
CREATE OR REPLACE FUNCTION get_nearby_deals(
  user_lat DOUBLE PRECISION,
  user_lng DOUBLE PRECISION,
  radius_km DOUBLE PRECISION DEFAULT 5
)
RETURNS TABLE (
  id INTEGER,
  title TEXT,
  description TEXT,
  merchant_name TEXT,
  category TEXT,
  expiration_date TEXT,
  discount TEXT,
  image_url TEXT,
  featured BOOLEAN,
  distance DOUBLE PRECISION
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.id,
    d.title,
    d.description,
    d.merchant_name,
    d.category,
    d.expiration_date,
    d.discount,
    d.image_url,
    d.featured,
    calculate_distance(user_lat, user_lng, d.latitude, d.longitude) AS distance
  FROM 
    deals d
  WHERE 
    d.status = 'Active'
    AND calculate_distance(user_lat, user_lng, d.latitude, d.longitude) <= radius_km
  ORDER BY 
    distance ASC;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get nearby events
CREATE OR REPLACE FUNCTION get_nearby_events(
  user_lat DOUBLE PRECISION,
  user_lng DOUBLE PRECISION,
  radius_km DOUBLE PRECISION DEFAULT 5
)
RETURNS TABLE (
  id INTEGER,
  title TEXT,
  description TEXT,
  merchant_name TEXT,
  category TEXT,
  date TEXT,
  time TEXT,
  location TEXT,
  price TEXT,
  image_url TEXT,
  featured BOOLEAN,
  distance DOUBLE PRECISION
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.id,
    e.title,
    e.description,
    e.merchant_name,
    e.category,
    e.date,
    e.time,
    e.location,
    e.price,
    e.image_url,
    e.featured,
    calculate_distance(user_lat, user_lng, e.latitude, e.longitude) AS distance
  FROM 
    events e
  WHERE 
    e.status = 'Active'
    AND calculate_distance(user_lat, user_lng, e.latitude, e.longitude) <= radius_km
  ORDER BY 
    distance ASC;
END;
$$ LANGUAGE plpgsql;
