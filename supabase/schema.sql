-- ============================================================
-- VISBY – Full Supabase Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ============================================================

-- ─── EXTENSIONS ─────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ============================================================
-- 1. USERS (profile data, linked to Supabase Auth)
-- ============================================================
create table if not exists users (
  id            uuid primary key references auth.users(id) on delete cascade,
  email         text not null,
  username      text unique not null,
  display_name  text not null default '',
  photo_url     text,
  created_at    timestamptz not null default now(),
  last_active   timestamptz not null default now(),

  -- Progression
  level              int not null default 1,
  aura               int not null default 200,
  total_aura_earned  int not null default 200,

  -- Streaks
  current_streak  int not null default 0,
  longest_streak  int not null default 0,
  last_check_in   timestamptz default now(),

  -- Stats
  stamps_collected  int not null default 0,
  bites_collected   int not null default 0,
  badges_earned     int not null default 0,
  countries_visited int not null default 0,
  cities_visited    int not null default 0,
  total_care_points int not null default 0,
  games_played           int not null default 0,
  perfect_cooking_games  int not null default 0,
  perfect_word_matches   int not null default 0,
  treasure_hunts_completed int not null default 0,

  visited_countries text[] not null default '{}',
  lessons_completed_today int default 0,
  last_lesson_date  text,

  visby_id      text,
  skills        jsonb not null default '{"language":0,"geography":0,"culture":0,"history":0,"cooking":0,"exploration":0}',
  settings      jsonb not null default '{"notifications":true,"locationTracking":true,"privateProfile":false,"language":"en","measurementUnit":"metric"}',

  -- Cached Visby data for social features
  visby_appearance jsonb,
  visby_equipped   jsonb
);

-- ============================================================
-- 2. VISBIES (avatar / pet)
-- ============================================================
create table if not exists visbies (
  id           text primary key,
  user_id      uuid not null references users(id) on delete cascade,
  name         text not null default 'Visby',
  created_at   timestamptz not null default now(),
  appearance   jsonb not null default '{}',
  equipped     jsonb not null default '{}',
  owned_cosmetics text[] not null default '{}',
  current_mood text not null default 'happy',
  needs        jsonb not null default '{"hunger":80,"happiness":80,"energy":80,"knowledge":50,"socialBattery":80}'
);

create index if not exists idx_visbies_user on visbies(user_id);

-- ============================================================
-- 3. STAMPS (location collectibles)
-- ============================================================
create table if not exists stamps (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid not null references users(id) on delete cascade,
  type           text not null,
  location_id    text not null default '',
  location_name  text not null,
  city           text not null default '',
  country        text not null default '',
  country_code   text not null default '',
  latitude       double precision not null default 0,
  longitude      double precision not null default 0,
  collected_at   timestamptz not null default now(),
  photo_url      text,
  notes          text,
  is_fast_travel boolean not null default false,
  aura_spent     int,
  is_public      boolean not null default true,
  likes          int not null default 0
);

create index if not exists idx_stamps_user on stamps(user_id);

-- ============================================================
-- 4. BITES (food collectibles)
-- ============================================================
create table if not exists bites (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references users(id) on delete cascade,
  name            text not null,
  description     text,
  cuisine         text not null default '',
  category        text not null default 'main_dish',
  city            text,
  country         text,
  restaurant_name text,
  photo_url       text,
  rating          int not null default 3,
  notes           text,
  is_made_at_home boolean not null default false,
  recipe          jsonb,
  collected_at    timestamptz not null default now(),
  is_public       boolean not null default true,
  likes           int not null default 0,
  tags            text[] not null default '{}'
);

create index if not exists idx_bites_user on bites(user_id);

-- ============================================================
-- 5. BADGES (definitions)
-- ============================================================
create table if not exists badges (
  id               text primary key,
  name             text not null,
  description      text not null default '',
  category         text not null default 'explorer',
  icon_emoji       text not null default '⭐',
  color            text not null default '#FFD700',
  rarity           text not null default 'common',
  requirement      jsonb not null default '{}',
  aura_reward      int not null default 0,
  is_secret        boolean not null default false,
  image_url        text,
  unlocks_cosmetic text,
  unlocks_perk     text,
  total_earned     int not null default 0,
  created_at       timestamptz not null default now()
);

-- ============================================================
-- 6. USER_BADGES (earned badges)
-- ============================================================
create table if not exists user_badges (
  id        uuid primary key default uuid_generate_v4(),
  user_id   uuid not null references users(id) on delete cascade,
  badge_id  text not null references badges(id) on delete cascade,
  earned_at timestamptz not null default now(),
  progress  int not null default 100,
  is_new    boolean not null default true,
  unique(user_id, badge_id)
);

-- ============================================================
-- 7. COUNTRIES
-- ============================================================
create table if not exists countries (
  id               text primary key,
  name             text not null,
  country_code     text not null,
  flag_emoji       text not null default '',
  visit_cost_aura  int not null default 0,
  house_price_aura int not null default 0,
  description      text not null default '',
  room_theme       text not null default 'traditional',
  accent_color     text not null default '#000000',
  image_url        text
);

-- ============================================================
-- 8. COUNTRY_FACTS
-- ============================================================
create table if not exists country_facts (
  id         uuid primary key default uuid_generate_v4(),
  country_id text not null references countries(id) on delete cascade,
  title      text not null,
  content    text not null,
  icon       text not null default '📖',
  category   text not null default 'fun',
  image_url  text
);

create index if not exists idx_country_facts_country on country_facts(country_id);

-- ============================================================
-- 9. ROOMS (country house rooms)
-- ============================================================
create table if not exists rooms (
  id          uuid primary key default uuid_generate_v4(),
  country_id  text not null references countries(id) on delete cascade,
  name        text not null,
  icon        text not null default '🏠',
  wall_color  text not null default '#FFFFFF',
  floor_color text not null default '#DEB887',
  sort_order  int not null default 0,
  objects     jsonb not null default '[]'
);

create index if not exists idx_rooms_country on rooms(country_id);

-- ============================================================
-- 10. ROOM_OBJECTS (interactive objects inside rooms)
-- ============================================================
create table if not exists room_objects (
  id            uuid primary key default uuid_generate_v4(),
  room_id       uuid not null references rooms(id) on delete cascade,
  icon          text not null default '📦',
  label         text not null,
  x             double precision not null default 50,
  y             double precision not null default 50,
  interactive   boolean default false,
  learn_title   text,
  learn_content text,
  aura_reward   int default 0
);

create index if not exists idx_room_objects_room on room_objects(room_id);

-- ============================================================
-- 11. QUIZ_QUESTIONS
-- ============================================================
create table if not exists quiz_questions (
  id       uuid primary key default uuid_generate_v4(),
  question text not null,
  options  jsonb not null default '[]',
  correct  int not null default 0,
  category text not null default 'general'
);

-- ============================================================
-- 12. FLASHCARDS
-- ============================================================
create table if not exists flashcards (
  id    uuid primary key default uuid_generate_v4(),
  front text not null,
  back  text not null,
  icon  text not null default '📝',
  deck  text not null default 'general'
);

-- ============================================================
-- 13. LESSONS
-- ============================================================
create table if not exists lessons (
  id    text primary key,
  title text not null
);

-- ============================================================
-- 14. LESSON_SLIDES
-- ============================================================
create table if not exists lesson_slides (
  id         uuid primary key default uuid_generate_v4(),
  lesson_id  text not null references lessons(id) on delete cascade,
  text       text not null,
  icon       text not null default '📖',
  sort_order int not null default 0
);

create index if not exists idx_lesson_slides_lesson on lesson_slides(lesson_id);

-- ============================================================
-- 15. LOCATIONS (stamp locations / nearby places)
-- ============================================================
create table if not exists locations (
  id              uuid primary key default uuid_generate_v4(),
  name            text not null,
  type            text not null default 'landmark',
  description     text not null default '',
  distance_km     double precision default 0,
  latitude        double precision,
  longitude       double precision,
  image_url       text,
  country_id      text,
  category        text,
  learning_points int default 0
);

-- ============================================================
-- 16. COSMETICS
-- ============================================================
create table if not exists cosmetics (
  id           text primary key,
  name         text not null,
  description  text not null default '',
  type         text not null default 'outfit',
  rarity       text not null default 'common',
  price        int not null default 0,
  country      text,
  icon         text not null default '👕',
  members_only boolean default false,
  unlock_type  text default 'purchase',
  unlock_requirement text,
  image_url    text,
  preview_url  text,
  is_limited   boolean default false,
  seasonal_event text,
  created_at   timestamptz not null default now()
);

-- ============================================================
-- 17. USER_HOUSES
-- ============================================================
create table if not exists user_houses (
  id                  uuid primary key default uuid_generate_v4(),
  user_id             uuid not null references users(id) on delete cascade,
  country_id          text not null references countries(id) on delete cascade,
  purchased_at        timestamptz not null default now(),
  house_name          text,
  last_visited_at     timestamptz,
  room_customizations jsonb default '{}',
  unique(user_id, country_id)
);

-- ============================================================
-- 18. USER_LESSON_PROGRESS
-- ============================================================
create table if not exists user_lesson_progress (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references users(id) on delete cascade,
  lesson_id    text not null,
  started      boolean not null default false,
  completed    boolean not null default false,
  started_at   timestamptz,
  completed_at timestamptz,
  quiz_score   int,
  attempts     int not null default 0,
  unique(user_id, lesson_id)
);

-- ============================================================
-- 19. AURA_TRANSACTIONS (audit log)
-- ============================================================
create table if not exists aura_transactions (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references users(id) on delete cascade,
  amount       int not null,
  type         text not null,
  description  text not null default '',
  reference_id text,
  created_at   timestamptz not null default now()
);

create index if not exists idx_aura_tx_user on aura_transactions(user_id);

-- ============================================================
-- 20. FRIEND_REQUESTS
-- ============================================================
create table if not exists friend_requests (
  id                uuid primary key default uuid_generate_v4(),
  from_user_id      uuid not null references users(id) on delete cascade,
  from_username     text not null,
  from_display_name text not null default '',
  to_user_id        uuid not null references users(id) on delete cascade,
  status            text not null default 'pending',
  created_at        timestamptz not null default now()
);

create index if not exists idx_fr_to on friend_requests(to_user_id, status);

-- ============================================================
-- 21. FRIENDS (accepted friendships — bidirectional)
-- ============================================================
create table if not exists friends (
  id              uuid primary key default uuid_generate_v4(),
  user_id_a       uuid not null references users(id) on delete cascade,
  username_a      text not null,
  display_name_a  text not null default '',
  level_a         int default 1,
  user_id_b       uuid not null references users(id) on delete cascade,
  username_b      text not null,
  display_name_b  text not null default '',
  level_b         int default 1,
  created_at      timestamptz not null default now(),
  unique(user_id_a, user_id_b)
);

-- ============================================================
-- 22. PRESENCE (who's online / in which room)
-- ============================================================
create table if not exists presence (
  user_id    uuid primary key references users(id) on delete cascade,
  username   text not null,
  place_type text not null default 'home',
  country_id text,
  room_id    text,
  pin_id     text,
  label      text,
  updated_at timestamptz not null default now()
);

-- ============================================================
-- 23. PLACE_CHAT_MESSAGES (Club Penguin–style room chat)
-- ============================================================
create table if not exists place_chat_messages (
  id          uuid primary key default uuid_generate_v4(),
  channel_key text not null,
  user_id     uuid not null references users(id) on delete cascade,
  username    text not null,
  message     text not null,
  created_at  timestamptz not null default now()
);

create index if not exists idx_pcm_channel on place_chat_messages(channel_key, created_at desc);

-- ============================================================
-- 24. REPORTS (user-reported messages for moderation)
-- ============================================================
create table if not exists reports (
  id          uuid primary key default uuid_generate_v4(),
  reporter_id uuid not null references users(id) on delete cascade,
  message_id  uuid not null,
  reason      text not null default 'inappropriate',
  status      text not null default 'pending', -- pending | reviewed | dismissed
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at  timestamptz not null default now()
);

create index if not exists idx_reports_status on reports(status, created_at desc);

-- ============================================================
-- 25. BLOCKED_USERS (per-user block list)
-- ============================================================
create table if not exists blocked_users (
  id          uuid primary key default uuid_generate_v4(),
  blocker_id  uuid not null references users(id) on delete cascade,
  blocked_id  uuid not null references users(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique(blocker_id, blocked_id)
);

create index if not exists idx_blocked_users_blocker on blocked_users(blocker_id);

-- ============================================================
-- 26. Server-side content validation for place chat
-- ============================================================
create or replace function check_chat_message_content()
returns trigger as $$
declare
  blocked_pattern text := 'fuck|shit|damn|bitch|dick|cock|pussy|bastard|nigger|nigga|faggot|fag|slut|whore|retard|kys|kill\s*my\s*self|suicide|want\s*to\s*die';
  msg text;
begin
  msg := lower(NEW.message);
  if msg ~ blocked_pattern then
    raise exception 'Message blocked by content filter';
  end if;
  return NEW;
end;
$$ language plpgsql;

drop trigger if exists trg_check_chat_content on place_chat_messages;
create trigger trg_check_chat_content
  before insert on place_chat_messages
  for each row
  execute function check_chat_message_content();

-- ============================================================
-- 27. ANALYTICS_EVENTS
-- ============================================================
create table if not exists analytics_events (
  id          uuid primary key default uuid_generate_v4(),
  event_name  text not null,
  properties  jsonb default '{}',
  created_at  timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
alter table users enable row level security;
alter table visbies enable row level security;
alter table stamps enable row level security;
alter table bites enable row level security;
alter table badges enable row level security;
alter table user_badges enable row level security;
alter table countries enable row level security;
alter table country_facts enable row level security;
alter table rooms enable row level security;
alter table room_objects enable row level security;
alter table quiz_questions enable row level security;
alter table flashcards enable row level security;
alter table lessons enable row level security;
alter table lesson_slides enable row level security;
alter table locations enable row level security;
alter table cosmetics enable row level security;
alter table user_houses enable row level security;
alter table user_lesson_progress enable row level security;
alter table aura_transactions enable row level security;
alter table friend_requests enable row level security;
alter table friends enable row level security;
alter table presence enable row level security;
alter table place_chat_messages enable row level security;
alter table reports enable row level security;
alter table blocked_users enable row level security;
alter table analytics_events enable row level security;

-- ─── PUBLIC READ for content tables (everyone can read) ─────
drop policy if exists "Public read countries"     on countries;
drop policy if exists "Public read country_facts" on country_facts;
drop policy if exists "Public read rooms"         on rooms;
drop policy if exists "Public read room_objects"  on room_objects;
drop policy if exists "Public read quiz_questions" on quiz_questions;
drop policy if exists "Public read flashcards"    on flashcards;
drop policy if exists "Public read lessons"       on lessons;
drop policy if exists "Public read lesson_slides" on lesson_slides;
drop policy if exists "Public read locations"     on locations;
drop policy if exists "Public read cosmetics"     on cosmetics;
drop policy if exists "Public read badges"        on badges;

create policy "Public read countries"     on countries     for select using (true);
create policy "Public read country_facts" on country_facts for select using (true);
create policy "Public read rooms"         on rooms         for select using (true);
create policy "Public read room_objects"  on room_objects  for select using (true);
create policy "Public read quiz_questions" on quiz_questions for select using (true);
create policy "Public read flashcards"    on flashcards    for select using (true);
create policy "Public read lessons"       on lessons       for select using (true);
create policy "Public read lesson_slides" on lesson_slides for select using (true);
create policy "Public read locations"     on locations     for select using (true);
create policy "Public read cosmetics"     on cosmetics     for select using (true);
create policy "Public read badges"        on badges        for select using (true);

-- ─── USER-SCOPED policies (users can only access their own data) ──
-- Users
drop policy if exists "Users read own" on users;
drop policy if exists "Users update own" on users;
drop policy if exists "Users insert own" on users;
drop policy if exists "Users read by username" on users;
create policy "Users read own" on users for select using (auth.uid() = id);
create policy "Users update own" on users for update using (auth.uid() = id);
create policy "Users insert own" on users for insert with check (auth.uid() = id);
create policy "Users read by username" on users for select using (true);

-- Visbies
drop policy if exists "Visbies read own" on visbies;
drop policy if exists "Visbies insert own" on visbies;
drop policy if exists "Visbies update own" on visbies;
create policy "Visbies read own" on visbies for select using (auth.uid() = user_id);
create policy "Visbies insert own" on visbies for insert with check (auth.uid() = user_id);
create policy "Visbies update own" on visbies for update using (auth.uid() = user_id);

-- Stamps
drop policy if exists "Stamps read own" on stamps;
drop policy if exists "Stamps insert own" on stamps;
create policy "Stamps read own" on stamps for select using (auth.uid() = user_id);
create policy "Stamps insert own" on stamps for insert with check (auth.uid() = user_id);

-- Bites
drop policy if exists "Bites read own" on bites;
drop policy if exists "Bites insert own" on bites;
create policy "Bites read own" on bites for select using (auth.uid() = user_id);
create policy "Bites insert own" on bites for insert with check (auth.uid() = user_id);

-- User Badges
drop policy if exists "User badges read own" on user_badges;
drop policy if exists "User badges insert own" on user_badges;
drop policy if exists "User badges update own" on user_badges;
create policy "User badges read own" on user_badges for select using (auth.uid() = user_id);
create policy "User badges insert own" on user_badges for insert with check (auth.uid() = user_id);
create policy "User badges update own" on user_badges for update using (auth.uid() = user_id);

-- User Houses
drop policy if exists "Houses read own" on user_houses;
drop policy if exists "Houses insert own" on user_houses;
drop policy if exists "Houses update own" on user_houses;
create policy "Houses read own" on user_houses for select using (auth.uid() = user_id);
create policy "Houses insert own" on user_houses for insert with check (auth.uid() = user_id);
create policy "Houses update own" on user_houses for update using (auth.uid() = user_id);

-- User Lesson Progress
drop policy if exists "Progress read own" on user_lesson_progress;
drop policy if exists "Progress insert own" on user_lesson_progress;
drop policy if exists "Progress update own" on user_lesson_progress;
create policy "Progress read own" on user_lesson_progress for select using (auth.uid() = user_id);
create policy "Progress insert own" on user_lesson_progress for insert with check (auth.uid() = user_id);
create policy "Progress update own" on user_lesson_progress for update using (auth.uid() = user_id);

-- Aura Transactions
drop policy if exists "Aura tx read own" on aura_transactions;
drop policy if exists "Aura tx insert own" on aura_transactions;
create policy "Aura tx read own" on aura_transactions for select using (auth.uid() = user_id);
create policy "Aura tx insert own" on aura_transactions for insert with check (auth.uid() = user_id);

-- Friend Requests
drop policy if exists "FR read involved" on friend_requests;
drop policy if exists "FR insert own" on friend_requests;
drop policy if exists "FR update target" on friend_requests;
create policy "FR read involved" on friend_requests for select using (auth.uid() = from_user_id or auth.uid() = to_user_id);
create policy "FR insert own" on friend_requests for insert with check (auth.uid() = from_user_id);
create policy "FR update target" on friend_requests for update using (auth.uid() = to_user_id);

-- Friends
drop policy if exists "Friends read involved" on friends;
drop policy if exists "Friends insert own" on friends;
create policy "Friends read involved" on friends for select using (auth.uid() = user_id_a or auth.uid() = user_id_b);
create policy "Friends insert own" on friends for insert with check (auth.uid() = user_id_a or auth.uid() = user_id_b);

-- Presence
drop policy if exists "Presence read all" on presence;
drop policy if exists "Presence upsert own" on presence;
drop policy if exists "Presence update own" on presence;
drop policy if exists "Presence delete own" on presence;
create policy "Presence read all" on presence for select using (true);
create policy "Presence upsert own" on presence for insert with check (auth.uid() = user_id);
create policy "Presence update own" on presence for update using (auth.uid() = user_id);
create policy "Presence delete own" on presence for delete using (auth.uid() = user_id);

-- Place Chat
drop policy if exists "Chat read all" on place_chat_messages;
drop policy if exists "Chat insert own" on place_chat_messages;
create policy "Chat read all" on place_chat_messages for select using (true);
create policy "Chat insert own" on place_chat_messages for insert with check (auth.uid() = user_id);

-- Reports
drop policy if exists "Reports insert own" on reports;
drop policy if exists "Reports read own" on reports;
create policy "Reports insert own" on reports for insert with check (auth.uid() = reporter_id);
create policy "Reports read own" on reports for select using (auth.uid() = reporter_id);

-- Blocked Users
drop policy if exists "Blocked read own" on blocked_users;
drop policy if exists "Blocked insert own" on blocked_users;
drop policy if exists "Blocked delete own" on blocked_users;
create policy "Blocked read own" on blocked_users for select using (auth.uid() = blocker_id);
create policy "Blocked insert own" on blocked_users for insert with check (auth.uid() = blocker_id);
create policy "Blocked delete own" on blocked_users for delete using (auth.uid() = blocker_id);

-- Analytics (anyone can insert, only service role can read)
drop policy if exists "Analytics insert" on analytics_events;
create policy "Analytics insert" on analytics_events for insert with check (true);

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP (trigger on auth.users)
-- ============================================================
-- This runs as SECURITY DEFINER so it bypasses RLS.
-- It reads username from the user_metadata passed during signUp.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  _username text;
begin
  _username := coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1));

  insert into public.users (id, email, username, display_name, visby_id)
  values (
    new.id,
    new.email,
    _username,
    _username,
    'visby_' || new.id::text
  );

  insert into public.visbies (id, user_id, name)
  values (
    'visby_' || new.id::text,
    new.id,
    _username || '''s Visby'
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- REALTIME (enable for place chat)
-- ============================================================
-- Run this to enable realtime on the place_chat_messages table:
-- alter publication supabase_realtime add table place_chat_messages;

-- ============================================================
-- STORAGE BUCKET (for images)
-- ============================================================
-- Create via Dashboard → Storage → New bucket → "content-images" (public)
-- Or run:
-- insert into storage.buckets (id, name, public) values ('content-images', 'content-images', true);
