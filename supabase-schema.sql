-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users Table (Extends Supabase Auth)
create table public.users (
  id uuid references auth.users not null primary key,
  email text,
  is_premium boolean default false,
  subscription_status text default 'free',
  daily_generation_count integer default 0,
  last_generation_date date default current_date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.users enable row level security;

-- Policies for Users
create policy "Users can view their own data" on public.users
  for select using (auth.uid() = id);

create policy "Users can update their own data" on public.users
  for update using (auth.uid() = id);

-- Function to handle new user signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Saved Ideas Table
create table public.saved_ideas (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) not null,
  platform text not null,
  niche text not null,
  hook text not null,
  angle text not null,
  cta text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Saved Ideas
alter table public.saved_ideas enable row level security;

create policy "Users can view their own saved ideas" on public.saved_ideas
  for select using (auth.uid() = user_id);

create policy "Users can insert their own saved ideas" on public.saved_ideas
  for insert with check (auth.uid() = user_id);

create policy "Users can delete their own saved ideas" on public.saved_ideas
  for delete using (auth.uid() = user_id);
