const express = require("express");
const router = express.Router();
const { pool } = require("../db");
const { requireAuth } = require("../middlewares/auth");

// create server (guild)
router.post("/create", requireAuth, async (req, res) => {
  const { name } = req.body;
  const srv = await pool.query("INSERT INTO servers(name, owner_id) VALUES($1, $2) RETURNING id, name", [name, req.user.userId]);
  await pool.query("INSERT INTO server_members(server_id, user_id) VALUES ($1, $2)", [srv.rows[0].id, req.user.userId]);
  res.json(srv.rows[0]);
});

router.post("/join", requireAuth, async (req, res) => {
  const { serverId } = req.body;
  await pool.query("INSERT INTO server_members(server_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", [serverId, req.user.userId]);
  res.json({ success: true });
});

router.post("/leave", requireAuth, async (req, res) => {
  const { serverId } = req.body;
  await pool.query("DELETE FROM server_members WHERE server_id=$1 AND user_id=$2", [serverId, req.user.userId]);
  res.json({ success: true });
});

module.exports = router;