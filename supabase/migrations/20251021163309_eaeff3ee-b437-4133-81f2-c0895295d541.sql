-- Fix search_path for handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$;

-- Fix search_path for notify_service_providers function
CREATE OR REPLACE FUNCTION public.notify_service_providers()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = ''
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