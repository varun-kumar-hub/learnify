-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES (Keep existing)
create table profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  avatar_url text,
  gemini_api_key text, -- Encrypted/Stored Securely (RLS Protected)
  updated_at timestamp with time zone,
  constraint username_length check (char_length(full_name) >= 3)
);

-- RLS for Profiles
alter table profiles enable row level security;
-- IMPORTANT: Changed to private visibility for API Key security
drop policy if exists "Public profiles are viewable by everyone." on profiles;
create policy "Users can view own profile." on profiles for select using (auth.uid() = id);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

-- ==========================================
-- LEARNIFY v1.0 SCHEMA
-- ==========================================

-- 1. SUBJECTS: Top level container (e.g., "Physics", "React JS")
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

-- 2. TOPICS: Individual learning units
create type topic_status as enum ('LOCKED', 'AVAILABLE', 'GENERATED', 'COMPLETED');

create table topics (
  id uuid default uuid_generate_v4() primary key,
  subject_id uuid references subjects on delete cascade not null,
  title text not null,
  description text,
  level text default 'Beginner', -- Beginner, Intermediate, Advanced
  status topic_status default 'LOCKED',
  order_index integer default 0,
  x float default 0, -- Graph visual Position X
  y float default 0, -- Graph visual Position Y
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

-- 3. TOPIC DEPENDENCIES: Prerequisite graph
create table topic_dependencies (
  parent_topic_id uuid references topics(id) on delete cascade not null,
  child_topic_id uuid references topics(id) on delete cascade not null,
  primary key (parent_topic_id, child_topic_id)
);

alter table topic_dependencies enable row level security;
create policy "Users can view own dependencies" on topic_dependencies for select using (
  exists (
    select 1 from topics 
    join subjects on subjects.id = topics.subject_id
    where topics.id = topic_dependencies.parent_topic_id and subjects.user_id = auth.uid()
  )
);
-- Allow insert/delete if user owns the topics
create policy "Users can manage dependencies" on topic_dependencies for all using (
  exists (
    select 1 from topics 
    join subjects on subjects.id = topics.subject_id
    where topics.id = topic_dependencies.parent_topic_id and subjects.user_id = auth.uid()
  )
);

-- 4. TOPIC CONTENT: The AI generated lesson
create table topic_content (
  topic_id uuid references topics(id) on delete cascade primary key,
  content_json jsonb not null, -- { overview, core_concepts, flowchart, common_mistakes, summary }
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table topic_content enable row level security;
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

-- 5. FLASHCARDS: Updated to link to topics
create table flashcards (
  id uuid default uuid_generate_v4() primary key,
  topic_id uuid references topics(id) on delete cascade not null,
  front text not null,
  back text not null,
  
  -- SRS Fields (SM-2 Algorithm)
  interval integer default 0,
  repetition integer default 0,
  ease_factor real default 2.5,
  next_review_at timestamp with time zone default now(),
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table flashcards enable row level security;
create policy "Users can manage own flashcards" on flashcards for all using (
  exists (
    select 1 from topics 
    join subjects on subjects.id = topics.subject_id
    where topics.id = flashcards.topic_id and subjects.user_id = auth.uid()
  )
);

-- Trigger to handle new user signup (Keep existing)
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists to avoid duplication errors on re-run
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
