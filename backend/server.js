const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const DB = path.join(__dirname, "db.json");

function readDB() {
  return JSON.parse(fs.readFileSync(DB, "utf8"));
}
function writeDB(data) {
  fs.writeFileSync(DB, JSON.stringify(data, null, 2));
}

app.use("/api/auth", require("./routes/auth")(readDB, writeDB));
app.use("/api/ads", require("./routes/ads")(readDB, writeDB));
app.use("/api/otp", require("./routes/otp")(readDB, writeDB));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ CluckCart backend running on port ${PORT}`);
});
