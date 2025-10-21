-- Create profiles table for user information
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  location text,
  bio text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Create services table
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  category text NOT NULL,
  price_range text,
  availability text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on services
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Services policies
CREATE POLICY "Services are viewable by everyone" 
ON public.services FOR SELECT 
USING (true);

CREATE POLICY "Users can manage their own services" 
ON public.services FOR ALL 
USING (auth.uid() = provider_id);

-- Create service_searches table
CREATE TABLE public.service_searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  searcher_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  service_category text NOT NULL,
  search_query text,
  location text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on service_searches
ALTER TABLE public.service_searches ENABLE ROW LEVEL SECURITY;

-- Service searches policies
CREATE POLICY "Users can view their own searches" 
ON public.service_searches FOR SELECT 
USING (auth.uid() = searcher_id);

CREATE POLICY "Users can create searches" 
ON public.service_searches FOR INSERT 
WITH CHECK (auth.uid() = searcher_id);

-- Create notifications table
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'service_search',
  related_search_id uuid REFERENCES public.service_searches(id) ON DELETE CASCADE,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Notifications policies
CREATE POLICY "Users can view their own notifications" 
ON public.notifications FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
ON public.notifications FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to notify providers when someone searches for their service
CREATE OR REPLACE FUNCTION public.notify_service_providers()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Insert notifications for all providers offering services in the searched category
  INSERT INTO public.notifications (user_id, title, message, related_search_id)
  SELECT DISTINCT
    s.provider_id,
    'New Service Search',
    'Someone is looking for ' || NEW.service_category || ' services in your area!',
    NEW.id
  FROM public.services s
  WHERE s.category = NEW.service_category
  AND s.provider_id != NEW.searcher_id;
  
  RETURN NEW;
END;
$$;

-- Trigger to notify providers on new search
CREATE TRIGGER on_service_search_created
  AFTER INSERT ON public.service_searches
  FOR EACH ROW EXECUTE FUNCTION public.notify_service_providers();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();