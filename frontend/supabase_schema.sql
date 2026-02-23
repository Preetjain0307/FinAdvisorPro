-- ============================================================
-- FIN ADVISOR PRO — MINIMAL DATABASE SCHEMA
-- Only essential financial data. UI preferences stay in localStorage.
-- Safe to re-run (IF NOT EXISTS + DROP POLICY IF EXISTS).
-- Paste into Supabase SQL Editor and click "Run".
-- ============================================================

-- ─────────────────────────────────────────
-- 1. PROFILES  (auto-created on signup)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
    id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name   TEXT,
    email       TEXT,
    phone       TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own profiles" ON public.profiles;
CREATE POLICY "Users manage own profiles" ON public.profiles
    FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ─────────────────────────────────────────
-- 2. BUDGET ITEMS  (/planning/budget)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.budget_items (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name        TEXT NOT NULL,
    amount      NUMERIC(14, 2) NOT NULL DEFAULT 0,
    category    TEXT NOT NULL CHECK (category IN ('Income', 'Need', 'Want', 'Savings')),
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.budget_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own budget_items" ON public.budget_items;
CREATE POLICY "Users manage own budget_items" ON public.budget_items
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ─────────────────────────────────────────
-- 3. LOANS  (/planning/loan)
-- Strategy & extra EMI stay in localStorage (UI preference).
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.loans (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name        TEXT NOT NULL,
    balance     NUMERIC(14, 2) NOT NULL DEFAULT 0,
    rate        NUMERIC(6, 3) NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.loans ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own loans" ON public.loans;
CREATE POLICY "Users manage own loans" ON public.loans
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ─────────────────────────────────────────
-- 4. INSURANCE  (/planning/insurance)
-- Only financial numbers. Checkboxes stay in localStorage.
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.insurance_profile (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id           UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    annual_income     NUMERIC(14, 2) NOT NULL DEFAULT 0,
    total_liabilities NUMERIC(14, 2) NOT NULL DEFAULT 0,
    existing_cover    NUMERIC(14, 2) NOT NULL DEFAULT 0,
    updated_at        TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.insurance_profile ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own insurance_profile" ON public.insurance_profile;
CREATE POLICY "Users manage own insurance_profile" ON public.insurance_profile
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.insurance_renewals (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name         TEXT NOT NULL,
    renewal_date DATE NOT NULL,
    premium      NUMERIC(14, 2) DEFAULT 0,
    created_at   TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.insurance_renewals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own insurance_renewals" ON public.insurance_renewals;
CREATE POLICY "Users manage own insurance_renewals" ON public.insurance_renewals
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ─────────────────────────────────────────
-- 5. INVESTMENT GOALS + RISK QUIZ  (/planning/investment)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.investment_goals (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name           TEXT NOT NULL,
    target_amount  NUMERIC(14, 2) NOT NULL DEFAULT 0,
    current_amount NUMERIC(14, 2) NOT NULL DEFAULT 0,
    created_at     TIMESTAMPTZ DEFAULT NOW(),
    updated_at     TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.investment_goals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own investment_goals" ON public.investment_goals;
CREATE POLICY "Users manage own investment_goals" ON public.investment_goals
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.risk_profiles (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    quiz_score    INT NOT NULL DEFAULT 0,
    risk_category TEXT,          -- 'Conservative' | 'Moderate' | 'Aggressive'
    completed     BOOLEAN DEFAULT FALSE,
    updated_at    TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.risk_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own risk_profiles" ON public.risk_profiles;
CREATE POLICY "Users manage own risk_profiles" ON public.risk_profiles
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ─────────────────────────────────────────
-- 6. ESTATE ASSETS  (/planning/estate)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.estate_assets (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    asset_type TEXT NOT NULL,
    details    TEXT NOT NULL,
    nominee    TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.estate_assets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own estate_assets" ON public.estate_assets;
CREATE POLICY "Users manage own estate_assets" ON public.estate_assets
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ─────────────────────────────────────────
-- 7. TAX PLANNING  (/planning/tax)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.tax_profile (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    annual_income  NUMERIC(14, 2) NOT NULL DEFAULT 0,
    section_80c    NUMERIC(14, 2) NOT NULL DEFAULT 150000,
    section_80d    NUMERIC(14, 2) NOT NULL DEFAULT 25000,
    hra_exemption  NUMERIC(14, 2) NOT NULL DEFAULT 0,
    updated_at     TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.tax_profile ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own tax_profile" ON public.tax_profile;
CREATE POLICY "Users manage own tax_profile" ON public.tax_profile
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.tax_deductions (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name       TEXT NOT NULL,
    amount     NUMERIC(14, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.tax_deductions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own tax_deductions" ON public.tax_deductions;
CREATE POLICY "Users manage own tax_deductions" ON public.tax_deductions
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ─────────────────────────────────────────
-- Auto-update updated_at timestamps
-- ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE t TEXT;
BEGIN
    FOREACH t IN ARRAY ARRAY[
        'profiles','budget_items','loans','insurance_profile',
        'investment_goals','risk_profiles','estate_assets','tax_profile'
    ]
    LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS set_updated_at ON public.%I;
            CREATE TRIGGER set_updated_at
            BEFORE UPDATE ON public.%I
            FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
        ', t, t);
    END LOOP;
END;
$$;

-- ─────────────────────────────────────────
-- Auto-create profile row on new user signup
-- ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
