-- Add availability status to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_available boolean NOT NULL DEFAULT true;

-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL,
  customer_id uuid NOT NULL,
  service_id uuid,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  preferred_date timestamp with time zone NOT NULL,
  message text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can create bookings"
ON public.bookings FOR INSERT
WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Users can view bookings they're part of"
ON public.bookings FOR SELECT
USING (auth.uid() = customer_id OR auth.uid() = provider_id);

CREATE POLICY "Provider can update booking status"
ON public.bookings FOR UPDATE
USING (auth.uid() = provider_id);

CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Notify provider when a booking is created
CREATE OR REPLACE FUNCTION public.notify_provider_on_booking()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  INSERT INTO public.notifications (user_id, title, message, type)
  VALUES (
    NEW.provider_id,
    'New Booking Request',
    NEW.customer_name || ' booked you for ' || to_char(NEW.preferred_date, 'Mon DD, YYYY HH24:MI'),
    'booking'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_booking_created
AFTER INSERT ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.notify_provider_on_booking();