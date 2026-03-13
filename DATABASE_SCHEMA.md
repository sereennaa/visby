# Visby Database Schema (Supabase/PostgreSQL)

## Overview
This document outlines the database schema for Visby. The database is hosted on **Supabase** (free tier: 500MB database, 1GB storage).

## Tables

### users
Main user profile table.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_active TIMESTAMPTZ DEFAULT NOW(),
  
  -- Progression
  level INTEGER DEFAULT 1,
  aura INTEGER DEFAULT 0,
  total_aura_earned INTEGER DEFAULT 0,
  
  -- Streaks
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_check_in TIMESTAMPTZ,
  
  -- Stats
  stamps_collected INTEGER DEFAULT 0,
  bites_collected INTEGER DEFAULT 0,
  badges_earned INTEGER DEFAULT 0,
  countries_visited INTEGER DEFAULT 0,
  cities_visited INTEGER DEFAULT 0,
  
  -- Settings (JSONB for flexibility)
  settings JSONB DEFAULT '{
    "notifications": true,
    "locationTracking": true,
    "privateProfile": false,
    "language": "en",
    "measurementUnit": "metric"
  }'::jsonb
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
```

### visbies
Avatar/character customization.

```sql
CREATE TABLE visbies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Appearance (JSONB)
  appearance JSONB DEFAULT '{
    "skinTone": "#FFDAB9",
    "hairColor": "#8B4513",
    "hairStyle": "default",
    "eyeColor": "#4A90D9",
    "eyeShape": "round"
  }'::jsonb,
  
  -- Equipped cosmetics (JSONB)
  equipped JSONB DEFAULT '{}'::jsonb,
  
  -- Owned cosmetic IDs
  owned_cosmetics TEXT[] DEFAULT ARRAY['default_tunic', 'default_boots', 'default_backpack'],
  
  -- Current mood/expression
  current_mood TEXT DEFAULT 'happy',
  
  UNIQUE(user_id)
);

CREATE INDEX idx_visbies_user ON visbies(user_id);
```

### stamps
Location-based collectibles.

```sql
CREATE TABLE stamps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Location info
  type TEXT NOT NULL, -- city, country, landmark, park, beach, etc.
  location_id TEXT,
  location_name TEXT NOT NULL,
  city TEXT,
  country TEXT,
  country_code TEXT,
  
  -- Coordinates
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  
  -- Collection details
  collected_at TIMESTAMPTZ DEFAULT NOW(),
  photo_url TEXT,
  notes TEXT,
  
  -- Fast travel
  is_fast_travel BOOLEAN DEFAULT FALSE,
  aura_spent INTEGER,
  
  -- Social
  is_public BOOLEAN DEFAULT TRUE,
  likes INTEGER DEFAULT 0
);

CREATE INDEX idx_stamps_user ON stamps(user_id);
CREATE INDEX idx_stamps_type ON stamps(type);
CREATE INDEX idx_stamps_country ON stamps(country);
CREATE INDEX idx_stamps_location ON stamps USING GIST (
  ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
);
```

### bites
Food collectibles.

```sql
CREATE TABLE bites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Food info
  name TEXT NOT NULL,
  description TEXT,
  cuisine TEXT NOT NULL,
  category TEXT NOT NULL, -- main_dish, appetizer, dessert, etc.
  
  -- Location
  city TEXT,
  country TEXT,
  restaurant_name TEXT,
  
  -- User input
  photo_url TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  is_made_at_home BOOLEAN DEFAULT FALSE,
  
  -- Recipe (JSONB, optional)
  recipe JSONB,
  
  -- Metadata
  collected_at TIMESTAMPTZ DEFAULT NOW(),
  is_public BOOLEAN DEFAULT TRUE,
  likes INTEGER DEFAULT 0,
  
  -- Tags
  tags TEXT[] DEFAULT ARRAY[]::TEXT[]
);

CREATE INDEX idx_bites_user ON bites(user_id);
CREATE INDEX idx_bites_cuisine ON bites(cuisine);
CREATE INDEX idx_bites_category ON bites(category);
```

### badges
Badge definitions (static data).

```sql
CREATE TABLE badges (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL, -- explorer, foodie, collector, learner, etc.
  
  -- Visual
  image_url TEXT,
  icon_emoji TEXT NOT NULL,
  color TEXT,
  
  -- Requirements (JSONB)
  requirement JSONB NOT NULL,
  -- Example: {"type": "stamp_count", "target": 10, "description": "Collect 10 stamps"}
  
  -- Rewards
  aura_reward INTEGER DEFAULT 0,
  unlocks_cosmetic TEXT,
  unlocks_perk TEXT,
  
  -- Rarity
  rarity TEXT DEFAULT 'common', -- common, uncommon, rare, epic, legendary
  
  -- Metadata
  is_secret BOOLEAN DEFAULT FALSE,
  total_earned INTEGER DEFAULT 0
);
```

### user_badges
Junction table for earned badges.

```sql
CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  badge_id TEXT REFERENCES badges(id),
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  progress INTEGER DEFAULT 0, -- 0-100
  is_new BOOLEAN DEFAULT TRUE,
  
  UNIQUE(user_id, badge_id)
);

CREATE INDEX idx_user_badges_user ON user_badges(user_id);
```

### lessons
Learning content.

```sql
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- language, slang, culture, history, etc.
  
  -- Location context (optional)
  country TEXT,
  city TEXT,
  
  -- Content (JSONB array)
  content JSONB NOT NULL,
  -- Example: [{"type": "text", "content": "..."}, {"type": "flashcard", ...}]
  
  -- Quiz (JSONB)
  quiz JSONB NOT NULL,
  
  -- Rewards
  aura_reward INTEGER DEFAULT 50,
  
  -- Metadata
  difficulty TEXT DEFAULT 'beginner', -- beginner, intermediate, advanced
  duration INTEGER DEFAULT 5, -- minutes
  image_url TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[]
);

CREATE INDEX idx_lessons_category ON lessons(category);
CREATE INDEX idx_lessons_country ON lessons(country);
```

### user_lesson_progress
Track lesson completion.

```sql
CREATE TABLE user_lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id),
  started BOOLEAN DEFAULT FALSE,
  completed BOOLEAN DEFAULT FALSE,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  quiz_score INTEGER,
  attempts INTEGER DEFAULT 0,
  
  UNIQUE(user_id, lesson_id)
);

CREATE INDEX idx_user_lesson_progress_user ON user_lesson_progress(user_id);
```

### cosmetics
Cosmetic items for avatar customization.

```sql
CREATE TABLE cosmetics (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL, -- hat, outfit, accessory, backpack, shoes, companion
  rarity TEXT DEFAULT 'common',
  
  -- Unlock conditions
  unlock_type TEXT NOT NULL, -- level, badge, purchase, event, default
  unlock_requirement TEXT, -- Level number, badge ID, etc.
  
  -- Visual
  image_url TEXT NOT NULL,
  preview_url TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_limited BOOLEAN DEFAULT FALSE,
  seasonal_event TEXT
);

CREATE INDEX idx_cosmetics_type ON cosmetics(type);
CREATE INDEX idx_cosmetics_rarity ON cosmetics(rarity);
```

### countries (reference / static)
Countries kids can visit and buy houses in (Club Penguin–style). Can be seeded from app constants or stored in DB.

```sql
CREATE TABLE countries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  country_code TEXT NOT NULL,
  flag_emoji TEXT NOT NULL,
  visit_cost_aura INTEGER NOT NULL,
  house_price_aura INTEGER NOT NULL,
  description TEXT,
  room_theme TEXT NOT NULL,
  accent_color TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE country_facts (
  id TEXT PRIMARY KEY,
  country_id TEXT REFERENCES countries(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

CREATE INDEX idx_country_facts_country ON country_facts(country_id);
```

### user_houses
Houses a kid has bought in a country (then they can visit for free).

```sql
CREATE TABLE user_houses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  country_id TEXT NOT NULL,
  house_name TEXT,
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  last_visited_at TIMESTAMPTZ,
  UNIQUE(user_id, country_id)
);

CREATE INDEX idx_user_houses_user ON user_houses(user_id);
```

### aura_transactions
Track all Aura (XP) changes.

```sql
CREATE TABLE aura_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL, -- stamp_collect, bite_collect, quiz_complete, country_visit, house_purchase, etc.
  description TEXT,
  reference_id TEXT, -- ID of related stamp, bite, lesson, etc.
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_aura_transactions_user ON aura_transactions(user_id);
CREATE INDEX idx_aura_transactions_type ON aura_transactions(type);
```

## Row Level Security (RLS)

Enable RLS on all tables for security:

```sql
-- Users can only read/update their own data
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Similar policies for other tables
ALTER TABLE visbies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own visby" ON visbies FOR ALL USING (auth.uid() = user_id);

ALTER TABLE stamps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own stamps" ON stamps FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public stamps are viewable" ON stamps FOR SELECT USING (is_public = true);

ALTER TABLE bites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own bites" ON bites FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public bites are viewable" ON bites FOR SELECT USING (is_public = true);

ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own badges" ON user_badges FOR SELECT USING (auth.uid() = user_id);

ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own progress" ON user_lesson_progress FOR ALL USING (auth.uid() = user_id);

ALTER TABLE aura_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own transactions" ON aura_transactions FOR SELECT USING (auth.uid() = user_id);
```

## Storage Buckets

Supabase Storage for user uploads:

```sql
-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('stamps', 'stamps', true),
  ('bites', 'bites', true),
  ('avatars', 'avatars', true);

-- Storage policies
CREATE POLICY "Users can upload stamps" ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'stamps' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload bites" ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'bites' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Public can view images" ON storage.objects FOR SELECT 
  USING (bucket_id IN ('stamps', 'bites', 'avatars'));
```

## Functions & Triggers

### Auto-update stats on stamp collection
```sql
CREATE OR REPLACE FUNCTION update_user_stats_on_stamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users SET 
    stamps_collected = stamps_collected + 1,
    countries_visited = (
      SELECT COUNT(DISTINCT country) FROM stamps WHERE user_id = NEW.user_id
    ),
    cities_visited = (
      SELECT COUNT(DISTINCT city) FROM stamps WHERE user_id = NEW.user_id
    )
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_stamp_insert
  AFTER INSERT ON stamps
  FOR EACH ROW
  EXECUTE FUNCTION update_user_stats_on_stamp();
```

### Level up calculation
```sql
CREATE OR REPLACE FUNCTION calculate_level(aura INTEGER)
RETURNS INTEGER AS $$
BEGIN
  RETURN CASE
    WHEN aura >= 30000 THEN 15
    WHEN aura >= 22000 THEN 14
    WHEN aura >= 15000 THEN 13
    WHEN aura >= 10000 THEN 12
    WHEN aura >= 7000 THEN 11
    WHEN aura >= 5000 THEN 10
    WHEN aura >= 3500 THEN 9
    WHEN aura >= 2500 THEN 8
    WHEN aura >= 1800 THEN 7
    WHEN aura >= 1200 THEN 6
    WHEN aura >= 800 THEN 5
    WHEN aura >= 500 THEN 4
    WHEN aura >= 250 THEN 3
    WHEN aura >= 100 THEN 2
    ELSE 1
  END;
END;
$$ LANGUAGE plpgsql;
```

## Initial Data

See `SEED_DATA.sql` for initial badge definitions, cosmetics, and lesson content.
