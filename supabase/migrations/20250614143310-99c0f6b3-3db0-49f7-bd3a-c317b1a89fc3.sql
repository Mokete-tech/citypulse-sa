
-- Create enum types for better data integrity
CREATE TYPE public.deal_status AS ENUM ('active', 'expired', 'pending', 'suspended');
CREATE TYPE public.event_status AS ENUM ('upcoming', 'ongoing', 'completed', 'cancelled');
CREATE TYPE public.user_role AS ENUM ('user', 'business', 'admin');
CREATE TYPE public.category_type AS ENUM ('food_drink', 'retail', 'beauty', 'entertainment', 'health_fitness', 'travel', 'music', 'arts_culture', 'sports', 'business', 'education');

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  location TEXT,
  user_role user_role DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create businesses table
CREATE TABLE public.businesses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category category_type NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  logo_url TEXT,
  cover_image_url TEXT,
  rating DECIMAL(2,1) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
  total_reviews INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create deals table
CREATE TABLE public.deals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category category_type NOT NULL,
  discount_text TEXT,
  discount_percentage INTEGER,
  original_price DECIMAL(10,2),
  discounted_price DECIMAL(10,2),
  image_url TEXT,
  terms_conditions TEXT,
  max_redemptions INTEGER,
  current_redemptions INTEGER DEFAULT 0,
  status deal_status DEFAULT 'active',
  featured BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create events table
CREATE TABLE public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organizer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id UUID REFERENCES public.businesses(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  category category_type NOT NULL,
  venue TEXT,
  address TEXT,
  event_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  price DECIMAL(10,2),
  max_attendees INTEGER,
  current_attendees INTEGER DEFAULT 0,
  image_url TEXT,
  status event_status DEFAULT 'upcoming',
  premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user favorites table
CREATE TABLE public.user_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT check_favorite_type CHECK (
    (deal_id IS NOT NULL AND event_id IS NULL) OR
    (deal_id IS NULL AND event_id IS NOT NULL)
  )
);

-- Create deal redemptions table
CREATE TABLE public.deal_redemptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE,
  redemption_code TEXT UNIQUE,
  redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  used_at TIMESTAMP WITH TIME ZONE
);

-- Create event registrations table
CREATE TABLE public.event_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  attended BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, event_id)
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT check_review_target CHECK (
    (business_id IS NOT NULL AND deal_id IS NULL AND event_id IS NULL) OR
    (business_id IS NULL AND deal_id IS NOT NULL AND event_id IS NULL) OR
    (business_id IS NULL AND deal_id IS NULL AND event_id IS NOT NULL)
  )
);

-- Create reactions table for likes/dislikes
CREATE TABLE public.reactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  reaction_type TEXT CHECK (reaction_type IN ('like', 'dislike')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT check_reaction_target CHECK (
    (deal_id IS NOT NULL AND event_id IS NULL) OR
    (deal_id IS NULL AND event_id IS NOT NULL)
  ),
  UNIQUE(user_id, deal_id, event_id)
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deal_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for businesses
CREATE POLICY "Anyone can view businesses" ON public.businesses FOR SELECT USING (true);
CREATE POLICY "Business owners can update their businesses" ON public.businesses FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Authenticated users can create businesses" ON public.businesses FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Create RLS policies for deals
CREATE POLICY "Anyone can view active deals" ON public.deals FOR SELECT USING (status = 'active' OR auth.uid() IN (SELECT owner_id FROM public.businesses WHERE id = business_id));
CREATE POLICY "Business owners can manage their deals" ON public.deals FOR ALL USING (auth.uid() IN (SELECT owner_id FROM public.businesses WHERE id = business_id));

-- Create RLS policies for events
CREATE POLICY "Anyone can view upcoming events" ON public.events FOR SELECT USING (status = 'upcoming' OR auth.uid() = organizer_id);
CREATE POLICY "Event organizers can manage their events" ON public.events FOR ALL USING (auth.uid() = organizer_id);

-- Create RLS policies for user favorites
CREATE POLICY "Users can manage their favorites" ON public.user_favorites FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for deal redemptions
CREATE POLICY "Users can view their redemptions" ON public.deal_redemptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create redemptions" ON public.deal_redemptions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for event registrations
CREATE POLICY "Users can manage their registrations" ON public.event_registrations FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for reviews
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can manage their reviews" ON public.reviews FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for reactions
CREATE POLICY "Users can manage their reactions" ON public.reactions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view reaction counts" ON public.reactions FOR SELECT USING (true);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample data for businesses
INSERT INTO public.businesses (id, name, description, category, address, phone, email, rating, verified) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'The Burger Joint', 'Premium gourmet burgers with artisanal toppings', 'food_drink', '123 Main St, Cape Town', '+27-21-123-4567', 'info@burgerjoint.co.za', 4.8, true),
('550e8400-e29b-41d4-a716-446655440002', 'Fashion Forward', 'Latest fashion trends and designer clothing', 'retail', '456 Fashion Ave, Johannesburg', '+27-11-987-6543', 'hello@fashionforward.co.za', 4.6, true),
('550e8400-e29b-41d4-a716-446655440003', 'Stellenbosch Winery', 'Premium South African wines and tasting experiences', 'food_drink', '789 Wine Route, Stellenbosch', '+27-21-555-0123', 'tours@stellenboschwinwery.co.za', 4.9, true),
('550e8400-e29b-41d4-a716-446655440004', 'Serenity Spa', 'Luxury spa treatments and wellness services', 'beauty', '321 Wellness Blvd, Cape Town', '+27-21-444-5555', 'bookings@serenityspa.co.za', 4.9, true),
('550e8400-e29b-41d4-a716-446655440005', 'Cinema City', 'Modern cinema with latest movies and premium seating', 'entertainment', '654 Movie Plaza, Durban', '+27-31-777-8888', 'tickets@cinemacity.co.za', 4.5, true);

-- Insert sample deals
INSERT INTO public.deals (business_id, title, description, category, discount_text, discount_percentage, original_price, discounted_price, image_url, featured, expires_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', '50% Off Gourmet Burgers', 'Enjoy our premium beef burgers with artisanal toppings at half price!', 'food_drink', '50% OFF', 50, 120.00, 60.00, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=300&fit=crop', true, '2024-12-31'),
('550e8400-e29b-41d4-a716-446655440002', '30% Off Designer Clothing', 'Latest fashion trends at unbeatable prices. Limited time offer.', 'retail', '30% OFF', 30, 500.00, 350.00, 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=300&fit=crop', true, '2024-12-20'),
('550e8400-e29b-41d4-a716-446655440003', 'Wine Tasting Experience', 'Sample premium South African wines with expert sommelier guidance.', 'food_drink', '40% OFF', 40, 250.00, 150.00, 'https://images.unsplash.com/photo-1506377872008-6645d6ba8e83?w=500&h=300&fit=crop', true, '2024-12-30'),
('550e8400-e29b-41d4-a716-446655440004', 'Free Spa Treatment', 'Complimentary 60-minute massage with any facial treatment.', 'beauty', 'Free Treatment', 100, 400.00, 200.00, 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=500&h=300&fit=crop', false, '2024-12-28'),
('550e8400-e29b-41d4-a716-446655440005', 'Movie Night Special', 'Two tickets for the price of one every Tuesday night.', 'entertainment', '2 for 1', 50, 140.00, 70.00, 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&h=300&fit=crop', true, '2024-12-31');

-- Insert sample events  
INSERT INTO public.events (title, description, category, venue, address, event_date, start_time, price, image_url, premium) VALUES
('Summer Music Festival', 'Three days of amazing live music featuring local and international artists.', 'music', 'Cape Town Stadium', 'Green Point, Cape Town', '2024-12-15', '18:00', 350.00, 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&h=300&fit=crop', true),
('Art Gallery Opening', 'Discover contemporary South African art at this exclusive opening.', 'arts_culture', 'Zeitz Museum', 'V&A Waterfront, Cape Town', '2024-12-25', '18:30', 0.00, 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&h=300&fit=crop', true),
('Food & Wine Tasting', 'Experience the best of South African cuisine paired with premium wines.', 'food_drink', 'V&A Waterfront', 'V&A Waterfront, Cape Town', '2024-12-18', '19:00', 450.00, 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&h=300&fit=crop', false),
('Business Networking Evening', 'Connect with entrepreneurs and business leaders in Cape Town.', 'business', 'Century City Conference Centre', 'Century City, Cape Town', '2024-12-20', '17:30', 150.00, 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=500&h=300&fit=crop', true),
('Rugby Championship', 'Local teams compete in this exciting rugby tournament.', 'sports', 'Newlands Rugby Ground', 'Newlands, Cape Town', '2024-12-22', '15:00', 80.00, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&h=300&fit=crop', false);
