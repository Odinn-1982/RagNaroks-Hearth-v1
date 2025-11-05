const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const upload = multer({ dest: "./uploads/" });

// upload a file; returns URL path under /uploads
router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  res.json({ url: `/uploads/${req.file.filename}`, name: req.file.originalname, size: req.file.size });
});

// download
router.get("/download/:filename", (req, res) => {
  const filePath = path.join(__dirname, "../../uploads", req.params.filename);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: "Not found" });
  res.sendFile(filePath);
});

module.exports = router;