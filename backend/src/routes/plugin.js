const express = require("express");
const router = express.Router();
const { pool } = require("../db");
const { requireAuth } = require("../middlewares/auth");

// Install plugin
router.post("/install", requireAuth, async (req, res) => {
  const { pluginName, sourceUrl } = req.body;
  await pool.query(
    "INSERT INTO plugins(name, source, enabled) VALUES($1,$2,TRUE) ON CONFLICT (name) DO UPDATE SET source=$2, enabled=TRUE",
    [pluginName, sourceUrl]
  );
  res.json({ success: true });
});

// List plugins
router.get("/list", requireAuth, async (req, res) => {
  const result = await pool.query("SELECT * FROM plugins ORDER BY id");
  res.json(result.rows);
});

// Enable / disable / remove
router.post("/enable", requireAuth, async (req, res) => {
  await pool.query("UPDATE plugins SET enabled=TRUE WHERE id=$1", [req.body.pluginId]);
  res.json({ success: true });
});
router.post("/disable", requireAuth, async (req, res) => {
  await pool.query("UPDATE plugins SET enabled=FALSE WHERE id=$1", [req.body.pluginId]);
  res.json({ success: true });
});
router.post("/remove", requireAuth, async (req, res) => {
  await pool.query("DELETE FROM plugins WHERE id=$1", [req.body.pluginId]);
  res.json({ success: true });
});

module.exports = router;