-- Add category and learning_points to locations for "Stops to Visit" in country rooms
ALTER TABLE locations
  ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'landmark',
  ADD COLUMN IF NOT EXISTS learning_points INTEGER DEFAULT 10;

COMMENT ON COLUMN locations.category IS 'landmark | food | nature | culture | hidden_gem';
COMMENT ON COLUMN locations.learning_points IS 'Aura awarded when user visits this stop in a country room';
