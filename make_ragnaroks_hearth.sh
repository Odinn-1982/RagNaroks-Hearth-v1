#!/usr/bin/env bash
set -e

ROOT="RagNaroks-Hearth-v1"
ZIPNAME="${ROOT}.zip"

echo "Creating project skeleton in ./${ROOT} ..."

# Remove existing folder if present (be careful)
if [ -d "$ROOT" ]; then
  echo "Removing existing $ROOT"
  rm -rf "$ROOT"
fi

mkdir -p "$ROOT"

# Helper to write files with dirs
write_file() {
  local path="$ROOT/$1"
  mkdir -p "$(dirname "$path")"
  cat > "$path"
  echo "Wrote $path"
}

############################
# Top-level files
############################

write_file "README.md" <<'README'
# RagNaroks-Hearth-v1

Tabletop RPG + Social Platform -- v1 Production System

Features:
- Real-time chat, channels, servers, DMs, notifications.
- GM/Admin dashboard for campaign, quests, scenes, initiative, timers, loot, notes.
- Full RPG sheet/item/scene widgets, file and voice, foundry/game object templates.
- Deep plugin/bot architecture, script support, webhook/event integration.
- Role editor (RBAC), audit log/event feeds, accessibility controls, snapshot/export/restore.
- Cross-platform: Web (React), Mobile (React Native); backend (Node/Express).
- CI/CD workflows; SQL migration ready.

See backend/, web/, mobile/, database/, and .github/workflows/ for code and schemas.
README
README

write_file ".gitignore" <<'GITIGNORE'
node_modules/
.env
dist/
build/
uploads/
.expo/
.vscode/
.DS_Store
GITIGNORE

write_file "CONTRIBUTING.md" <<'CONTRIB'
# Contributing

- Fork repo and open PRs against `main`.
- Follow JS/React linting rules you choose to add.
- Run tests where applicable.
- Describe changes in PR body.
CONTRIB

write_file "LICENSE" <<'MIT'
MIT License

Copyright (c) 2025 Odinn-1982

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

... (Full MIT license text - paste the full license in your repo)
MIT

write_file ".env.example" <<'ENVEX'
# Example env values for local development
DATABASE_URL=postgres://postgres:password@localhost:5432/ragnaroks
JWT_SECRET=replace_with_a_strong_secret
NODE_ENV=development
PORT=4000
ENVEX

############################
# Backend
############################

write_file "backend/package.json" <<'PKGBE'
{
  "name": "ragnaroks-hearth-backend",
  "version": "1.0.0",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "test": "echo \"No backend tests configured\" && exit 0"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "body-parser": "^1.20.2",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.0",
    "multer": "^1.4.5-lts.1",
    "pg": "^8.10.0",
    "node-fetch": "^2.6.12"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}
PKGBE

write_file "backend/src/index.js" <<'BEINDEX'
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

// DB and auth middlewares
const db = require("./db");

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/file", require("./routes/file"));
app.use("/api/foundry", require("./routes/foundry"));
app.use("/api/user", require("./routes/user"));
app.use("/api/server", require("./routes/server"));
app.use("/api/channel", require("./routes/channel"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/plugin", require("./routes/plugin"));
app.use("/api/gm", require("./routes/gm"));
app.use("/api/snapshot", require("./routes/snapshot"));
app.use("/api/webhook", require("./routes/webhook"));
app.use("/api/audit", require("./routes/audit"));
app.use("/api/template", require("./routes/template"));
app.use("/api/objectExt", require("./routes/objectExt"));
app.use("/api/pluginScript", require("./routes/pluginScript"));
app.use("/api/auditExport", require("./routes/auditExport"));

app.listen(port, () => {
  console.log(`RagNaroks Hearth backend listening at http://localhost:${port}`);
});
BEINDEX

write_file "backend/src/db.js" <<'DBJS'
const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgres://postgres:password@localhost:5432/ragnaroks"
});
module.exports = { pool };
DBJS

write_file "backend/src/middlewares/auth.js" <<'AUTH'
const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "devsecret");
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    if (req.user.role !== role && req.user.role !== "OWNER" && req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}

module.exports = { requireAuth, requireRole };
AUTH

# Backend routes (auth, file, foundry, user, server, channel, admin, plugin, gm, snapshot, webhook, audit, template, objectExt, pluginScript, auditExport)
write_file "backend/src/routes/auth.js" <<'AUTHROUTE'
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../db");

function generateToken(user) {
  return jwt.sign({ userId: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET || "devsecret", { expiresIn: "7d" });
}

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  try {
    const existing = await pool.query("SELECT id FROM users WHERE username=$1", [username]);
    if (existing.rows.length) return res.status(400).json({ error: "Username exists" });
    const user = await pool.query(
      "INSERT INTO users(username, hash, role) VALUES($1,$2,'MEMBER') RETURNING id, username, role",
      [username, hash]
    );
    res.json({ user: user.rows[0], token: generateToken(user.rows[0]) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userRes = await pool.query("SELECT * FROM users WHERE username=$1", [username]);
    if (!userRes.rows.length) return res.status(401).json({ error: "Invalid credentials" });
    const user = userRes.rows[0];
    const valid = await bcrypt.compare(password, user.hash);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });
    res.json({ user: { id: user.id, username: user.username, role: user.role }, token: generateToken(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
AUTHROUTE

write_file "backend/src/routes/file.js" <<'FILEROUTE'
const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const upload = multer({ dest: "./uploads/" });

router.post("/upload", upload.single("file"), (req, res) => {
  res.json({ url: `/uploads/${req.file.filename}`, name: req.file.originalname });
});

router.get("/download/:filename", (req, res) => {
  res.sendFile(path.join(__dirname, "../../uploads", req.params.filename));
});

module.exports = router;
FILEROUTE

write_file "backend/src/routes/foundry.js" <<'FOUND'
const express = require("express");
const router = express.Router();
const { pool } = require("../db");
const { requireAuth } = require("../middlewares/auth");

router.get("/sheet", requireAuth, async (req, res) => {
  const { userId } = req.query;
  const result = await pool.query("SELECT * FROM foundry_sheets WHERE user_id=$1", [userId]);
  res.json(result.rows[0] || null);
});
router.post("/sheet", requireAuth, async (req, res) => {
  const { userId, data } = req.body;
  await pool.query(
    "INSERT INTO foundry_sheets(user_id, data) VALUES($1,$2) ON CONFLICT (user_id) DO UPDATE SET data=$2",
    [userId, data]
  );
  res.json({ success: true });
});
router.get("/items", requireAuth, async (req, res) => {
  const { channelId } = req.query;
  const result = await pool.query("SELECT * FROM foundry_items WHERE channel_id=$1", [channelId]);
  res.json(result.rows);
});
router.get("/scenes", requireAuth, async (req, res) => {
  const { serverId } = req.query;
  const result = await pool.query("SELECT * FROM foundry_scenes WHERE server_id=$1", [serverId]);
  res.json(result.rows);
});

module.exports = router;
FOUND

write_file "backend/src/routes/user.js" <<'USER'
const express = require("express");
const router = express.Router();
const { pool } = require("../db");
const { requireAuth } = require("../middlewares/auth");

router.get("/profile", requireAuth, async (req, res) => {
  const result = await pool.query("SELECT id, username, role, avatar FROM users WHERE id=$1", [req.user.userId]);
  res.json(result.rows[0]);
});
router.post("/avatar", requireAuth, async (req, res) => {
  await pool.query("UPDATE users SET avatar=$2 WHERE id=$1", [req.user.userId, req.body.avatarUrl]);
  res.json({ success: true });
});

module.exports = router;
USER

write_file "backend/src/routes/server.js" <<'SERVER'
const express = require("express");
const router = express.Router();
const { pool } = require("../db");
const { requireAuth } = require("../middlewares/auth");

router.post("/create", requireAuth, async (req, res) => {
  const { name } = req.body;
  const srv = await pool.query("INSERT INTO servers(name, owner_id) VALUES($1, $2) RETURNING id, name", [name, req.user.userId]);
  await pool.query("INSERT INTO server_members(server_id, user_id) VALUES ($1, $2)", [srv.rows[0].id, req.user.userId]);
  res.json(srv.rows[0]);
});
router.post("/join", requireAuth, async (req, res) => {
  await pool.query("INSERT INTO server_members(server_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", [req.body.serverId, req.user.userId]);
  res.json({ success: true });
});
router.post("/leave", requireAuth, async (req, res) => {
  await pool.query("DELETE FROM server_members WHERE server_id=$1 AND user_id=$2", [req.body.serverId, req.user.userId]);
  res.json({ success: true });
});

module.exports = router;
SERVER

write_file "backend/src/routes/channel.js" <<'CHANNEL'
const express = require("express");
const router = express.Router();
const { pool } = require("../db");
const { requireAuth } = require("../middlewares/auth");

router.post("/create", requireAuth, async (req, res) => {
  const { serverId, name, type } = req.body;
  const ch = await pool.query("INSERT INTO channels(server_id, name, type) VALUES($1,$2,$3) RETURNING id, name, type", [serverId, name, type]);
  res.json(ch.rows[0]);
});
router.get("/list", requireAuth, async (req, res) => {
  const { serverId } = req.query;
  const result = await pool.query("SELECT * FROM channels WHERE server_id=$1", [serverId]);
  res.json(result.rows);
});

module.exports = router;
CHANNEL

write_file "backend/src/routes/admin.js" <<'ADMIN'
const express = require("express");
const router = express.Router();
const { pool } = require("../db");
const { requireAuth, requireRole } = require("../middlewares/auth");

router.get("/users", requireAuth, requireRole("ADMIN"), async (req, res) => {
  const { serverId } = req.query;
  const result = await pool.query("SELECT u.id, u.username, u.role FROM users u JOIN server_members sm ON sm.user_id=u.id WHERE sm.server_id=$1", [serverId]);
  res.json(result.rows);
});
router.post("/role", requireAuth, requireRole("ADMIN"), async (req, res) => {
  await pool.query("UPDATE users SET role=$2 WHERE id=$1", [req.body.userId, req.body.role]);
  res.json({ success: true });
});
router.post("/ban", requireAuth, requireRole("ADMIN"), async (req, res) => {
  await pool.query("INSERT INTO bans(user_id, server_id) VALUES($1,$2)", [req.body.userId, req.body.serverId]);
  res.json({ success: true });
});

module.exports = router;
ADMIN

write_file "backend/src/routes/plugin.js" <<'PLUGIN'
const express = require("express");
const router = express.Router();
const { pool } = require("../db");
const { requireAuth } = require("../middlewares/auth");

router.post("/install", requireAuth, async (req, res) => {
  const { pluginName, sourceUrl } = req.body;
  await pool.query("INSERT INTO plugins(name, source, enabled) VALUES($1,$2,TRUE) ON CONFLICT (name) DO UPDATE SET source=$2, enabled=TRUE", [pluginName, sourceUrl]);
 