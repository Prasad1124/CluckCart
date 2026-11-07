
const express = require("express");

module.exports = (readDB, writeDB) => {
  const router = express.Router();

  // REGISTER
  router.post("/register", (req, res) => {
    try {
      const { name, mobile, password } = req.body || {};

      if (!name || !mobile || !password) {
        return res.status(400).json({
          success: false,
          message: "Please fill all required fields."
        });
      }

      if (!/^[6-9]\d{9}$/.test(String(mobile))) {
        return res.status(400).json({
          success: false,
          message: "Invalid mobile number."
        });
      }

      if (String(password).length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must contain at least 6 characters."
        });
      }

      const db = readDB();

      if (!Array.isArray(db.users)) {
        db.users = [];
      }

      const existingUser = db.users.find(
        user => String(user.mobile) === String(mobile)
      );

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "This mobile number is already registered. Please login."
        });
      }

      db.users.push({
        name: String(name).trim(),
        mobile: String(mobile),
        password: String(password),
        role: "user"
      });

      writeDB(db);

      return res.status(201).json({
        success: true,
        message: "Registration successful."
      });

    } catch (error) {
      console.error("Registration error:", error);

      return res.status(500).json({
        success: false,
        message: "Server error during registration."
      });
    }
  });

  // LOGIN
  router.post("/login", (req, res) => {
    try {
      const { mobile, password } = req.body || {};
      const db = readDB();

      const users = Array.isArray(db.users) ? db.users : [];

      const user = users.find(
        u =>
          String(u.mobile) === String(mobile) &&
          u.password === password
      );

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid mobile number or password."
        });
      }

      return res.json({
        success: true,
        user
      });

    } catch (error) {
      console.error("Login error:", error);

      return res.status(500).json({
        success: false,
        message: "Server error during login."
      });
    }
  });

  return router;
};
