module.exports = (readDB, writeDB) => {
  const router = require("express").Router();

  router.post("/register", (req, res) => {
    const { name, mobile, password } = req.body;
    const db = readDB();

    if (db.users.find(u => u.mobile === mobile))
      return res.status(400).json({ message: "User exists" });

    db.users.push({ name, mobile, password, role: "user" });
    writeDB(db);
    res.json({ success: true });
  });

  router.post("/login", (req, res) => {
    const { mobile, password } = req.body;
    const db = readDB();

    const user = db.users.find(
      u => u.mobile === mobile && u.password === password
    );

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    res.json(user);
  });

  return router;
};
