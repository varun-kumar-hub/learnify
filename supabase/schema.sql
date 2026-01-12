-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES
create table if not exists profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  avatar_url text,
  gemini_api_key text,
  streak_count integer default 0,
  last_active_date date,
  updated_at timestamp with time zone,
  constraint username_length check (char_length(full_name) >= 3)
);

create table if not exists activity_logs (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users not null,
    activity_date date default current_date,
    minutes_active integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()),
    unique(user_id, activity_date)
);

alter table activity_logs enable row level security;

create policy "Users can insert their own activity"
  on activity_logs for insert
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own activity"
  on activity_logs for update
  using ((select auth.uid()) = user_id);

create policy "Users can view their own activity"
  on activity_logs for select
  using ((select auth.uid()) = user_id);

-- RLS for Profiles
alter table profiles enable row level security;

do $$ begin
  drop policy if exists "Public profiles are viewable by everyone." on profiles;
  drop policy if exists "Users can view own profile." on profiles;
  drop policy if exists "Users can insert their own profile." on profiles;
  drop policy if exists "Users can update own profile." on profiles;
end $$;

create policy "Users can view own profile." on profiles for select using (auth.uid() = id);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

-- ==========================================
-- LEARNIFY v1.0 SCHEMA
-- ==========================================

-- 1. SUBJECTS
create table if not exists subjects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table subjects enable row level security;

do $$ begin
  drop policy if exists "Users can view own subjects" on subjects;
  drop policy if exists "Users can insert own subjects" on subjects;
  drop policy if exists "Users can delete own subjects" on subjects;
end $$;

create policy "Users can view own subjects" on subjects for select using (auth.uid() = user_id);
create policy "Users can insert own subjects" on subjects for insert with check (auth.uid() = user_id);
create policy "Users can delete own subjects" on subjects for delete using (auth.uid() = user_id);

-- 2. TOPICS
do $$ begin
  if not exists (select 1 from pg_type where typname = 'topic_status') then
    create type topic_status as enum ('LOCKED', 'AVAILABLE', 'GENERATED', 'COMPLETED');
  end if;
end $$;

create table if not exists topics (
  id uuid default uuid_generate_v4() primary key,
  subject_id uuid references subjects on delete cascade not null,
  title text not null,
  description text,
  level text default 'Beginner', 
  status topic_status default 'LOCKED',
  order_index integer default 0,
  x float default 0,
  y float default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table topics enable row level security;

do $$ begin
  drop policy if exists "Users can view own topics" on topics;
  drop policy if exists "Users can insert own topics" on topics;
  drop policy if exists "Users can update own topics" on topics;
  drop policy if exists "Users can delete own topics" on topics;
end $$;

create policy "Users can view own topics" on topics for select using (
  exists (select 1 from subjects where subjects.id = topics.subject_id and subjects.user_id = auth.uid())
);
create policy "Users can insert own topics" on topics for insert with check (
  exists (select 1 from subjects where subjects.id = topics.subject_id and subjects.user_id = auth.uid())
);
create policy "Users can update own topics" on topics for update using (
  exists (select 1 from subjects where subjects.id = topics.subject_id and subjects.user_id = auth.uid())
);
create policy "Users can delete own topics" on topics for delete using (
  exists (select 1 from subjects where subjects.id = topics.subject_id and subjects.user_id = auth.uid())
);

-- 3. TOPIC DEPENDENCIES
create table if not exists topic_dependencies (
  parent_topic_id uuid references topics(id) on delete cascade not null,
  child_topic_id uuid references topics(id) on delete cascade not null,
  primary key (parent_topic_id, child_topic_id)
);

alter table topic_dependencies enable row level security;

do $$ begin
  drop policy if exists "Users can view own dependencies" on topic_dependencies;
  drop policy if exists "Users can manage dependencies" on topic_dependencies;
end $$;

create policy "Users can view own dependencies" on topic_dependencies for select using (
  exists (
    select 1 from topics 
    join subjects on subjects.id = topics.subject_id
    where topics.id = topic_dependencies.parent_topic_id and subjects.user_id = auth.uid()
  )
);
create policy "Users can manage dependencies" on topic_dependencies for all using (
  exists (
    select 1 from topics 
    join subjects on subjects.id = topics.subject_id
    where topics.id = topic_dependencies.parent_topic_id and subjects.user_id = auth.uid()
  )
);

-- 4. TOPIC CONTENT
create table if not exists topic_content (
  topic_id uuid references topics(id) on delete cascade primary key,
  content_json jsonb not null, 
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table topic_content enable row level security;

do $$ begin
  drop policy if exists "Users can view own content" on topic_content;
  drop policy if exists "Users can insert own content" on topic_content;
end $$;

create policy "Users can view own content" on topic_content for select using (
  exists (
    select 1 from topics 
    join subjects on subjects.id = topics.subject_id
    where topics.id = topic_content.topic_id and subjects.user_id = auth.uid()
  )
);
create policy "Users can insert own content" on topic_content for insert with check (
  exists (
    select 1 from topics 
    join subjects on subjects.id = topics.subject_id
    where topics.id = topic_content.topic_id and subjects.user_id = auth.uid()
  )
);

-- 5. FLASHCARDS
create table if not exists flashcards (
  id uuid default uuid_generate_v4() primary key,
  topic_id uuid references topics(id) on delete cascade not null,
  front text not null,
  back text not null,
  interval integer default 0,
  repetition integer default 0,
  ease_factor real default 2.5,
  next_review_at timestamp with time zone default now(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table flashcards enable row level security;

do $$ begin
  drop policy if exists "Users can manage own flashcards" on flashcards;
end $$;

create policy "Users can manage own flashcards" on flashcards for all using (
  exists (
    select 1 from topics 
    join subjects on subjects.id = topics.subject_id
    where topics.id = flashcards.topic_id and subjects.user_id = auth.uid()
  )
);

-- Trigger to handle new user signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing; -- Safe on duplicate
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- MIGRATION: Add streak columns
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'streak_count') THEN
        ALTER TABLE profiles ADD COLUMN streak_count integer default 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'last_active_date') THEN
        ALTER TABLE profiles ADD COLUMN last_active_date date;
    END IF;
END $$;