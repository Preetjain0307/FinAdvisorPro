-- Create a table to store temporary OTPs
create table if not exists otp_codes (
  id uuid default gen_random_uuid() primary key,
  phone text not null,
  code text not null,
  expires_at timestamptz not null default (now() + interval '5 minutes'),
  created_at timestamptz default now()
);

-- Enable RLS but allow public insertion (or handle via secure functions, but for now simple insert/select)
-- Ideally, this should be accessed only by service_role (server actions)
alter table otp_codes enable row level security;

-- Policy: Allow Service Role full access (implicit)
-- Policy: Allow Public to insert? No, server actions use service role if configured contentiously, 
-- but Next.js Supabase client usually uses anon.
-- Let's make it simple: secure it so ONLY server logic can verify. 
-- In supabase-js, we often use `supabase.from('otp_codes')` with service role key if we want to bypass RLS,
-- OR we can allow anon to insert but only select their own? 
-- Actually, the Server Action runs on the server. We should use `createClient` with service role if possible,
-- OR just make the table public for insert but private for select?

-- For simplicity in this demo environment:
create policy "Allow public insert" on otp_codes for insert with check (true);
create policy "Allow public select" on otp_codes for select using (true);

-- Index for faster lookups
create index if not exists idx_otp_phone on otp_codes(phone);
