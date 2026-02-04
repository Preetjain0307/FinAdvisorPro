-- Safe version: Can be run multiple times without errors
-- Fixes "Complete Setup" button infinite recursion issue

-- Step 1: Drop ALL existing policies (won't error if they don't exist)
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Admins view all profiles" ON profiles;
    DROP POLICY IF EXISTS "Users manage own profile" ON profiles;
    DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;
    DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
    DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;
    DROP POLICY IF EXISTS "allow_select_own" ON profiles;
    DROP POLICY IF EXISTS "allow_insert_own" ON profiles;
    DROP POLICY IF EXISTS "allow_update_own" ON profiles;
END $$;

-- Step 2: Create the correct policies
CREATE POLICY "allow_select_own"
ON profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "allow_insert_own"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "allow_update_own"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Verify policies are created
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'profiles';
