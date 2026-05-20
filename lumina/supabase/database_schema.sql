-- ==========================================
-- 1. CLEANUP & INITIAL SETUP
-- ==========================================
-- (Optional cleanup if re-running in development environment)
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
drop table if exists public.continue_watching cascade;
drop table if exists public.watchlists cascade;
drop table if exists public.profiles cascade;

-- ==========================================
-- 2. USER PROFILES TABLE & AUTH TRIGGER
-- ==========================================
create table public.profiles (
    id uuid references auth.users on delete cascade primary key,
    username text unique,
    avatar_url text,
    updated_at timestamptz default timezone('utc'::text, now()) not null,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Automatically create a public profile row when a new user registers via Supabase Auth
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

create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

-- ==========================================
-- 3. WATCHLISTS TABLE
-- ==========================================
create table public.watchlists (
    id bigint generated always as identity primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    tmdb_id text not null,
    media_type text not null check (media_type in ('movie', 'tv')),
    title text not null,
    poster_path text,
    added_at timestamptz default timezone('utc'::text, now()) not null,
    
    -- Prevent duplicate records of the same media entry per user
    unique(user_id, tmdb_id, media_type)
);

-- ==========================================
-- 4. CONTINUE WATCHING TABLE
-- ==========================================
create table public.continue_watching (
    id bigint generated always as identity primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    tmdb_id text not null,
    media_type text not null check (media_type in ('movie', 'tv')),
    title text not null,
    poster_path text,
    
    -- Playback state markers
    progress_seconds numeric(10, 2) default 0.00 not null,
    duration_seconds numeric(10, 2) default 0.00 not null,
    progress_percentage numeric(5, 2) generated always as (
        case when duration_seconds > 0 then (progress_seconds / duration_seconds) * 100 else 0.00 end
    ) stored,
    
    -- TV Specific structure columns (nullable for standalone movies)
    season_number integer default null,
    episode_number integer default null,
    episode_title text default null,
    
    updated_at timestamptz default timezone('utc'::text, now()) not null,
    
    unique(user_id, tmdb_id, media_type)
);

-- Indexing strategies to keep queries lighting fast under scale
create index idx_watchlist_user on public.watchlists(user_id);
create index idx_continue_watching_user_updated on public.continue_watching(user_id, updated_at desc);

-- Auto-update timestamps when modifying active playback states
create or replace function public.update_modified_column()
returns trigger language plpgsql as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$;

create trigger update_continue_watching_timestamp
    before update on public.continue_watching
    for each row execute procedure public.update_modified_column();

-- ==========================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================
alter table public.profiles enable row level security;
alter table public.watchlists enable row level security;
alter table public.continue_watching enable row level security;

-- Profiles: Anyone can view usernames/avatars, but only the owner can modify their profile row
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can update their own profile" on public.profiles for update to authenticated using (auth.uid() = id);

-- Watchlists: Completely isolated sandbox. Users can only see/mutate their own rows
create policy "Users can view their own watchlist" on public.watchlists for select to authenticated using (auth.uid() = user_id);
create policy "Users can insert into their own watchlist" on public.watchlists for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can delete from their own watchlist" on public.watchlists for delete to authenticated using (auth.uid() = user_id);

-- Continue Watching: Completely isolated sandbox
create policy "Users can view their own playback history" on public.continue_watching for select to authenticated using (auth.uid() = user_id);
create policy "Users can insert their own playback updates" on public.continue_watching for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can update their own playback updates" on public.continue_watching for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can remove items from their history" on public.continue_watching for delete to authenticated using (auth.uid() = user_id);