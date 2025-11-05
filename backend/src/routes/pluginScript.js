const express = require("express");
const router = express.Router();
const { pool } = require("../db");
const { requireAuth } = require("../middlewares/auth");

// list scripts
router.get("/scripts", requireAuth, async (req, res) => {
  const { pluginId } = req.query;
  const result = await pool.query("SELECT * FROM scripts WHERE plugin_id=$1", [pluginId]);
  res.json(result.rows);
});

// install script
router.post("/installScript", requireAuth, async (req, res) => {
  const { pluginId, script } = req.body;
  await pool.query("INSERT INTO scripts(plugin_id, code, enabled) VALUES($1,$2,TRUE)", [pluginId, script]);
  res.json({ success: true });
});

// disable script
router.post("/disableScript", requireAuth, async (req, res) => {
  await pool.query("UPDATE scripts SET enabled=FALSE WHERE id=$1", [req.body.scriptId]);
  res.json({ success: true });
});

// restart script (enable)
router.post("/restartScript", requireAuth, async (req, res) => {
  await pool.query("UPDATE scripts SET enabled=TRUE WHERE id=$1", [req.body.scriptId]);
  await pool.query("INSERT INTO script_logs(script_id, text, created_at) VALUES($1,$2,NOW())", [req.body.scriptId, "Script restarted"]);
  res.json({ success: true });
});

// logs
router.get("/scriptLogs", requireAuth, async (req, res) => {
  const { pluginId } = req.query;
  const result = await pool.query("SELECT l.text,l.created_at FROM script_logs l JOIN scripts s ON s.id=l.script_id WHERE s.plugin_id=$1 ORDER BY l.created_at DESC", [pluginId]);
  res.json(result.rows);
});

module.exports = router;