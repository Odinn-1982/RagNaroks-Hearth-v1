CREATE TABLE IF NOT EXISTS plugins (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  source TEXT,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  installed_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS plugin_events (
  id SERIAL PRIMARY KEY,
  plugin_id INTEGER REFERENCES plugins(id) ON DELETE CASCADE,
  event_type TEXT,
  webhook_url TEXT,
  meta JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);