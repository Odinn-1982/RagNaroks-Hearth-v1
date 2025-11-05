CREATE TABLE IF NOT EXISTS templates (
  id SERIAL PRIMARY KEY,
  server_id INTEGER REFERENCES servers(id) ON DELETE CASCADE,
  type TEXT,
  name TEXT,
  fields JSONB
);