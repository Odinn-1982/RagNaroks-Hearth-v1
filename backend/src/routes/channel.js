const express = require("express");
const router = express.Router();
const { pool } = require("../db");
const { requireAuth } = require("../middlewares/auth");

// create channel
router.post("/create", requireAuth, async (req, res) => {
  const { serverId, name, type } = req.body;
  const ch = await pool.query("INSERT INTO channels(server_id, name, type) VALUES($1,$2,$3) RETURNING id, name, type", [serverId, name, type || 'text']);
  res.json(ch.rows[0]);
});

// list channels for server
router.get("/list", requireAuth, async (req, res) => {
  const { serverId } = req.query;
  const result = await pool.query("SELECT * FROM channels WHERE server_id=$1 ORDER BY id", [serverId]);
  res.json(result.rows);
});

module.exports = router;