const express = require("express");
const router = express.Router();
const { pool } = require("../db");
const { requireAuth } = require("../middlewares/auth");

// Get sheet by userId
router.get("/sheet", requireAuth, async (req, res) => {
  const { userId } = req.query;
  const result = await pool.query("SELECT * FROM foundry_sheets WHERE user_id=$1", [userId]);
  res.json(result.rows[0] || null);
});

// Save sheet
router.post("/sheet", requireAuth, async (req, res) => {
  const { userId, data } = req.body;
  if (!userId) return res.status(400).json({ error: "userId required" });
  await pool.query(
    "INSERT INTO foundry_sheets(user_id, data, updated_at) VALUES($1,$2,NOW()) ON CONFLICT (user_id) DO UPDATE SET data=$2, updated_at=NOW()",
    [userId, data]
  );
  res.json({ success: true });
});

// Items
router.get("/items", requireAuth, async (req, res) => {
  const { channelId } = req.query;
  const result = await pool.query("SELECT * FROM foundry_items WHERE channel_id=$1", [channelId]);
  res.json(result.rows);
});

// Scenes
router.get("/scenes", requireAuth, async (req, res) => {
  const { serverId } = req.query;
  const result = await pool.query("SELECT * FROM foundry_scenes WHERE server_id=$1", [serverId]);
  res.json(result.rows);
});

module.exports = router;