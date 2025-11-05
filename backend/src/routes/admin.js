const express = require("express");
const router = express.Router();
const { pool } = require("../db");
const { requireAuth, requireRole } = require("../middlewares/auth");

// list users in server (admin-only)
router.get("/users", requireAuth, requireRole("ADMIN"), async (req, res) => {
  const { serverId } = req.query;
  const result = await pool.query("SELECT u.id, u.username, u.role FROM users u JOIN server_members sm ON sm.user_id=u.id WHERE sm.server_id=$1", [serverId]);
  res.json(result.rows);
});

router.post("/role", requireAuth, requireRole("ADMIN"), async (req, res) => {
  const { userId, role } = req.body;
  await pool.query("UPDATE users SET role=$2 WHERE id=$1", [userId, role]);
  res.json({ success: true });
});

router.post("/ban", requireAuth, requireRole("ADMIN"), async (req, res) => {
  const { userId, serverId } = req.body;
  await pool.query("INSERT INTO bans(user_id, server_id) VALUES($1,$2) ON CONFLICT DO NOTHING", [userId, serverId]);
  res.json({ success: true });
});

module.exports = router;