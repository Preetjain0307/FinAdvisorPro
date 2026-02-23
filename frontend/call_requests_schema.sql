-- ============================================================
-- CONSULTATION BOOKING SYSTEM — Run this in Supabase SQL Editor
-- Copy ALL of this and run it as one block
-- ============================================================

-- 1. Create the updated_at trigger function (if not already exists)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Create the call_requests table
CREATE TABLE IF NOT EXISTS public.call_requests (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name            TEXT NOT NULL,
    email           TEXT NOT NULL,
    phone           TEXT NOT NULL,
    city            TEXT,
    preferred_time  TEXT NOT NULL,
    preferred_date  DATE,
    message         TEXT,
    status          TEXT NOT NULL DEFAULT 'pending',
    caller_notes    TEXT,
    called_at       TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Add updated_at trigger
DROP TRIGGER IF EXISTS call_requests_updated_at ON public.call_requests;
CREATE TRIGGER call_requests_updated_at
    BEFORE UPDATE ON public.call_requests
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. Enable RLS
ALTER TABLE public.call_requests ENABLE ROW LEVEL SECURITY;

-- 5. Drop old policies if they exist
DROP POLICY IF EXISTS "Anyone can book a call" ON public.call_requests;
DROP POLICY IF EXISTS "Anyone can view call requests" ON public.call_requests;
DROP POLICY IF EXISTS "Anyone can update call status" ON public.call_requests;

-- 6. Create open policies (public form doesn't require auth)
CREATE POLICY "Anyone can book a call"
    ON public.call_requests FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Anyone can view call requests"
    ON public.call_requests FOR SELECT
    USING (true);

CREATE POLICY "Anyone can update call status"
    ON public.call_requests FOR UPDATE
    USING (true);
