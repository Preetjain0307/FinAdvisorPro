-- ============================================================
-- FIN ADVISOR PRO — DEMO USER SEED DATA
-- ============================================================
-- HOW TO USE:
--   1. Open your Supabase project → SQL Editor
--   2. Paste this entire file and click "Run"
--   3. All 10 demo users will be created with full financial data
--
-- LOGIN CREDENTIALS (all passwords: Demo@1234)
--   preet.jain@demo.finadvisorpro.com
--   sneha.dubey@demo.finadvisorpro.com
--   sanika.rewde@demo.finadvisorpro.com
--   tuhin.maji@demo.finadvisorpro.com
--   bikram.shrestha@demo.finadvisorpro.com
--   haresh.prajapati@demo.finadvisorpro.com
--   priyanshu.pandey@demo.finadvisorpro.com
--   vedant.upadhyay@demo.finadvisorpro.com
--   bhumika.sharma@demo.finadvisorpro.com
--   kavya.menon@demo.finadvisorpro.com
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- STEP 1: Create auth.users  (bcrypt hash of "Demo@1234")
-- ─────────────────────────────────────────────────────────────
DO $$
DECLARE
  encrypted_pw TEXT := crypt('Demo@1234', gen_salt('bf'));
BEGIN

  -- 1. Preet Jain
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    created_at, updated_at, raw_user_meta_data, confirmation_token, recovery_token,
    email_change_token_new, email_change, is_super_admin, raw_app_meta_data
  ) VALUES (
    '11111111-1111-1111-1111-111111111101',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'preet.jain@demo.finadvisorpro.com', encrypted_pw,
    NOW(), NOW(), NOW(),
    '{"full_name":"Preet Jain"}', '', '', '', '', false,
    '{"provider":"email","providers":["email"]}'
  ) ON CONFLICT (id) DO NOTHING;

  -- 2. Sneha Dubey
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    created_at, updated_at, raw_user_meta_data, confirmation_token, recovery_token,
    email_change_token_new, email_change, is_super_admin, raw_app_meta_data
  ) VALUES (
    '11111111-1111-1111-1111-111111111102',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'sneha.dubey@demo.finadvisorpro.com', encrypted_pw,
    NOW(), NOW(), NOW(),
    '{"full_name":"Sneha Dubey"}', '', '', '', '', false,
    '{"provider":"email","providers":["email"]}'
  ) ON CONFLICT (id) DO NOTHING;

  -- 3. Sanika Rewde
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    created_at, updated_at, raw_user_meta_data, confirmation_token, recovery_token,
    email_change_token_new, email_change, is_super_admin, raw_app_meta_data
  ) VALUES (
    '11111111-1111-1111-1111-111111111103',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'sanika.rewde@demo.finadvisorpro.com', encrypted_pw,
    NOW(), NOW(), NOW(),
    '{"full_name":"Sanika Rewde"}', '', '', '', '', false,
    '{"provider":"email","providers":["email"]}'
  ) ON CONFLICT (id) DO NOTHING;

  -- 4. Tuhin Maji
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    created_at, updated_at, raw_user_meta_data, confirmation_token, recovery_token,
    email_change_token_new, email_change, is_super_admin, raw_app_meta_data
  ) VALUES (
    '11111111-1111-1111-1111-111111111104',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'tuhin.maji@demo.finadvisorpro.com', encrypted_pw,
    NOW(), NOW(), NOW(),
    '{"full_name":"Tuhin Maji"}', '', '', '', '', false,
    '{"provider":"email","providers":["email"]}'
  ) ON CONFLICT (id) DO NOTHING;

  -- 5. Bikram Shrestha
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    created_at, updated_at, raw_user_meta_data, confirmation_token, recovery_token,
    email_change_token_new, email_change, is_super_admin, raw_app_meta_data
  ) VALUES (
    '11111111-1111-1111-1111-111111111105',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'bikram.shrestha@demo.finadvisorpro.com', encrypted_pw,
    NOW(), NOW(), NOW(),
    '{"full_name":"Bikram Shrestha"}', '', '', '', '', false,
    '{"provider":"email","providers":["email"]}'
  ) ON CONFLICT (id) DO NOTHING;

  -- 6. Haresh Prajapati
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    created_at, updated_at, raw_user_meta_data, confirmation_token, recovery_token,
    email_change_token_new, email_change, is_super_admin, raw_app_meta_data
  ) VALUES (
    '11111111-1111-1111-1111-111111111106',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'haresh.prajapati@demo.finadvisorpro.com', encrypted_pw,
    NOW(), NOW(), NOW(),
    '{"full_name":"Haresh Prajapati"}', '', '', '', '', false,
    '{"provider":"email","providers":["email"]}'
  ) ON CONFLICT (id) DO NOTHING;

  -- 7. Priyanshu Pandey
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    created_at, updated_at, raw_user_meta_data, confirmation_token, recovery_token,
    email_change_token_new, email_change, is_super_admin, raw_app_meta_data
  ) VALUES (
    '11111111-1111-1111-1111-111111111107',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'priyanshu.pandey@demo.finadvisorpro.com', encrypted_pw,
    NOW(), NOW(), NOW(),
    '{"full_name":"Priyanshu Pandey"}', '', '', '', '', false,
    '{"provider":"email","providers":["email"]}'
  ) ON CONFLICT (id) DO NOTHING;

  -- 8. Vedant Upadhyay
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    created_at, updated_at, raw_user_meta_data, confirmation_token, recovery_token,
    email_change_token_new, email_change, is_super_admin, raw_app_meta_data
  ) VALUES (
    '11111111-1111-1111-1111-111111111108',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'vedant.upadhyay@demo.finadvisorpro.com', encrypted_pw,
    NOW(), NOW(), NOW(),
    '{"full_name":"Vedant Upadhyay"}', '', '', '', '', false,
    '{"provider":"email","providers":["email"]}'
  ) ON CONFLICT (id) DO NOTHING;

  -- 9. Bhumika Sharma
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    created_at, updated_at, raw_user_meta_data, confirmation_token, recovery_token,
    email_change_token_new, email_change, is_super_admin, raw_app_meta_data
  ) VALUES (
    '11111111-1111-1111-1111-111111111109',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'bhumika.sharma@demo.finadvisorpro.com', encrypted_pw,
    NOW(), NOW(), NOW(),
    '{"full_name":"Bhumika Sharma"}', '', '', '', '', false,
    '{"provider":"email","providers":["email"]}'
  ) ON CONFLICT (id) DO NOTHING;

  -- 10. Kavya Menon
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    created_at, updated_at, raw_user_meta_data, confirmation_token, recovery_token,
    email_change_token_new, email_change, is_super_admin, raw_app_meta_data
  ) VALUES (
    '11111111-1111-1111-1111-111111111110',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'kavya.menon@demo.finadvisorpro.com', encrypted_pw,
    NOW(), NOW(), NOW(),
    '{"full_name":"Kavya Menon"}', '', '', '', '', false,
    '{"provider":"email","providers":["email"]}'
  ) ON CONFLICT (id) DO NOTHING;

END $$;

-- ─────────────────────────────────────────────────────────────
-- STEP 2: Profiles
-- ─────────────────────────────────────────────────────────────
INSERT INTO public.profiles (id, full_name, email) VALUES
  ('11111111-1111-1111-1111-111111111101', 'Preet Jain',       'preet.jain@demo.finadvisorpro.com'),
  ('11111111-1111-1111-1111-111111111102', 'Sneha Dubey',      'sneha.dubey@demo.finadvisorpro.com'),
  ('11111111-1111-1111-1111-111111111103', 'Sanika Rewde',     'sanika.rewde@demo.finadvisorpro.com'),
  ('11111111-1111-1111-1111-111111111104', 'Tuhin Maji',       'tuhin.maji@demo.finadvisorpro.com'),
  ('11111111-1111-1111-1111-111111111105', 'Bikram Shrestha',  'bikram.shrestha@demo.finadvisorpro.com'),
  ('11111111-1111-1111-1111-111111111106', 'Haresh Prajapati', 'haresh.prajapati@demo.finadvisorpro.com'),
  ('11111111-1111-1111-1111-111111111107', 'Priyanshu Pandey', 'priyanshu.pandey@demo.finadvisorpro.com'),
  ('11111111-1111-1111-1111-111111111108', 'Vedant Upadhyay',  'vedant.upadhyay@demo.finadvisorpro.com'),
  ('11111111-1111-1111-1111-111111111109', 'Bhumika Sharma',   'bhumika.sharma@demo.finadvisorpro.com'),
  ('11111111-1111-1111-1111-111111111110', 'Kavya Menon',      'kavya.menon@demo.finadvisorpro.com')
ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;

-- ─────────────────────────────────────────────────────────────
-- STEP 3: Budget Items  (Income / Need / Want / Savings)
-- ─────────────────────────────────────────────────────────────
INSERT INTO public.budget_items (user_id, name, amount, category) VALUES
-- Preet Jain (Software Engineer, ₹1.8L/mo)
  ('11111111-1111-1111-1111-111111111101', 'Software Engineer Salary', 180000, 'Income'),
  ('11111111-1111-1111-1111-111111111101', 'Freelance Projects',       25000,  'Income'),
  ('11111111-1111-1111-1111-111111111101', 'Rent - Pune Flat',         22000,  'Need'),
  ('11111111-1111-1111-1111-111111111101', 'Groceries & Food',         8000,   'Need'),
  ('11111111-1111-1111-1111-111111111101', 'Internet & Mobile',        1500,   'Need'),
  ('11111111-1111-1111-1111-111111111101', 'Home Loan EMI',            32000,  'Need'),
  ('11111111-1111-1111-1111-111111111101', 'OTT Subscriptions',        1200,   'Want'),
  ('11111111-1111-1111-1111-111111111101', 'Dining Out',               5000,   'Want'),
  ('11111111-1111-1111-1111-111111111101', 'Weekend Travel',           8000,   'Want'),
  ('11111111-1111-1111-1111-111111111101', 'SIP - Mutual Funds',       30000,  'Savings'),
  ('11111111-1111-1111-1111-111111111101', 'PPF Contribution',         12500,  'Savings'),
  ('11111111-1111-1111-1111-111111111101', 'Emergency Fund Top-up',    10000,  'Savings'),

-- Sneha Dubey (Product Manager, ₹1.5L/mo)
  ('11111111-1111-1111-1111-111111111102', 'Product Manager Salary',   150000, 'Income'),
  ('11111111-1111-1111-1111-111111111102', 'Stock Options Payout',     18000,  'Income'),
  ('11111111-1111-1111-1111-111111111102', 'Rent - Bangalore',         20000,  'Need'),
  ('11111111-1111-1111-1111-111111111102', 'Groceries & Kitchen',      6500,   'Need'),
  ('11111111-1111-1111-1111-111111111102', 'Car Loan EMI',             15000,  'Need'),
  ('11111111-1111-1111-1111-111111111102', 'Utilities & Electricity',  2500,   'Need'),
  ('11111111-1111-1111-1111-111111111102', 'Shopping & Clothing',      7000,   'Want'),
  ('11111111-1111-1111-1111-111111111102', 'Gym & Wellness',           3000,   'Want'),
  ('11111111-1111-1111-1111-111111111102', 'SIP - Index Funds',        25000,  'Savings'),
  ('11111111-1111-1111-1111-111111111102', 'NPS Contribution',         5000,   'Savings'),

-- Sanika Rewde (Data Analyst, ₹90k/mo)
  ('11111111-1111-1111-1111-111111111103', 'Data Analyst Salary',      90000,  'Income'),
  ('11111111-1111-1111-1111-111111111103', 'Tutoring Side Income',     8000,   'Income'),
  ('11111111-1111-1111-1111-111111111103', 'Rent - Mumbai',            18000,  'Need'),
  ('11111111-1111-1111-1111-111111111103', 'Groceries',                5500,   'Need'),
  ('11111111-1111-1111-1111-111111111103', 'Personal Loan EMI',        8000,   'Need'),
  ('11111111-1111-1111-1111-111111111103', 'Online Courses & Books',   1500,   'Want'),
  ('11111111-1111-1111-1111-111111111103', 'Entertainment',            3000,   'Want'),
  ('11111111-1111-1111-1111-111111111103', 'SIP - ELSS',               10000,  'Savings'),
  ('11111111-1111-1111-1111-111111111103', 'RD in Bank',               5000,   'Savings'),

-- Tuhin Maji (Backend Developer, ₹1.2L/mo)
  ('11111111-1111-1111-1111-111111111104', 'Backend Developer Salary', 120000, 'Income'),
  ('11111111-1111-1111-1111-111111111104', 'Open Source Bounties',     6000,   'Income'),
  ('11111111-1111-1111-1111-111111111104', 'PG Accommodation',         12000,  'Need'),
  ('11111111-1111-1111-1111-111111111104', 'Groceries & Mess',         5000,   'Need'),
  ('11111111-1111-1111-1111-111111111104', 'Bike Loan EMI',            6500,   'Need'),
  ('11111111-1111-1111-1111-111111111104', 'PC & Internet',            2000,   'Need'),
  ('11111111-1111-1111-1111-111111111104', 'Gaming & Hobbies',         4000,   'Want'),
  ('11111111-1111-1111-1111-111111111104', 'Dining Out',               3500,   'Want'),
  ('11111111-1111-1111-1111-111111111104', 'SIP - Flexi-cap',          20000,  'Savings'),
  ('11111111-1111-1111-1111-111111111104', 'Crypto DCA',               5000,   'Savings'),

-- Bikram Shrestha (Finance Analyst, ₹2L/mo)
  ('11111111-1111-1111-1111-111111111105', 'Finance Analyst Salary',   200000, 'Income'),
  ('11111111-1111-1111-1111-111111111105', 'Dividend Income',          12000,  'Income'),
  ('11111111-1111-1111-1111-111111111105', 'Rent - Delhi',             28000,  'Need'),
  ('11111111-1111-1111-1111-111111111105', 'Groceries & Household',    9000,   'Need'),
  ('11111111-1111-1111-1111-111111111105', 'Home Loan EMI',            42000,  'Need'),
  ('11111111-1111-1111-1111-111111111105', 'Child School Fees',        12000,  'Need'),
  ('11111111-1111-1111-1111-111111111105', 'Travel & Vacations',       15000,  'Want'),
  ('11111111-1111-1111-1111-111111111105', 'Restaurants',              8000,   'Want'),
  ('11111111-1111-1111-1111-111111111105', 'SIP - Large Cap',          40000,  'Savings'),
  ('11111111-1111-1111-1111-111111111105', 'PPF',                      12500,  'Savings'),
  ('11111111-1111-1111-1111-111111111105', 'FD Rollover',              20000,  'Savings'),

-- Haresh Prajapati (Business Owner, ₹2.5L/mo)
  ('11111111-1111-1111-1111-111111111106', 'Business Revenue',         250000, 'Income'),
  ('11111111-1111-1111-1111-111111111106', 'Rental Income - Shop',     22000,  'Income'),
  ('11111111-1111-1111-1111-111111111106', 'Home Maintenance',         8000,   'Need'),
  ('11111111-1111-1111-1111-111111111106', 'Business Expenses',        35000,  'Need'),
  ('11111111-1111-1111-1111-111111111106', 'Business Loan EMI',        55000,  'Need'),
  ('11111111-1111-1111-1111-111111111106', 'Staff Salaries',           60000,  'Need'),
  ('11111111-1111-1111-1111-111111111106', 'Golf & Club Membership',   8000,   'Want'),
  ('11111111-1111-1111-1111-111111111106', 'Luxury Dining',            10000,  'Want'),
  ('11111111-1111-1111-1111-111111111106', 'Stocks & Equity',          40000,  'Savings'),
  ('11111111-1111-1111-1111-111111111106', 'Commercial Property SIP',  25000,  'Savings'),

-- Priyanshu Pandey (UI/UX Designer, ₹85k/mo)
  ('11111111-1111-1111-1111-111111111107', 'Designer Salary',          85000,  'Income'),
  ('11111111-1111-1111-1111-111111111107', 'Freelance Design Work',    20000,  'Income'),
  ('11111111-1111-1111-1111-111111111107', 'Rent - Hyderabad',         14000,  'Need'),
  ('11111111-1111-1111-1111-111111111107', 'Groceries',                5000,   'Need'),
  ('11111111-1111-1111-1111-111111111107', 'Design Tools Subs',        2000,   'Need'),
  ('11111111-1111-1111-1111-111111111107', 'Bike EMI',                 5500,   'Need'),
  ('11111111-1111-1111-1111-111111111107', 'Coffee & Cafes',           3000,   'Want'),
  ('11111111-1111-1111-1111-111111111107', 'Art Supplies & Courses',   4000,   'Want'),
  ('11111111-1111-1111-1111-111111111107', 'SIP - Mid Cap',            15000,  'Savings'),

-- Vedant Upadhyay (DevOps Engineer, ₹1.4L/mo)
  ('11111111-1111-1111-1111-111111111108', 'DevOps Salary',            140000, 'Income'),
  ('11111111-1111-1111-1111-111111111108', 'Cloud Consulting',         18000,  'Income'),
  ('11111111-1111-1111-1111-111111111108', 'Rent - Noida',             16000,  'Need'),
  ('11111111-1111-1111-1111-111111111108', 'Groceries',                6000,   'Need'),
  ('11111111-1111-1111-1111-111111111108', 'Home Loan EMI',            28000,  'Need'),
  ('11111111-1111-1111-1111-111111111108', 'Car Fuel & Maintenance',   5000,   'Need'),
  ('11111111-1111-1111-1111-111111111108', 'Weekend Trips',            7000,   'Want'),
  ('11111111-1111-1111-1111-111111111108', 'OTT & Gaming',             2000,   'Want'),
  ('11111111-1111-1111-1111-111111111108', 'SIP - Multi Asset',        25000,  'Savings'),
  ('11111111-1111-1111-1111-111111111108', 'ELSS',                     12500,  'Savings'),

-- Bhumika Sharma (HR Manager, ₹1.1L/mo)
  ('11111111-1111-1111-1111-111111111109', 'HR Manager Salary',        110000, 'Income'),
  ('11111111-1111-1111-1111-111111111109', 'Content Side Income',       8000,  'Income'),
  ('11111111-1111-1111-1111-111111111109', 'Rent - Jaipur',            10000,  'Need'),
  ('11111111-1111-1111-1111-111111111109', 'Groceries & Kitchen',       5000,  'Need'),
  ('11111111-1111-1111-1111-111111111109', 'Car Loan EMI',             12000,  'Need'),
  ('11111111-1111-1111-1111-111111111109', 'Fashion & Clothing',        6000,  'Want'),
  ('11111111-1111-1111-1111-111111111109', 'Salon & Beauty',            3500,  'Want'),
  ('11111111-1111-1111-1111-111111111109', 'SIP - Balanced Fund',      18000,  'Savings'),
  ('11111111-1111-1111-1111-111111111109', 'Gold Savings',              5000,  'Savings'),

-- Kavya Menon (Doctor, ₹2.2L/mo)
  ('11111111-1111-1111-1111-111111111110', 'Doctor Salary',            220000, 'Income'),
  ('11111111-1111-1111-1111-111111111110', 'Private Clinic Earnings',   35000, 'Income'),
  ('11111111-1111-1111-1111-111111111110', 'Rent - Chennai',            20000, 'Need'),
  ('11111111-1111-1111-1111-111111111110', 'Groceries & Home',          8000,  'Need'),
  ('11111111-1111-1111-1111-111111111110', 'Home Loan EMI',             36000, 'Need'),
  ('11111111-1111-1111-1111-111111111110', 'Professional Dev & CME',    5000,  'Need'),
  ('11111111-1111-1111-1111-111111111110', 'Travel & Leisure',         12000,  'Want'),
  ('11111111-1111-1111-1111-111111111110', 'Fine Dining',               6000,  'Want'),
  ('11111111-1111-1111-1111-111111111110', 'SIP - Healthcare Fund',    45000,  'Savings'),
  ('11111111-1111-1111-1111-111111111110', 'PPF',                      12500,  'Savings'),
  ('11111111-1111-1111-1111-111111111110', 'FD - HDFC Bank',           20000,  'Savings');

-- ─────────────────────────────────────────────────────────────
-- STEP 4: Loans
-- ─────────────────────────────────────────────────────────────
INSERT INTO public.loans (user_id, name, balance, rate) VALUES
  ('11111111-1111-1111-1111-111111111101', 'Home Loan - HDFC',         3800000, 8.50),
  ('11111111-1111-1111-1111-111111111102', 'Car Loan - ICICI',          620000, 9.25),
  ('11111111-1111-1111-1111-111111111102', 'Personal Loan - Axis',      180000, 13.50),
  ('11111111-1111-1111-1111-111111111103', 'Personal Loan - SBI',       240000, 11.00),
  ('11111111-1111-1111-1111-111111111104', 'Bike Loan - Bajaj Finance', 85000,  12.00),
  ('11111111-1111-1111-1111-111111111105', 'Home Loan - SBI',           6200000, 8.30),
  ('11111111-1111-1111-1111-111111111105', 'Car Loan - HDFC',           880000, 9.00),
  ('11111111-1111-1111-1111-111111111106', 'Business Loan - PNB',       4500000, 11.50),
  ('11111111-1111-1111-1111-111111111107', 'Bike Loan - HDB Finance',   120000, 12.50),
  ('11111111-1111-1111-1111-111111111108', 'Home Loan - Axis',          2800000, 8.65),
  ('11111111-1111-1111-1111-111111111109', 'Car Loan - Kotak',          480000, 9.50),
  ('11111111-1111-1111-1111-111111111110', 'Home Loan - ICICI',         3500000, 8.40),
  ('11111111-1111-1111-1111-111111111110', 'Education Loan - SBI',      400000, 8.00);

-- ─────────────────────────────────────────────────────────────
-- STEP 5: Investment Goals
-- ─────────────────────────────────────────────────────────────
INSERT INTO public.investment_goals (user_id, name, target_amount, current_amount) VALUES
  ('11111111-1111-1111-1111-111111111101', 'Early Retirement Fund',   10000000,  1850000),
  ('11111111-1111-1111-1111-111111111101', 'Emergency Corpus (6mo)',    1200000,   820000),
  ('11111111-1111-1111-1111-111111111101', 'Startup Capital',          2000000,   340000),
  ('11111111-1111-1111-1111-111111111102', 'Dream Wedding Fund',        800000,   520000),
  ('11111111-1111-1111-1111-111111111102', 'Europe Vacation',           250000,   180000),
  ('11111111-1111-1111-1111-111111111102', 'Emergency Fund',            900000,   650000),
  ('11111111-1111-1111-1111-111111111103', 'Own Flat Downpayment',     1500000,   410000),
  ('11111111-1111-1111-1111-111111111103', 'Emergency Fund',            600000,   290000),
  ('11111111-1111-1111-1111-111111111104', 'Canada Masters Fund',      1200000,   320000),
  ('11111111-1111-1111-1111-111111111104', 'Gaming PC Upgrade',         80000,    55000),
  ('11111111-1111-1111-1111-111111111105', 'Children Education',       4000000,  1200000),
  ('11111111-1111-1111-1111-111111111105', 'Second Property',          8000000,  2100000),
  ('11111111-1111-1111-1111-111111111105', 'Family Europe Tour',        400000,   400000),
  ('11111111-1111-1111-1111-111111111106', 'Business Expansion',       10000000, 4200000),
  ('11111111-1111-1111-1111-111111111106', 'Retirement Corpus',        20000000, 8500000),
  ('11111111-1111-1111-1111-111111111107', 'Design Studio Setup',       500000,   180000),
  ('11111111-1111-1111-1111-111111111107', 'Bali Trip',                 150000,   110000),
  ('11111111-1111-1111-1111-111111111108', 'Home Loan Prepayment',     1000000,   350000),
  ('11111111-1111-1111-1111-111111111108', 'Emergency Corpus',          1000000,  720000),
  ('11111111-1111-1111-1111-111111111109', 'Wedding Fund',              700000,   480000),
  ('11111111-1111-1111-1111-111111111109', 'Higher Studies Abroad',    2500000,   620000),
  ('11111111-1111-1111-1111-111111111110', 'Clinic Setup Fund',        5000000,  2100000),
  ('11111111-1111-1111-1111-111111111110', 'Retirement at 50',        15000000,  4800000),
  ('11111111-1111-1111-1111-111111111110', 'Maldives Vacation',         300000,   300000);

-- ─────────────────────────────────────────────────────────────
-- STEP 6: Risk Profiles
-- ─────────────────────────────────────────────────────────────
INSERT INTO public.risk_profiles (user_id, quiz_score, risk_category, completed) VALUES
  ('11111111-1111-1111-1111-111111111101', 18, 'Aggressive',   true),
  ('11111111-1111-1111-1111-111111111102', 13, 'Moderate',     true),
  ('11111111-1111-1111-1111-111111111103', 9,  'Conservative', true),
  ('11111111-1111-1111-1111-111111111104', 16, 'Moderate',     true),
  ('11111111-1111-1111-1111-111111111105', 11, 'Moderate',     true),
  ('11111111-1111-1111-1111-111111111106', 20, 'Aggressive',   true),
  ('11111111-1111-1111-1111-111111111107', 14, 'Moderate',     true),
  ('11111111-1111-1111-1111-111111111108', 12, 'Moderate',     true),
  ('11111111-1111-1111-1111-111111111109', 8,  'Conservative', true),
  ('11111111-1111-1111-1111-111111111110', 17, 'Aggressive',   true)
ON CONFLICT (user_id) DO UPDATE SET quiz_score = EXCLUDED.quiz_score,
  risk_category = EXCLUDED.risk_category, completed = EXCLUDED.completed;

-- ─────────────────────────────────────────────────────────────
-- STEP 7: Insurance Profile
-- ─────────────────────────────────────────────────────────────
INSERT INTO public.insurance_profile (user_id, annual_income, total_liabilities, existing_cover) VALUES
  ('11111111-1111-1111-1111-111111111101', 2460000, 3800000, 5000000),
  ('11111111-1111-1111-1111-111111111102', 2016000, 800000,  3000000),
  ('11111111-1111-1111-1111-111111111103', 1176000, 240000,  1000000),
  ('11111111-1111-1111-1111-111111111104', 1512000, 85000,   2000000),
  ('11111111-1111-1111-1111-111111111105', 2544000, 7080000, 10000000),
  ('11111111-1111-1111-1111-111111111106', 3264000, 4500000, 15000000),
  ('11111111-1111-1111-1111-111111111107', 1260000, 120000,  2500000),
  ('11111111-1111-1111-1111-111111111108', 1896000, 2800000, 5000000),
  ('11111111-1111-1111-1111-111111111109', 1416000, 480000,  3000000),
  ('11111111-1111-1111-1111-111111111110', 3060000, 3900000, 10000000)
ON CONFLICT (user_id) DO UPDATE SET annual_income = EXCLUDED.annual_income,
  total_liabilities = EXCLUDED.total_liabilities, existing_cover = EXCLUDED.existing_cover;

-- ─────────────────────────────────────────────────────────────
-- STEP 8: Insurance Renewals
-- ─────────────────────────────────────────────────────────────
INSERT INTO public.insurance_renewals (user_id, name, renewal_date, premium) VALUES
  ('11111111-1111-1111-1111-111111111101', 'LIC Term Plan',             '2026-03-15', 18500),
  ('11111111-1111-1111-1111-111111111101', 'Star Health Insurance',     '2026-04-01', 22000),
  ('11111111-1111-1111-1111-111111111101', 'Vehicle Insurance',         '2026-05-12', 9500),
  ('11111111-1111-1111-1111-111111111102', 'HDFC Life Term',            '2026-03-22', 14200),
  ('11111111-1111-1111-1111-111111111102', 'Bajaj Allianz Health',      '2026-06-10', 18000),
  ('11111111-1111-1111-1111-111111111103', 'SBI Life Term Plan',        '2026-07-05', 9800),
  ('11111111-1111-1111-1111-111111111103', 'Niva Bupa Health',          '2026-08-20', 12500),
  ('11111111-1111-1111-1111-111111111104', 'Max Life Term',             '2026-03-10', 8200),
  ('11111111-1111-1111-1111-111111111104', 'Bike Insurance - IFFCO',    '2026-04-18', 3200),
  ('11111111-1111-1111-1111-111111111105', 'ICICI Pru iProtect',        '2026-05-01', 32000),
  ('11111111-1111-1111-1111-111111111105', 'Aditya Birla Health',       '2026-06-15', 28000),
  ('11111111-1111-1111-1111-111111111105', 'Car Insurance - TATA AIG',  '2026-03-28', 14500),
  ('11111111-1111-1111-1111-111111111106', 'Kotak e-Term Plan',         '2026-04-12', 42000),
  ('11111111-1111-1111-1111-111111111106', 'Care Health Corporate',     '2026-07-01', 55000),
  ('11111111-1111-1111-1111-111111111107', 'LIC e-Term',                '2026-09-15', 7500),
  ('11111111-1111-1111-1111-111111111107', 'ManipalCigna Health',       '2026-10-01', 10200),
  ('11111111-1111-1111-1111-111111111108', 'Aegon iTerm',               '2026-04-20', 19800),
  ('11111111-1111-1111-1111-111111111108', 'Apollo Munich Health',      '2026-05-08', 21000),
  ('11111111-1111-1111-1111-111111111109', 'SBI Life eShield',          '2026-06-25', 11500),
  ('11111111-1111-1111-1111-111111111109', 'Star Women Care Policy',    '2026-07-12', 13200),
  ('11111111-1111-1111-1111-111111111110', 'HDFC Click2Protect',        '2026-03-05', 35000),
  ('11111111-1111-1111-1111-111111111110', 'Reliance Health Gain',      '2026-04-30', 30000),
  ('11111111-1111-1111-1111-111111111110', 'Car Insurance - Bajaj',     '2026-05-20', 16000);

-- ─────────────────────────────────────────────────────────────
-- STEP 9: Estate Assets
-- ─────────────────────────────────────────────────────────────
INSERT INTO public.estate_assets (user_id, asset_type, details, nominee) VALUES
  ('11111111-1111-1111-1111-111111111101', 'Real Estate',  '2BHK Flat, Hinjewadi Pune, Current Value ₹65L', 'Spouse'),
  ('11111111-1111-1111-1111-111111111101', 'Mutual Funds', 'HDFC Top 100, Mirae Mid Cap, Current Value ₹8.5L', 'Mother'),
  ('11111111-1111-1111-1111-111111111101', 'Bank FDs',     'SBI FD ₹3L @ 7.1%, Matures Dec 2026', 'Father'),
  ('11111111-1111-1111-1111-111111111101', 'Gold',         '12 tola gold (jewellery + coins), Value ₹7.8L', 'Spouse'),
  ('11111111-1111-1111-1111-111111111102', 'Mutual Funds', 'SBI Blue Chip, Axis Flexi Cap, Value ₹5.2L', 'Mother'),
  ('11111111-1111-1111-1111-111111111102', 'Stocks',       'Infosys, TCS, HDFC Bank — Portfolio ₹3.8L', 'Mother'),
  ('11111111-1111-1111-1111-111111111102', 'Bank FDs',     'ICICI FD ₹1.5L @ 7.0%', 'Father'),
  ('11111111-1111-1111-1111-111111111103', 'Mutual Funds', 'Parag Parikh Flexi Cap, Value ₹2.1L', 'Father'),
  ('11111111-1111-1111-1111-111111111103', 'Gold',         '5 tola gold earrings & bangles, Value ₹3.2L', 'Mother'),
  ('11111111-1111-1111-1111-111111111104', 'Mutual Funds', 'Quant Small Cap, PGIM Mid Cap, Value ₹3.4L', 'Father'),
  ('11111111-1111-1111-1111-111111111104', 'Crypto',       'Bitcoin 0.04 BTC, Ethereum 1.2 ETH, Value ₹2.8L', 'Father'),
  ('11111111-1111-1111-1111-111111111105', 'Real Estate',  '3BHK Flat, Dwarka Delhi, Value ₹1.2Cr', 'Spouse'),
  ('11111111-1111-1111-1111-111111111105', 'Real Estate',  'Plot, Faridabad — Value ₹45L', 'Son'),
  ('11111111-1111-1111-1111-111111111105', 'Mutual Funds', 'Nippon India Growth, DSP Flexi, Value ₹22L', 'Daughter'),
  ('11111111-1111-1111-1111-111111111105', 'Stocks',       'Blue chip portfolio — HDFC, Reliance, TCS, Value ₹18L', 'Spouse'),
  ('11111111-1111-1111-1111-111111111105', 'Gold',         '25 tola gold (family jewellery), Value ₹16L', 'Spouse'),
  ('11111111-1111-1111-1111-111111111106', 'Business',     'Textile business, Estimated value ₹80L', 'Son'),
  ('11111111-1111-1111-1111-111111111106', 'Real Estate',  'Commercial shop, Surat, Value ₹55L', 'Son'),
  ('11111111-1111-1111-1111-111111111106', 'Stocks',       'Large Cap Portfolio — Value ₹35L', 'Spouse'),
  ('11111111-1111-1111-1111-111111111107', 'Mutual Funds', 'Canara Robeco Mid Cap, Value ₹1.8L', 'Mother'),
  ('11111111-1111-1111-1111-111111111107', 'Bank FDs',     'Axis Bank FD ₹80K @ 7.2%', 'Father'),
  ('11111111-1111-1111-1111-111111111108', 'Real Estate',  '2BHK Flat, Noida Sector 62, Value ₹55L', 'Spouse'),
  ('11111111-1111-1111-1111-111111111108', 'Mutual Funds', 'Kotak Flexi, IDFC Mid Cap, Value ₹7.2L', 'Spouse'),
  ('11111111-1111-1111-1111-111111111108', 'Stocks',       'IT Sector Stocks — TCS, Wipro, Value ₹4.8L', 'Father'),
  ('11111111-1111-1111-1111-111111111109', 'Mutual Funds', 'SBI Bluechip, Mirae ELSS, Value ₹3.6L', 'Mother'),
  ('11111111-1111-1111-1111-111111111109', 'Gold',         '8 tola gold, Value ₹5.1L', 'Mother'),
  ('11111111-1111-1111-1111-111111111110', 'Real Estate',  '2BHK Apartment, Adyar Chennai, Value ₹82L', 'Spouse'),
  ('11111111-1111-1111-1111-111111111110', 'Mutual Funds', 'Mirae Large Cap, Franklin Mid Cap, Value ₹18L', 'Spouse'),
  ('11111111-1111-1111-1111-111111111110', 'Stocks',       'Healthcare stocks — Sun Pharma, Apollo Hosp, Value ₹12L', 'Mother'),
  ('11111111-1111-1111-1111-111111111110', 'Bank FDs',     'HDFC FD ₹5L @ 7.25%, IndusInd FD ₹3L', 'Father'),
  ('11111111-1111-1111-1111-111111111110', 'Gold',         '20 tola gold jewellery, Value ₹13L', 'Spouse');

-- ─────────────────────────────────────────────────────────────
-- STEP 10: Tax Profile
-- ─────────────────────────────────────────────────────────────
INSERT INTO public.tax_profile (user_id, annual_income, section_80c, section_80d, hra_exemption) VALUES
  ('11111111-1111-1111-1111-111111111101', 2460000, 150000, 50000, 120000),
  ('11111111-1111-1111-1111-111111111102', 2016000, 150000, 50000,  96000),
  ('11111111-1111-1111-1111-111111111103', 1176000, 100000, 25000,  72000),
  ('11111111-1111-1111-1111-111111111104', 1512000, 150000, 25000,  48000),
  ('11111111-1111-1111-1111-111111111105', 2544000, 150000, 75000, 132000),
  ('11111111-1111-1111-1111-111111111106', 3264000, 150000, 75000,       0),
  ('11111111-1111-1111-1111-111111111107', 1260000, 100000, 25000,  60000),
  ('11111111-1111-1111-1111-111111111108', 1896000, 150000, 50000,  84000),
  ('11111111-1111-1111-1111-111111111109', 1416000, 120000, 25000,  60000),
  ('11111111-1111-1111-1111-111111111110', 3060000, 150000, 75000,  96000)
ON CONFLICT (user_id) DO UPDATE SET annual_income = EXCLUDED.annual_income,
  section_80c = EXCLUDED.section_80c, section_80d = EXCLUDED.section_80d,
  hra_exemption = EXCLUDED.hra_exemption;

-- ─────────────────────────────────────────────────────────────
-- STEP 11: Tax Deductions
-- ─────────────────────────────────────────────────────────────
INSERT INTO public.tax_deductions (user_id, name, amount) VALUES
  ('11111111-1111-1111-1111-111111111101', 'PPF Contribution',         75000),
  ('11111111-1111-1111-1111-111111111101', 'ELSS SIP',                 50000),
  ('11111111-1111-1111-1111-111111111101', 'Home Loan Principal',      25000),
  ('11111111-1111-1111-1111-111111111101', 'Health Insurance (80D)',   50000),
  ('11111111-1111-1111-1111-111111111102', 'ELSS Investment',          75000),
  ('11111111-1111-1111-1111-111111111102', 'NPS (80CCD)',              50000),
  ('11111111-1111-1111-1111-111111111102', 'Health Insurance',         50000),
  ('11111111-1111-1111-1111-111111111103', 'PPF',                      60000),
  ('11111111-1111-1111-1111-111111111103', 'Health Insurance',         25000),
  ('11111111-1111-1111-1111-111111111104', 'ELSS',                     50000),
  ('11111111-1111-1111-1111-111111111104', 'PPF',                      50000),
  ('11111111-1111-1111-1111-111111111104', 'Health Insurance',         25000),
  ('11111111-1111-1111-1111-111111111105', 'Home Loan Principal',      50000),
  ('11111111-1111-1111-1111-111111111105', 'PPF',                      50000),
  ('11111111-1111-1111-1111-111111111105', 'ELSS + Children Tuition',  50000),
  ('11111111-1111-1111-1111-111111111105', 'Health Insurance',         75000),
  ('11111111-1111-1111-1111-111111111106', 'PPF',                      50000),
  ('11111111-1111-1111-1111-111111111106', 'ELSS',                     50000),
  ('11111111-1111-1111-1111-111111111106', 'Life Insurance Premium',   50000),
  ('11111111-1111-1111-1111-111111111106', 'Health Insurance',         75000),
  ('11111111-1111-1111-1111-111111111107', 'ELSS',                     50000),
  ('11111111-1111-1111-1111-111111111107', 'PPF',                      50000),
  ('11111111-1111-1111-1111-111111111107', 'Health Insurance',         25000),
  ('11111111-1111-1111-1111-111111111108', 'Home Loan Principal',      50000),
  ('11111111-1111-1111-1111-111111111108', 'ELSS',                     75000),
  ('11111111-1111-1111-1111-111111111108', 'NPS',                      25000),
  ('11111111-1111-1111-1111-111111111108', 'Health Insurance',         50000),
  ('11111111-1111-1111-1111-111111111109', 'PPF',                      60000),
  ('11111111-1111-1111-1111-111111111109', 'ELSS',                     60000),
  ('11111111-1111-1111-1111-111111111109', 'Health Insurance',         25000),
  ('11111111-1111-1111-1111-111111111110', 'Home Loan Principal',      50000),
  ('11111111-1111-1111-1111-111111111110', 'PPF',                      50000),
  ('11111111-1111-1111-1111-111111111110', 'ELSS',                     50000),
  ('11111111-1111-1111-1111-111111111110', 'Health Insurance',         75000),
  ('11111111-1111-1111-1111-111111111110', 'NPS Tier 1',               50000);

-- ─────────────────────────────────────────────────────────────
-- STEP 12: Call Requests (70 proxy entries — mixed statuses)
-- Statuses: pending | called | call busy | not interested | converted
-- ─────────────────────────────────────────────────────────────
INSERT INTO public.call_requests
  (name, email, phone, city, preferred_time, preferred_date, message, status, caller_notes, called_at)
VALUES

-- ── CONVERTED (14 rows) ──────────────────────────────────────
('Arjun Mehta',        'arjun.mehta@gmail.com',        '+919876500001', 'Mumbai',    'Morning (9am-12pm)',   '2026-02-01', 'Want to start SIP for retirement.', 'converted', 'Converted. Onboarded with ₹15k/mo SIP plan.', '2026-02-01 10:30:00+05:30'),
('Pooja Sharma',       'pooja.sharma@gmail.com',        '+919876500002', 'Delhi',     'Evening (5pm-8pm)',    '2026-02-02', 'Need advice on tax saving investments.', 'converted', 'Converted. Set up ELSS + NPS portfolio.', '2026-02-02 18:00:00+05:30'),
('Rohan Verma',        'rohan.verma@gmail.com',         '+919876500003', 'Pune',      'Afternoon (12pm-5pm)','2026-02-03', 'Planning to buy a home in 3 years.', 'converted', 'Converted. Created home downpayment plan.', '2026-02-03 14:15:00+05:30'),
('Ananya Singh',       'ananya.singh@gmail.com',        '+919876500004', 'Bangalore', 'Morning (9am-12pm)',   '2026-02-04', 'Worried about insurance gap.', 'converted', 'Converted. Added term + health combo.', '2026-02-04 11:00:00+05:30'),
('Kiran Patel',        'kiran.patel@gmail.com',         '+919876500005', 'Ahmedabad', 'Evening (5pm-8pm)',    '2026-02-05', 'Managing business and personal finances together.', 'converted', 'Converted. Set up separate budget categories.', '2026-02-05 17:45:00+05:30'),
('Deepak Nair',        'deepak.nair@yahoo.com',         '+919876500006', 'Chennai',   'Afternoon (12pm-5pm)','2026-02-06', 'Just got first job at TCS. Want to start investing.', 'converted', 'Converted. Beginner SIP + emergency fund plan.', '2026-02-06 13:30:00+05:30'),
('Ritika Gupta',       'ritika.gupta@gmail.com',        '+919876500007', 'Hyderabad', 'Morning (9am-12pm)',   '2026-02-07', 'Inherited money and need investment advice.', 'converted', 'Converted. Allocated ₹30L across FD + equity.', '2026-02-07 10:00:00+05:30'),
('Sameer Khan',        'sameer.khan@gmail.com',         '+919876500008', 'Lucknow',   'Evening (5pm-8pm)',    '2026-02-08', 'Need to understand loan repayment strategy.', 'converted', 'Converted. Avalanche payoff strategy set up.', '2026-02-08 19:00:00+05:30'),
('Priya Iyer',         'priya.iyer@gmail.com',          '+919876500009', 'Kochi',     'Afternoon (12pm-5pm)','2026-02-09', 'Doctor salary, no investments yet.', 'converted', 'Converted. Created first financial plan.', '2026-02-09 15:00:00+05:30'),
('Vishwas Rao',        'vishwas.rao@gmail.com',         '+919876500010', 'Mysore',    'Morning (9am-12pm)',   '2026-02-10', 'Planning early retirement at 45.', 'converted', 'Converted. FIRE planning worksheet created.', '2026-02-10 09:30:00+05:30'),
('Nidhi Agarwal',      'nidhi.agarwal@outlook.com',     '+919876500011', 'Jaipur',    'Evening (5pm-8pm)',    '2026-02-11', 'CA, high income, want tax optimization.', 'converted', 'Converted. HRA+80C+80D maxed out.', '2026-02-11 18:30:00+05:30'),
('Gaurav Sinha',       'gaurav.sinha@gmail.com',        '+919876500012', 'Patna',     'Morning (9am-12pm)',   '2026-02-12', 'First time mutual fund investor.', 'converted', 'Converted. Index fund SIP started.', '2026-02-12 10:45:00+05:30'),
('Lakshmi Reddy',      'lakshmi.reddy@gmail.com',       '+919876500013', 'Vizag',     'Afternoon (12pm-5pm)','2026-02-13', 'Government employee, need NPS guidance.', 'converted', 'Converted. NPS Tier 1+2 explained.', '2026-02-13 14:00:00+05:30'),
('Manish Tiwari',      'manish.tiwari@gmail.com',       '+919876500014', 'Indore',    'Evening (5pm-8pm)',    '2026-02-14', 'Startup founder, irregular income planning.', 'converted', 'Converted. Variable income budget set up.', '2026-02-14 17:00:00+05:30'),

-- ── CALLED (18 rows) ─────────────────────────────────────────
('Saurabh Mishra',     'saurabh.mishra@gmail.com',      '+919876500015', 'Nagpur',    'Morning (9am-12pm)',   '2026-02-15', 'Want to understand SIP vs lump sum.', 'called', 'Explained SIP strategy. Follow-up in 3 days.', '2026-02-15 10:00:00+05:30'),
('Tanvi Shah',         'tanvi.shah@gmail.com',           '+919876500016', 'Surat',     'Afternoon (12pm-5pm)','2026-02-15', 'Looking for child education fund.', 'called', 'Discussed Sukanya + ELSS combo. Thinking.', '2026-02-15 13:00:00+05:30'),
('Aditya Kumar',       'aditya.kumar@gmail.com',         '+919876500017', 'Kanpur',    'Evening (5pm-8pm)',    '2026-02-16', 'Joint account planning with spouse.', 'called', 'Discussed joint budget planning. Will register.', '2026-02-16 18:00:00+05:30'),
('Swati Joshi',        'swati.joshi@gmail.com',          '+919876500018', 'Nashik',    'Morning (9am-12pm)',   '2026-02-16', 'Home loan vs rent — need help deciding.', 'called', 'Shared rent vs buy calculator. Considering.', '2026-02-16 11:30:00+05:30'),
('Nikhil Bhatt',       'nikhil.bhatt@gmail.com',         '+919876500019', 'Vadodara',  'Afternoon (12pm-5pm)','2026-02-17', 'Old LIC policy — surrender or continue?', 'called', 'Insurance surrender analysis done. Deciding.', '2026-02-17 14:00:00+05:30'),
('Megha Pandey',       'megha.pandey@gmail.com',         '+919876500020', 'Varanasi',  'Evening (5pm-8pm)',    '2026-02-17', 'Single income household, need savings plan.', 'called', 'Discussed 50/30/20 rule. Will try the app.', '2026-02-17 19:30:00+05:30'),
('Chirag Desai',       'chirag.desai@gmail.com',         '+919876500021', 'Rajkot',    'Morning (9am-12pm)',   '2026-02-18', 'Salary just increased to ₹2L, how to use it.', 'called', 'Shared allocation plan. Interested in SIP.', '2026-02-18 10:30:00+05:30'),
('Pallavi Jain',       'pallavi.jain@gmail.com',         '+919876500022', 'Bhopal',    'Afternoon (12pm-5pm)','2026-02-18', 'NRI returning to India, need financial plan.', 'called', 'Covered NRE-NRO account options. Asked to call back.', '2026-02-18 15:00:00+05:30'),
('Harsh Yadav',        'harsh.yadav@gmail.com',          '+919876500023', 'Agra',      'Evening (5pm-8pm)',    '2026-02-19', 'Want to invest in gold — digital or physical?', 'called', 'Explained digital gold + SGBs. Interested.', '2026-02-19 17:00:00+05:30'),
('Shweta Rastogi',     'shweta.rastogi@gmail.com',       '+919876500024', 'Allahabad', 'Morning (9am-12pm)',   '2026-02-19', 'Widow, first time managing finances alone.', 'called', 'Very emotional call. Set up basic plan. Follow-up Monday.', '2026-02-19 09:30:00+05:30'),
('Ravi Shankar',       'ravi.shankar@gmail.com',         '+919876500025', 'Coimbatore','Afternoon (12pm-5pm)','2026-02-20', 'Shop owner, cash flow planning needed.', 'called', 'Discussed business finance basics. Wants to register.', '2026-02-20 12:30:00+05:30'),
('Disha Malhotra',     'disha.malhotra@gmail.com',       '+919876500026', 'Chandigarh','Evening (5pm-8pm)',    '2026-02-20', 'Getting married next year, need joint plan.', 'called', 'Pre-marriage finance plan discussed. Follow-up friday.', '2026-02-20 18:00:00+05:30'),
('Pratik Bose',        'pratik.bose@gmail.com',          '+919876500027', 'Kolkata',   'Morning (9am-12pm)',   '2026-02-21', 'Lost job recently, emergency fund depleted.', 'called', 'Crisis plan made. Will track on app.', '2026-02-21 10:00:00+05:30'),
('Kavitha Subramaniam','kavitha.s@gmail.com',            '+919876500028', 'Madurai',   'Afternoon (12pm-5pm)','2026-02-21', 'Daughter''s higher education planning.', 'called', 'Education corpus plan + SIP suggestion given.', '2026-02-21 13:00:00+05:30'),
('Yash Agarwal',       'yash.agarwal@gmail.com',         '+919876500029', 'Jodhpur',   'Evening (5pm-8pm)',    '2026-02-22', 'Real estate vs equity — what to pick?', 'called', 'Shared comparison. Still deciding.', '2026-02-22 17:30:00+05:30'),
('Aarti Kulkarni',     'aarti.kulkarni@gmail.com',       '+919876500030', 'Nagpur',    'Morning (9am-12pm)',   '2026-02-22', 'Teacher, want to grow salary over time.', 'called', 'Index funds + recurring deposit plan set up.', '2026-02-22 11:00:00+05:30'),
('Dinesh Choudhary',   'dinesh.c@gmail.com',             '+919876500031', 'Bikaner',   'Afternoon (12pm-5pm)','2026-02-23', 'Farming income — how to plan finances?', 'called', 'Kisan Vikas Patra + FD discussed. Follow-up tmrw.', '2026-02-23 14:00:00+05:30'),
('Shruti Trivedi',     'shruti.trivedi@gmail.com',       '+919876500032', 'Surat',     'Evening (5pm-8pm)',    '2026-02-23', 'Recently divorced, need new financial plan.', 'called', 'Separate account setup plan discussed. Sensitive.', '2026-02-23 18:30:00+05:30'),

-- ── CALL BUSY (14 rows) ──────────────────────────────────────
('Mohit Saxena',       'mohit.saxena@gmail.com',         '+919876500033', 'Lucknow',   'Morning (9am-12pm)',   '2026-02-10', 'Interested in mutual fund ranking tool.', 'call busy', NULL, NULL),
('Alka Tripathi',      'alka.tripathi@gmail.com',        '+919876500034', 'Kanpur',    'Evening (5pm-8pm)',    '2026-02-11', 'Want to know about PPF vs NPS.', 'call busy', NULL, NULL),
('Suresh Pillai',      'suresh.pillai@gmail.com',        '+919876500035', 'Trivandrum','Afternoon (12pm-5pm)','2026-02-12', 'Confused between term and endowment plan.', 'call busy', NULL, NULL),
('Bhavna Thakur',      'bhavna.thakur@gmail.com',        '+919876500036', 'Shimla',    'Morning (9am-12pm)',   '2026-02-13', 'Need a second call attempt.', 'call busy', NULL, NULL),
('Vikas Chandra',      'vikas.chandra@gmail.com',        '+919876500037', 'Meerut',    'Evening (5pm-8pm)',    '2026-02-14', 'Asking about FIRE investing.', 'call busy', NULL, NULL),
('Neha Kapoor',        'neha.kapoor@gmail.com',          '+919876500038', 'Gurgaon',   'Morning (9am-12pm)',   '2026-02-15', 'Crypto investments — safe or not?', 'call busy', NULL, NULL),
('Rajiv Menon',        'rajiv.menon@gmail.com',          '+919876500039', 'Thrissur',  'Afternoon (12pm-5pm)','2026-02-16', 'Business loan prepayment strategy.', 'call busy', NULL, NULL),
('Sunita Yadav',       'sunita.yadav@gmail.com',         '+919876500040', 'Mathura',   'Evening (5pm-8pm)',    '2026-02-17', 'Savings rate check, spending too much?', 'call busy', NULL, NULL),
('Pranav Ghosh',       'pranav.ghosh@gmail.com',         '+919876500041', 'Siliguri',  'Morning (9am-12pm)',   '2026-02-18', 'IT professional, high expenses.', 'call busy', NULL, NULL),
('Tejasvi Rao',        'tejasvi.rao@gmail.com',          '+919876500042', 'Hyderabad', 'Afternoon (12pm-5pm)','2026-02-19', 'Stock portfolio review needed.', 'call busy', NULL, NULL),
('Kumari Priya',       'kumari.priya@gmail.com',         '+919876500043', 'Gaya',      'Evening (5pm-8pm)',    '2026-02-20', 'Home loan EMI too high. Need advice.', 'call busy', NULL, NULL),
('Santosh Pal',        'santosh.pal@gmail.com',          '+919876500044', 'Ranchi',    'Morning (9am-12pm)',   '2026-02-21', 'Small business tax deductions.', 'call busy', NULL, NULL),
('Garima Rawat',       'garima.rawat@gmail.com',         '+919876500045', 'Dehradun',  'Afternoon (12pm-5pm)','2026-02-22', 'Starting new job, need budgeting advice.', 'call busy', NULL, NULL),
('Abhishek Tomar',     'abhishek.tomar@gmail.com',       '+919876500046', 'Noida',     'Evening (5pm-8pm)',    '2026-02-23', 'Want to switch career, need financial cushion plan.', 'call busy', NULL, NULL),

-- ── NOT INTERESTED (12 rows) ─────────────────────────────────
('Sanjay Bajpai',      'sanjay.bajpai@gmail.com',        '+919876500047', 'Varanasi',  'Morning (9am-12pm)',   '2026-02-05', 'Checking features only.', 'not interested', 'Not interested. Already has CA managing finances.', '2026-02-05 10:30:00+05:30'),
('Rekha Devi',         'rekha.devi@gmail.com',           '+919876500048', 'Patna',     'Afternoon (12pm-5pm)','2026-02-06', 'Just curious about the tool.', 'not interested', 'Not interested. Preferred in-person advisor.', '2026-02-06 14:30:00+05:30'),
('Mahesh Kumar',       'mahesh.kumar@gmail.com',         '+919876500049', 'Bhopal',    'Evening (5pm-8pm)',    '2026-02-07', 'Exploring options.', 'not interested', 'Not interested. Too old to change habits.', '2026-02-07 19:00:00+05:30'),
('Geeta Soni',         'geeta.soni@gmail.com',           '+919876500050', 'Raipur',    'Morning (9am-12pm)',   '2026-02-08', 'Want advice on land investment.', 'not interested', 'Not interested. Only wants land investment advice, not in scope.', '2026-02-08 10:00:00+05:30'),
('Pankaj Dubey',       'pankaj.dubey@gmail.com',         '+919876500051', 'Jabalpur',  'Afternoon (12pm-5pm)','2026-02-09', 'Asked about chit funds.', 'not interested', 'Not interested. Looking for offline chit fund advice only.', '2026-02-09 13:00:00+05:30'),
('Nirmala Bai',        'nirmala.bai@gmail.com',          '+919876500052', 'Udaipur',   'Evening (5pm-8pm)',    '2026-02-10', 'General inquiry.', 'not interested', 'Not interested. Did not understand digital finance tools.', '2026-02-10 18:00:00+05:30'),
('Ashok Pandey',       'ashok.pandey@gmail.com',         '+919876500053', 'Gorakhpur', 'Morning (9am-12pm)',   '2026-02-12', 'Called to compare with PolicyBazaar.', 'not interested', 'Not interested. Prefers insurance-only portal.', '2026-02-12 09:45:00+05:30'),
('Kamla Devi',         'kamla.devi@gmail.com',           '+919876500054', 'Amritsar',  'Afternoon (12pm-5pm)','2026-02-13', 'Checking minimum fees.', 'not interested', 'Not interested. Expected fully free personal advisor.', '2026-02-13 14:30:00+05:30'),
('Rakesh Chouhan',     'rakesh.chouhan@gmail.com',       '+919876500055', 'Gwalior',   'Evening (5pm-8pm)',    '2026-02-15', 'Just browsing.', 'not interested', 'Not interested. Said will think and call back.', '2026-02-15 17:30:00+05:30'),
('Prabhavati Shetty',  'prabhavati.shetty@gmail.com',    '+919876500056', 'Mangalore', 'Morning (9am-12pm)',   '2026-02-17', 'Wants advice on family business succession.', 'not interested', 'Not interested. Scope out of range.', '2026-02-17 11:00:00+05:30'),
('Darshan Acharya',    'darshan.acharya@gmail.com',      '+919876500057', 'Hubli',     'Afternoon (12pm-5pm)','2026-02-19', 'Freelancer, irregular income.', 'not interested', 'Not interested. Expects full tax filing service.', '2026-02-19 13:30:00+05:30'),
('Reena Srivastava',   'reena.srivastava@gmail.com',     '+919876500058', 'Lucknow',   'Evening (5pm-8pm)',    '2026-02-21', 'Long call, many questions.', 'not interested', 'Not interested. Decided to stay with existing bank RM.', '2026-02-21 18:00:00+05:30'),

-- ── PENDING (12 rows) ────────────────────────────────────────
('Aman Yadav',         'aman.yadav@gmail.com',            '+919876500059', 'Jhansi',    'Morning (9am-12pm)',   '2026-02-24', 'New to investing, need start guide.', 'pending', NULL, NULL),
('Simran Kaur',        'simran.kaur@gmail.com',           '+919876500060', 'Ludhiana',  'Afternoon (12pm-5pm)','2026-02-24', 'Want to understand SGB vs gold ETF.', 'pending', NULL, NULL),
('Lokesh Bhargava',    'lokesh.bhargava@gmail.com',       '+919876500061', 'Ajmer',     'Evening (5pm-8pm)',    '2026-02-24', 'Retirement in 5 years, late starter.', 'pending', NULL, NULL),
('Preeti Bansal',      'preeti.bansal@gmail.com',         '+919876500062', 'Faridabad', 'Morning (9am-12pm)',   '2026-02-25', 'Housewife wants to manage family expenses.', 'pending', NULL, NULL),
('Tushar Garg',        'tushar.garg@gmail.com',           '+919876500063', 'Panipat',   'Afternoon (12pm-5pm)','2026-02-25', 'Want to close credit card debt fast.', 'pending', NULL, NULL),
('Anjali Misra',       'anjali.misra@gmail.com',          '+919876500064', 'Aligarh',   'Evening (5pm-8pm)',    '2026-02-25', 'Interested in index fund investing.', 'pending', NULL, NULL),
('Nitin Wagh',         'nitin.wagh@gmail.com',            '+919876500065', 'Aurangabad','Morning (9am-12pm)',   '2026-02-26', 'Salary doubled post promotion. Where to invest?', 'pending', NULL, NULL),
('Kaveri Murthy',      'kaveri.murthy@gmail.com',         '+919876500066', 'Mysore',    'Afternoon (12pm-5pm)','2026-02-26', 'Looking for safe investment for senior parents.', 'pending', NULL, NULL),
('Rishab Singhania',   'rishab.singhania@gmail.com',      '+919876500067', 'Kolkata',   'Evening (5pm-8pm)',    '2026-02-26', 'Want to compare MF schemes.', 'pending', NULL, NULL),
('Bindiya Thakkar',    'bindiya.thakkar@gmail.com',       '+919876500068', 'Bhavnagar', 'Morning (9am-12pm)',   '2026-02-27', 'New business — how to separate personal and business finances?', 'pending', NULL, NULL),
('Umesh Kurmi',        'umesh.kurmi@gmail.com',           '+919876500069', 'Chhindwara','Afternoon (12pm-5pm)','2026-02-27', 'Son sending money from US, how to invest?', 'pending', NULL, NULL),
('Varsha Kadam',       'varsha.kadam@gmail.com',          '+919876500070', 'Solapur',   'Evening (5pm-8pm)',    '2026-02-27', 'First salary, zero idea about money.', 'pending', NULL, NULL);

-- ─────────────────────────────────────────────────────────────
-- DONE ✅
-- ─────────────────────────────────────────────────────────────
SELECT 'Seed complete! ' || count(*) || ' profiles created.' AS result
FROM public.profiles
WHERE id::text LIKE '11111111-1111-1111-1111-%';

SELECT 'Call requests: ' || count(*) || ' rows inserted.' AS call_result
FROM public.call_requests
WHERE phone LIKE '+91987650%';
