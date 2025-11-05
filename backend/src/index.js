const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

// DB and auth middlewares loaded inside routes as needed

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/file", require("./routes/file"));
app.use("/api/foundry", require("./routes/foundry"));
app.use("/api/user", require("./routes/user"));
app.use("/api/server", require("./routes/server"));
app.use("/api/channel", require("./routes/channel"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/plugin", require("./routes/plugin"));
app.use("/api/gm", require("./routes/gm"));
app.use("/api/snapshot", require("./routes/snapshot"));
app.use("/api/webhook", require("./routes/webhook"));
app.use("/api/audit", require("./routes/audit"));
app.use("/api/template", require("./routes/template"));
app.use("/api/objectExt", require("./routes/objectExt"));
app.use("/api/pluginScript", require("./routes/pluginScript"));
app.use("/api/auditExport", require("./routes/auditExport"));

app.get("/", (req, res) => res.json({ version: "RagNaroks-Hearth-v1", status: "ok" }));

app.listen(port, () => {
  console.log(`RagNaroks Hearth backend listening at http://localhost:${port}`);
});