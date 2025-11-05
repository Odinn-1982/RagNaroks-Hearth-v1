const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const { pool } = require("../db");
const { requireAuth } = require("../middlewares/auth");

// inherit base template
router.post("/inherit", requireAuth, async (req, res) => {
  const { serverId, baseId, name, fields } = req.body;
  const baseRow = await pool.query("SELECT * FROM templates WHERE id=$1", [baseId]);
  if (!baseRow.rows.length) return res.status(404).json({ error: "Base template not found" });
  const newFields = Object.assign({}, baseRow.rows[0].fields || {}, fields || {});
  await pool.query("INSERT INTO templates(server_id, type, name, fields) VALUES($1,$2,$3,$4)", [serverId, baseRow.rows[0].type, name, newFields]);
  res.json({ success: true });
});

// import from external URL (JSON template)
router.post("/import", requireAuth, async (req, res) => {
  const { serverId, type, name, externalUrl } = req.body;
  try {
    const result = await fetch(externalUrl).then(r => r.json());
    await pool.query("INSERT INTO templates(server_id, type, name, fields) VALUES($1,$2,$3,$4)", [serverId, type, name, result]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Import failed" });
  }
});

module.exports = router;