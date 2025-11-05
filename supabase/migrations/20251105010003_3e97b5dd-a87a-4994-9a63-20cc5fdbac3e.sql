-- Drop the public viewing policy
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create new policy: only authenticated users can view profiles
CREATE POLICY "Authenticated users can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Users can still view their own profile data
CREATE POLICY "Users can view their own profile when unauthenticated"
ON public.profiles
FOR SELECT
TO anon
USING (auth.uid() = id);