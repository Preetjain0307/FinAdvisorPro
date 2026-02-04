-- 1. PROFILES & ROLES
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  role text default 'user' check (role in ('user', 'admin')), -- Admin Role here
  
  -- Financial Data
  age integer,
  monthly_income numeric,
  monthly_expenses numeric,
  total_savings numeric,
  
  -- Risk Profile
  risk_score numeric, -- 0-100
  risk_category text check (risk_category in ('Low', 'Medium', 'High')),
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. INVESTMENTS (The Asset Database)
create table public.investments (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  type text not null, -- 'Stock', 'Mutual Fund', 'FD', 'Gold', 'Bond'
  ticker_symbol text,
  current_price numeric not null,
  
  -- Performance
  return_1y numeric,
  return_3y numeric,
  return_5y numeric,
  
  -- Scoring Metrics
  volatility_score numeric, -- 0-100 (Low is good)
  liquidity_score numeric,  -- 0-100 (High is good)
  stability_score numeric,  -- 0-100 (High is good)
  
  -- Final Rating
  rating_stars numeric, -- 1-5
  rating_grade text,    -- 'A', 'B', etc.
  
  last_updated timestamp with time zone default now()
);

-- 3. PORTFOLIOS (User Holdings)
create table public.portfolios (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  investment_id uuid references public.investments(id) not null,
  quantity numeric default 0,
  average_buy_price numeric default 0,
  created_at timestamp with time zone default now()
);

-- 4. GOALS (Financial Targets)
create table public.goals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  name text not null,
  target_amount numeric not null,
  current_amount numeric default 0,
  deadline date,
  created_at timestamp with time zone default now()
);

-- 5. RATING RULES (Admin Configurable)
create table public.rating_rules (
  id uuid default gen_random_uuid() primary key,
  metric_name text unique not null, -- 'Return', 'Risk', 'Stability'
  weight numeric not null -- Percentage (e.g., 0.4 for 40%)
);

-- Seed Rating Rules
insert into public.rating_rules (metric_name, weight) values 
('Return', 0.4), ('Risk', 0.3), ('Stability', 0.2), ('Liquidity', 0.1);

-- RLS Policies
alter table public.profiles enable row level security;
alter table public.investments enable row level security;
alter table public.portfolios enable row level security;
alter table public.goals enable row level security;
alter table public.rating_rules enable row level security;

-- Profiles: Users view/edit own. Admins view all.
create policy "Users manage own profile" on public.profiles for all using (auth.uid() = id);
create policy "Admins view all profiles" on public.profiles for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Investments: Everyone reads. Admins edit.
create policy "Public read investments" on public.investments for select using (true);
create policy "Admins manage investments" on public.investments for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Portfolios/Goals: Users manage own.
create policy "Users manage own portfolio" on public.portfolios for all using (auth.uid() = user_id);
create policy "Users manage own goals" on public.goals for all using (auth.uid() = user_id);

-- Profile Trigger
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'user');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Seed Mock Investments
insert into public.investments (name, type, ticker_symbol, current_price, return_1y, volatility_score, liquidity_score, stability_score, rating_stars, rating_grade)
values
('HDFC Bank', 'Stock', 'HDFCBANK', 1450.00, 12, 60, 100, 80, 4.5, 'A'),
('Reliance Ind', 'Stock', 'RELIANCE', 2900.00, 15, 65, 100, 85, 4.8, 'A+'),
('Gold ETF', 'Gold', 'GOLDETF', 5600.00, 8, 10, 90, 95, 4.0, 'A'),
('Govt Bond', 'Bond', 'GOI', 100.00, 7, 5, 50, 99, 3.8, 'B');
