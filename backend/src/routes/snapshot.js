const express = require("express");
const router = express.Router();
const { pool } = require("../db");
const { requireAuth } = require("../middlewares/auth");

// Export snapshot
router.get("/export", requireAuth, async (req, res) => {
  const { serverId } = req.query;
  const users = await pool.query("SELECT id, username, role FROM users WHERE id IN (SELECT user_id FROM server_members WHERE server_id=$1)", [serverId]);
  const chars = await pool.query("SELECT * FROM foundry_sheets WHERE user_id IN (SELECT user_id FROM server_members WHERE server_id=$1)", [serverId]);
  const scenes = await pool.query("SELECT * FROM foundry_scenes WHERE server_id=$1", [serverId]);
  const items = await pool.query("SELECT * FROM foundry_items WHERE server_id=$1", [serverId]);
  const quests = await pool.query("SELECT * FROM quests WHERE server_id=$1", [serverId]);
  const initiative = await pool.query("SELECT * FROM initiatives WHERE server_id=$1", [serverId]);
  const timers = await pool.query("SELECT * FROM timers WHERE active=TRUE", []);
  const notes = await pool.query("SELECT notes FROM gm_notes WHERE server_id=$1", [serverId]);
  res.json({
    users: users.rows,
    characters: chars.rows,
    scenes: scenes.rows,
    items: items.rows,
    quests: quests.rows,
    initiative: initiative.rows,
    timers: timers.rows,
    notes: notes.rows
  });
});

// Import snapshot (basic)
router.post("/import", requireAuth, async (req, res) => {
  const { serverId, snapshot } = req.body;
  for (const c of snapshot.characters || []) {
    await pool.query("INSERT INTO foundry_sheets(user_id, data) VALUES($1,$2) ON CONFLICT (user_id) DO UPDATE SET data=$2", [c.user_id, c.data]);
  }
  for (const s of snapshot.scenes || []) {
    await pool.query("INSERT INTO foundry_scenes(server_id, scene_id, img_url, data, created_at) VALUES($1,$2,$3,$4,NOW()) ON CONFLICT (scene_id) DO UPDATE SET img_url=$3, data=$4", [serverId, s.scene_id, s.img_url, s.data]);
  }
  res.json({ success: true });
});

module.exports = router;