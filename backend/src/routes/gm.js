const express = require("express");
const router = express.Router();
const { pool } = require("../db");
const { requireAuth } = require("../middlewares/auth");

// Quests
router.get("/quests", requireAuth, async (req, res) => {
  const { serverId } = req.query;
  const quests = await pool.query("SELECT * FROM quests WHERE server_id=$1 ORDER BY id", [serverId]);
  res.json(quests.rows);
});
router.post("/quest", requireAuth, async (req, res) => {
  const { serverId, title } = req.body;
  const q = await pool.query("INSERT INTO quests(server_id, title, status) VALUES($1,$2,'pending') RETURNING id", [serverId, title]);
  res.json({ id: q.rows[0].id, success: true });
});
router.post("/quest/status", requireAuth, async (req, res) => {
  const { questId, status } = req.body;
  await pool.query("UPDATE quests SET status=$1 WHERE id=$2", [status, questId]);
  res.json({ success: true });
});

// Initiative
router.get("/initiative", requireAuth, async (req, res) => {
  const { serverId } = req.query;
  const order = await pool.query("SELECT * FROM initiatives WHERE server_id=$1 ORDER BY idx", [serverId]);
  res.json(order.rows);
});
router.post("/initiative/set", requireAuth, async (req, res) => {
  const { serverId, order } = req.body;
  await pool.query("DELETE FROM initiatives WHERE server_id=$1", [serverId]);
  for (let i = 0; i < order.length; i++) {
    await pool.query("INSERT INTO initiatives(server_id, char_id, idx) VALUES($1,$2,$3)", [serverId, order[i], i]);
  }
  res.json({ success: true });
});

// Timers
router.get("/timers", requireAuth, async (req, res) => {
  const timers = await pool.query("SELECT * FROM timers WHERE active=TRUE ORDER BY started_at DESC");
  res.json(timers.rows);
});
router.post("/timer", requireAuth, async (req, res) => {
  const { label, duration } = req.body;
  await pool.query("INSERT INTO timers(label, duration, started_at, active) VALUES($1,$2,NOW(),TRUE)", [label, duration]);
  res.json({ success: true });
});
router.post("/timer/clear", requireAuth, async (req, res) => {
  const { timerId } = req.body;
  await pool.query("UPDATE timers SET active=FALSE WHERE id=$1", [timerId]);
  res.json({ success: true });
});

// GM notes
router.get("/notes", requireAuth, async (req, res) => {
  const { serverId } = req.query;
  const notes = await pool.query("SELECT notes FROM gm_notes WHERE server_id=$1", [serverId]);
  res.json({ notes: notes.rows[0]?.notes || "" });
});
router.post("/notes", requireAuth, async (req, res) => {
  const { serverId, notes } = req.body;
  await pool.query("INSERT INTO gm_notes(server_id, notes) VALUES($1,$2) ON CONFLICT (server_id) DO UPDATE SET notes=$2", [serverId, notes]);
  res.json({ success: true });
});

module.exports = router;