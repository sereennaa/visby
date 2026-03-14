-- ============================================================================
-- Visby Content Tables Migration
-- ============================================================================

-- Countries
CREATE TABLE countries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  country_code TEXT NOT NULL UNIQUE,
  flag_emoji TEXT DEFAULT '',
  visit_cost_aura INTEGER DEFAULT 500,
  house_price_aura INTEGER DEFAULT 2000,
  description TEXT DEFAULT '',
  room_theme TEXT DEFAULT 'traditional',
  accent_color TEXT DEFAULT '#FFD700',
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Country facts
CREATE TABLE country_facts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  country_id TEXT REFERENCES countries(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  icon TEXT DEFAULT 'info',
  category TEXT DEFAULT 'culture',
  sort_order INTEGER DEFAULT 0
);

-- Rooms
CREATE TABLE rooms (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  country_id TEXT REFERENCES countries(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT DEFAULT 'home',
  wall_color TEXT DEFAULT '#FFFFFF',
  floor_color TEXT DEFAULT '#D4C5A0',
  sort_order INTEGER DEFAULT 0
);

-- Room objects
CREATE TABLE room_objects (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  room_id TEXT REFERENCES rooms(id) ON DELETE CASCADE,
  icon TEXT DEFAULT 'star',
  label TEXT NOT NULL,
  x REAL DEFAULT 50,
  y REAL DEFAULT 50,
  interactive BOOLEAN DEFAULT FALSE,
  learn_title TEXT,
  learn_content TEXT,
  aura_reward INTEGER DEFAULT 0
);

-- Quiz questions
CREATE TABLE quiz_questions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  question TEXT NOT NULL,
  options JSONB NOT NULL DEFAULT '[]',
  correct_index INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'geography',
  country_id TEXT REFERENCES countries(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Flashcards
CREATE TABLE flashcards (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  icon TEXT DEFAULT 'book',
  deck TEXT NOT NULL DEFAULT 'general',
  country_id TEXT REFERENCES countries(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lessons
CREATE TABLE lessons (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'culture',
  country_id TEXT REFERENCES countries(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lesson slides
CREATE TABLE lesson_slides (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  lesson_id TEXT REFERENCES lessons(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  icon TEXT DEFAULT 'book',
  image_url TEXT,
  sort_order INTEGER DEFAULT 0
);

-- Locations (map pins)
CREATE TABLE locations (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'landmark',
  description TEXT DEFAULT '',
  distance_km REAL DEFAULT 0,
  latitude REAL,
  longitude REAL,
  country_id TEXT REFERENCES countries(id) ON DELETE SET NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cosmetics
CREATE TABLE cosmetics (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  type TEXT NOT NULL,
  rarity TEXT DEFAULT 'common',
  price INTEGER DEFAULT 0,
  country TEXT,
  icon TEXT DEFAULT 'star',
  members_only BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Badges
CREATE TABLE badges (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT DEFAULT 'explorer',
  icon TEXT DEFAULT 'star',
  color TEXT DEFAULT '#FFD700',
  rarity TEXT DEFAULT 'common',
  requirement_type TEXT DEFAULT 'special',
  requirement_target INTEGER DEFAULT 1,
  requirement_description TEXT DEFAULT '',
  aura_reward INTEGER DEFAULT 50,
  is_secret BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Furniture items (for room decoration)
CREATE TABLE furniture (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  icon TEXT DEFAULT 'home',
  image_url TEXT,
  category TEXT DEFAULT 'furniture',
  country_origin TEXT,
  price INTEGER DEFAULT 100,
  width INTEGER DEFAULT 1,
  height INTEGER DEFAULT 1,
  rarity TEXT DEFAULT 'common',
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================================
-- Row Level Security
-- ============================================================================

ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON countries FOR SELECT USING (true);
CREATE POLICY "Admin write" ON countries FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

ALTER TABLE country_facts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON country_facts FOR SELECT USING (true);
CREATE POLICY "Admin write" ON country_facts FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON rooms FOR SELECT USING (true);
CREATE POLICY "Admin write" ON rooms FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

ALTER TABLE room_objects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON room_objects FOR SELECT USING (true);
CREATE POLICY "Admin write" ON room_objects FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON quiz_questions FOR SELECT USING (true);
CREATE POLICY "Admin write" ON quiz_questions FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON flashcards FOR SELECT USING (true);
CREATE POLICY "Admin write" ON flashcards FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON lessons FOR SELECT USING (true);
CREATE POLICY "Admin write" ON lessons FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

ALTER TABLE lesson_slides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON lesson_slides FOR SELECT USING (true);
CREATE POLICY "Admin write" ON lesson_slides FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON locations FOR SELECT USING (true);
CREATE POLICY "Admin write" ON locations FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

ALTER TABLE cosmetics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON cosmetics FOR SELECT USING (true);
CREATE POLICY "Admin write" ON cosmetics FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON badges FOR SELECT USING (true);
CREATE POLICY "Admin write" ON badges FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

ALTER TABLE furniture ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON furniture FOR SELECT USING (true);
CREATE POLICY "Admin write" ON furniture FOR ALL USING (auth.jwt() ->> 'role' = 'admin');


-- ============================================================================
-- Indexes on foreign keys
-- ============================================================================

CREATE INDEX idx_country_facts_country_id ON country_facts(country_id);
CREATE INDEX idx_rooms_country_id ON rooms(country_id);
CREATE INDEX idx_room_objects_room_id ON room_objects(room_id);
CREATE INDEX idx_quiz_questions_country_id ON quiz_questions(country_id);
CREATE INDEX idx_quiz_questions_category ON quiz_questions(category);
CREATE INDEX idx_flashcards_country_id ON flashcards(country_id);
CREATE INDEX idx_flashcards_deck ON flashcards(deck);
CREATE INDEX idx_lessons_country_id ON lessons(country_id);
CREATE INDEX idx_lesson_slides_lesson_id ON lesson_slides(lesson_id);
CREATE INDEX idx_locations_country_id ON locations(country_id);
CREATE INDEX idx_cosmetics_type ON cosmetics(type);
CREATE INDEX idx_badges_category ON badges(category);
CREATE INDEX idx_furniture_category ON furniture(category);
