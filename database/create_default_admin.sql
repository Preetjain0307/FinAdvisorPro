-- Create Default Admin User for Fin Advisor Pro
-- Default Credentials:
--   Email: admin@finadvisor.pro
--   Password: admin@123

-- IMPORTANT: Change this password after first login!

-- Step 1: Create admin user in Supabase Auth
-- NOTE: You must do this manually in Supabase Dashboard → Authentication → Add User
-- OR use the Supabase API/CLI

-- For manual creation in Supabase Dashboard:
-- 1. Go to Authentication → Users → Add User
-- 2. Email: admin@finadvisor.pro
-- 3. Password: admin@123
-- 4. Auto-confirm: Yes
-- 5. Copy the user ID after creation

-- Step 2: Create admin profile (run this after creating the user)
-- Replace 'USER_ID_HERE' with the actual UUID from step 1

-- Example:
-- INSERT INTO profiles (id, email, full_name, role, created_at, updated_at)
-- VALUES (
--     'USER_ID_HERE', -- Replace with actual user ID
--     'admin@finadvisor.pro',
--     'System Administrator',
--     'admin',
--     NOW(),
--     NOW()
-- );

-- Step 3: Verify admin user
SELECT id, email, role 
FROM profiles 
WHERE email = 'admin@finadvisor.pro';

-- Step 4: Grant admin all permissions (if needed)
-- Admin already has full access via RLS policies

-- ALTERNATIVE: Use Supabase SQL if you have the auth schema access
-- This creates user directly in auth.users table (requires service role)
-- 
-- DO $$
-- DECLARE
--     new_user_id uuid;
-- BEGIN
--     -- Insert into auth.users (requires auth schema access)
--     INSERT INTO auth.users (
--         instance_id,
--         id,
--         aud,
--         role,
--         email,
--         encrypted_password,
--         email_confirmed_at,
--         created_at,
--         updated_at,
--         raw_app_meta_data,
--         raw_user_meta_data,
--         is_super_admin,
--         confirmation_token,
--         recovery_token
--     )
--     VALUES (
--         '00000000-0000-0000-0000-000000000000',
--         gen_random_uuid(),
--         'authenticated',
--         'authenticated',
--         'admin@finadvisor.pro',
--         crypt('admin@123', gen_salt('bf')),
--         NOW(),
--         NOW(),
--         NOW(),
--         '{"provider":"email","providers":["email"]}',
--         '{}',
--         FALSE,
--         '',
--         ''
--     )
--     RETURNING id INTO new_user_id;
--     
--     -- Insert into profiles
--     INSERT INTO profiles (id, email, full_name, role, created_at, updated_at)
--     VALUES (
--         new_user_id,
--         'admin@finadvisor.pro',
--         'System Administrator',
--         'admin',
--         NOW(),
--         NOW()
--     );
-- END $$;

-- Note: The alternative method above may not work in Supabase due to auth schema restrictions
-- It's recommended to create the admin user via Supabase Dashboard or Admin API
