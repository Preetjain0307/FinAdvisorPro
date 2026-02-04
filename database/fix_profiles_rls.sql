-- Fix for: infinite recursion detected in policy for relation "profiles"
-- This fixes the onboarding "Complete Setup" button error

-- Step 1: Disable RLS temporarily (for initial setup)
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop any existing problematic policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Enable read access for users based on user_id" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON profiles;

-- Step 3: Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Step 4: Create correct policies WITHOUT recursion
-- Policy for SELECT (reading own profile)
CREATE POLICY "profiles_select_policy"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Policy for INSERT (creating own profile)
CREATE POLICY "profiles_insert_policy"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Policy for UPDATE (updating own profile)
CREATE POLICY "profiles_update_policy"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Step 5: Grant necessary permissions
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON profiles TO service_role;

-- Verification: Check that policies are created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'profiles';
