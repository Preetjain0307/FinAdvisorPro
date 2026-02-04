-- SIMPLE FIX: Remove ALL policies and keep only the working ones
-- This will fix the "infinite recursion" error immediately

-- Step 1: Drop EVERY policy on profiles table
DROP POLICY IF EXISTS "Admins view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users manage own profile" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;

-- Step 2: Create ONLY these three simple policies
CREATE POLICY "allow_select_own"
ON profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "allow_insert_own"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "allow_update_own"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Done! Verify with:
-- SELECT policyname FROM pg_policies WHERE tablename = 'profiles';
