const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../db");

function generateToken(user) {
  return jwt.sign({ userId: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET || "devsecret", { expiresIn: "7d" });
}

// Register
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "username & password required" });
  const hash = await bcrypt.hash(password, 10);
  try {
    const existing = await pool.query("SELECT id FROM users WHERE username=$1", [username]);
    if (existing.rows.length) return res.status(400).json({ error: "Username exists" });
    const user = await pool.query(
      "INSERT INTO users(username, hash, role) VALUES($1,$2,'MEMBER') RETURNING id, username, role",
      [username, hash]
    );
    res.json({ user: user.rows[0], token: generateToken(user.rows[0]) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "username & password required" });
  try {
    const userRes = await pool.query("SELECT * FROM users WHERE username=$1", [username]);
    if (!userRes.rows.length) return res.status(401).json({ error: "Invalid credentials" });
    const user = userRes.rows[0];
    const valid = await bcrypt.compare(password, user.hash);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });
    res.json({ user: { id: user.id, username: user.username, role: user.role }, token: generateToken(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;