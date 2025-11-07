-- Fix 1: Add search_path to update_updated_at_column function to prevent search path injection
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Fix 2: Add INSERT policy to notifications table to prevent unauthorized direct insertion
CREATE POLICY "Only system can insert notifications"
ON public.notifications 
FOR INSERT
WITH CHECK (false);

-- Fix 3: Add CHECK constraint to service_category to prevent injection in notifications
ALTER TABLE public.service_searches 
ADD CONSTRAINT valid_service_category 
CHECK (service_category IN ('Plumbing', 'Electrical', 'Carpentry', 'Painting', 'Cleaning', 'Gardening', 'Moving', 'Other'));

-- Also add CHECK constraint to services table for consistency
ALTER TABLE public.services 
ADD CONSTRAINT valid_service_category 
CHECK (category IN ('Plumbing', 'Electrical', 'Carpentry', 'Painting', 'Cleaning', 'Gardening', 'Moving', 'Other'));