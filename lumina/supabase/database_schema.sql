-- ==========================================
-- 1. USER PROFILES & AUTHENTICATION
-- ==========================================

-- Create the table for public user profiles.
create table public.profiles (
    id uuid references auth.users on delete cascade primary key,
    username text unique,
    avatar_url text,
    updated_at timestamptz default timezone('utc'::text, now()) not null,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS) for the profiles table.
-- This ensures that the security policies below are enforced.
alter table public.profiles enable row level security;

-- Function to create a new user profile when a user signs up via Supabase Auth.
create or replace function public.handle_new_user()
returns trigger
security definer set search_path = ''
language plpgsql as $$
begin
    insert into public.profiles (id, username, avatar_url)
    values (
        new.id,
        coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
        new.raw_user_meta_data->>'avatar_url'
    );
    return new;
end;
$$;

-- Trigger to execute the handle_new_user function after a new user is created.
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

-- ==========================================
-- 2. SECURITY POLICIES FOR PROFILES
-- ==========================================

-- Policy: Public profiles are viewable by everyone.
-- This allows any user, authenticated or not, to see basic profile info.
create policy "Public profiles are viewable by everyone" on public.profiles
    for select using (true);

-- Policy: Users can update their own profile.
-- This restricts updates to the user who owns the profile.
create policy "Users can update their own profile" on public.profiles
    for update using (auth.uid() = id);

