-- ==========================================
-- LEARNIFY COMPLETE DATABASE RESET SCRIPT
-- WARNING: This will DELETE ALL DATA.
-- ==========================================

-- 1. CLEANUP (Drop Existing Tables & Types)
drop table if exists flashcards cascade;
drop table if exists topic_content cascade;
drop table if exists topic_dependencies cascade;
drop table if exists topics cascade;
drop table if exists subjects cascade;
drop table if exists profiles cascade; -- NOW DROPPING PROFILES TO RE-CREATE CLEANLY
drop type if exists topic_status cascade;

-- ==========================================
-- 2. RE-CREATE SCHEMA
-- ==========================================

-- A. PROFILES
create table profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  avatar_url text,
  gemini_api_key text, -- Encrypted/Stored Securely (Private RLS)
  updated_at timestamp with time zone,
  constraint username_length check (char_length(full_name) >= 3)
);

alter table profiles enable row level security;

-- Profiles: Private Security Policy (User sees/edits only their own)
create policy "Users can view own profile." on profiles for select using (auth.uid() = id);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

-- B. AUTH TRIGGER (Auto-create profile on signup)
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists to avoid duplication errors
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- C. SUBJECTS
create table subjects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table subjects enable row level security;
create policy "Users can view own subjects" on subjects for select using (auth.uid() = user_id);
create policy "Users can insert own subjects" on subjects for insert with check (auth.uid() = user_id);
create policy "Users can delete own subjects" on subjects for delete using (auth.uid() = user_id);

-- D. TOPICS (with Status Enum)
create type topic_status as enum ('LOCKED', 'AVAILABLE', 'GENERATED', 'COMPLETED');

create table topics (
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

-- E. TOPIC DEPENDENCIES
create table topic_dependencies (
  parent_topic_id uuid references topics(id) on delete cascade not null,
  child_topic_id uuid references topics(id) on delete cascade not null,
  primary key (parent_topic_id, child_topic_id)
);

alter table topic_dependencies enable row level security;
create policy "Users can manage dependencies" on topic_dependencies for all using (
  exists (
    select 1 from topics 
    join subjects on subjects.id = topics.subject_id
    where topics.id = topic_dependencies.parent_topic_id and subjects.user_id = auth.uid()
  )
);

-- F. TOPIC CONTENT
create table topic_content (
  topic_id uuid references topics(id) on delete cascade primary key,
  content_json jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table topic_content enable row level security;
create policy "Users can manage content" on topic_content for all using (
  exists (
    select 1 from topics 
    join subjects on subjects.id = topics.subject_id
    where topics.id = topic_content.topic_id and subjects.user_id = auth.uid()
  )
);

-- G. FLASHCARDS
create table flashcards (
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
create policy "Users can manage flashcards" on flashcards for all using (
  exists (
    select 1 from topics 
    join subjects on subjects.id = topics.subject_id
    where topics.id = flashcards.topic_id and subjects.user_id = auth.uid()
  )
);
