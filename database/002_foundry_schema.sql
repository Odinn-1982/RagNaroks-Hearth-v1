-- Foundry/Sheet/Item/Scene storage
CREATE TABLE IF NOT EXISTS foundry_sheets (
  user_id INTEGER REFERENCES users(id) PRIMARY KEY,
  data JSONB,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS foundry_items (
  id SERIAL PRIMARY KEY,
  server_id INTEGER REFERENCES servers(id) ON DELETE CASCADE,
  channel_id INTEGER REFERENCES channels(id),
  data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS foundry_scenes (
  id SERIAL PRIMARY KEY,
  server_id INTEGER REFERENCES servers(id) ON DELETE CASCADE,
  scene_id INTEGER,
  img_url TEXT,
  data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);