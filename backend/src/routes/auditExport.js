const express = require("express");
const router = express.Router();
const { pool } = require("../db");
const { requireAuth } = require("../middlewares/auth");

// export audit log subset as JSON file response
router.get("/export", requireAuth, async (req, res) => {
  const { serverId, start, end, type, userId } = req.query;
  let conditions = ["meta->>'serverId'=$1"];
  let params = [serverId];
  if (start) { params.push(new Date(start)); conditions.push("at >= $" + params.length); }
  if (end) { params.push(new Date(end)); conditions.push("at <= $" + params.length); }
  if (type) { params.push(type); conditions.push("action=$" + params.length); }
  if (userId) { params.push(userId); conditions.push("user_id=$" + params.length); }
  const queryStr = "SELECT * FROM audit_log WHERE " + conditions.join(" AND ") + " ORDER BY id";
  const auditRows = await pool.query(queryStr, params);
  res.setHeader("Content-disposition", `attachment; filename=audit-export-server-${serverId}.json`);
  res.setHeader("Content-type", "application/json");
  res.send(JSON.stringify(auditRows.rows, null, 2));
});

module.exports = router;