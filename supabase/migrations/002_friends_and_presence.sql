-- ============================================================================
-- Friends (Club Penguin–style) and presence/chat for live places
-- ============================================================================

-- Friend requests: send and accept flow
CREATE TABLE IF NOT EXISTS friend_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  to_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(from_user_id, to_user_id)
);

CREATE INDEX IF NOT EXISTS idx_friend_requests_to ON friend_requests(to_user_id);
CREATE INDEX IF NOT EXISTS idx_friend_requests_from ON friend_requests(from_user_id);

-- Friends: symmetric relationship after accept (or use friend_requests where status = 'accepted')
CREATE TABLE IF NOT EXISTS friends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  friend_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, friend_user_id),
  CHECK (user_id != friend_user_id)
);

CREATE INDEX IF NOT EXISTS idx_friends_user ON friends(user_id);
CREATE INDEX IF NOT EXISTS idx_friends_friend ON friends(friend_user_id);

-- Presence: where each user is right now (for "who's here" and same-place chat)
CREATE TABLE IF NOT EXISTS presence (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  place_type TEXT NOT NULL CHECK (place_type IN ('home', 'country_room', 'place_street')),
  country_id TEXT,
  pin_id TEXT,
  room_id TEXT,
  label TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Place chat messages (Club Penguin style: messages in a place channel)
CREATE TABLE IF NOT EXISTS place_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel TEXT NOT NULL,  -- e.g. 'country_room:jp' or 'place_street:fr:fr_paris'
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_place_chat_channel ON place_chat_messages(channel, created_at);

-- RLS
ALTER TABLE friend_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE friends ENABLE ROW LEVEL SECURITY;
ALTER TABLE presence ENABLE ROW LEVEL SECURITY;
ALTER TABLE place_chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own friend requests" ON friend_requests FOR ALL
  USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY "Users can manage own friends" ON friends FOR ALL
  USING (auth.uid() = user_id OR auth.uid() = friend_user_id);

CREATE POLICY "Users can update own presence" ON presence FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone in app can read presence" ON presence FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own chat messages" ON place_chat_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can read place chat" ON place_chat_messages FOR SELECT
  USING (true);
