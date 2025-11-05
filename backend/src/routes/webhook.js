const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const { pool } = require("../db");
const { requireAuth } = require("../middlewares/auth");

// Register webhook
router.post("/register", requireAuth, async (req, res) => {
  const { pluginId, eventType, webhookUrl, meta } = req.body;
  await pool.query("INSERT INTO plugin_events(plugin_id, event_type, webhook_url, meta, created_at) VALUES($1,$2,$3,$4,NOW())", [pluginId, eventType, webhookUrl, meta || {}]);
  res.json({ success: true });
});

// List webhooks for plugin
router.get("/list", requireAuth, async (req, res) => {
  const { pluginId } = req.query;
  const result = await pool.query("SELECT * FROM plugin_events WHERE plugin_id=$1 ORDER BY id", [pluginId]);
  res.json(result.rows);
});

// Test webhook/event delivery
router.post("/test", requireAuth, async (req, res) => {
  const { eventId, testPayload } = req.body;
  const event = await pool.query("SELECT * FROM plugin_events WHERE id=$1", [eventId]);
  if (!event.rows.length) return res.status(404).json({ error: "Event not found" });
  const url = event.rows[0].webhook_url;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testPayload || { test: true })
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

module.exports = router;