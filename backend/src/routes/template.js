const express = require("express");
const router = express.Router();
const { pool } = require("../db");
const { requireAuth } = require("../middlewares/auth");

// list templates
router.get("/list", requireAuth, async (req, res) => {
  const { serverId, type } = req.query;
  const templates = await pool.query("SELECT * FROM templates WHERE server_id=$1 AND type=$2 ORDER BY id", [serverId, type]);
  res.json(templates.rows);
});

// save or update
router.post("/save", requireAuth, async (req, res) => {
  const { serverId, type, name, fields, templateId } = req.body;
  if (templateId) {
    await pool.query("UPDATE templates SET name=$1, fields=$2 WHERE id=$3", [name, fields, templateId]);
  } else {
    await pool.query("INSERT INTO templates(server_id, type, name, fields) VALUES($1,$2,$3,$4)", [serverId, type, name, fields]);
  }
  res.json({ success: true });
});

router.post("/delete", requireAuth, async (req, res) => {
  await pool.query("DELETE FROM templates WHERE id=$1", [req.body.templateId]);
  res.json({ success: true });
});

module.exports = router;