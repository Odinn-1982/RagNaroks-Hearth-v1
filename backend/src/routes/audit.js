const express = require("express");
const router = express.Router();
const { pool } = require("../db");
const { requireAuth } = require("../middlewares/auth");

// List audit events (filtering)
router.get("/list", requireAuth, async (req, res) => {
  const { serverId, channelId, pluginId, action, since } = req.query;
  let condition = [];
  let params = [];
  if (serverId) { condition.push("meta->>'serverId'=$" + (params.length + 1)); params.push(String(serverId)); }
  if (channelId) { condition.push("meta->>'channelId'=$" + (params.length + 1)); params.push(String(channelId)); }
  if (pluginId) { condition.push("meta->>'pluginId'=$" + (params.length + 1)); params.push(String(pluginId)); }
  if (action) { condition.push("action=$" + (params.length + 1)); params.push(action); }
  if (since) { condition.push("at >= $" + (params.length + 1)); params.push(new Date(since)); }
  const query =
    "SELECT * FROM audit_log " +
    (condition.length ? "WHERE " + condition.join(" AND ") : "") +
    " ORDER BY id DESC LIMIT 250";
  const logs = await pool.query(query, params);
  res.json(logs.rows);
});

module.exports = router;