-- Core user/server/channel tables
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  hash TEXT,
  role TEXT DEFAULT 'MEMBER',
  avatar TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS servers (
  id SERIAL PRIMARY KEY,
  name TEXT,
  owner_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS server_members (
  server_id INTEGER REFERENCES servers(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (server_id, user_id)
);

CREATE TABLE IF NOT EXISTS channels (
  id SERIAL PRIMARY KEY,
  server_id INTEGER REFERENCES servers(id) ON DELETE CASCADE,
  name TEXT,
  type TEXT DEFAULT 'text',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bans (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  server_id INTEGER REFERENCES servers(id),
  created_at TIMESTAMP DEFAULT NOW()
);