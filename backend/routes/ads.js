const express = require("express");

module.exports = (readDB, writeDB) => {
  const router = express.Router();

  // GET ALL ADS (ADMIN)
  router.get("/", (req, res) => {
    const db = readDB();
    res.json(db.ads);
  });

  // CREATE AD (USER)
  router.post("/", (req, res) => {
    const db = readDB();
    const ad = {
      ...req.body,
      id: Date.now(),
      status: "pending"
    };

    db.ads.push(ad);
    writeDB(db);
    res.json({ success: true });
  });

  // APPROVE AD (ADMIN)
  router.put("/approve/:id", (req, res) => {
    const db = readDB();
    const ad = db.ads.find(a => a.id == req.params.id);

    if (!ad) {
      return res.status(404).json({ success: false });
    }

    ad.status = "approved";
    writeDB(db);
    res.json({ success: true });
  });

  // DELETE AD (ADMIN)
  router.delete("/:id", (req, res) => {
    const db = readDB();
    db.ads = db.ads.filter(a => a.id != req.params.id);
    writeDB(db);
    res.json({ success: true });
  });

  return router;
};
