-- Drop the restrictive policies and add a public-read policy for profiles
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile when unauthenticated" ON public.profiles;

CREATE POLICY "Profiles are viewable by everyone"
ON public.profiles
FOR SELECT
USING (true);