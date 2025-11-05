const express = require("express");
const router = express.Router();
const { pool } = require("../db");
const { requireAuth } = require("../middlewares/auth");

router.get("/profile", requireAuth, async (req, res) => {
  const result = await pool.query("SELECT id, username, role, avatar, created_at FROM users WHERE id=$1", [req.user.userId]);
  res.json(result.rows[0]);
});

router.post("/avatar", requireAuth, async (req, res) => {
  const { avatarUrl } = req.body;
  await pool.query("UPDATE users SET avatar=$2 WHERE id=$1", [req.user.userId, avatarUrl]);
  res.json({ success: true });
});

module.exports = router;