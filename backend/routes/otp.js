module.exports = (readDB, writeDB) => {
  const express = require("express");
  const router = express.Router();

  // SEND OTP (DEMO MODE)
  router.post("/send", (req, res) => {
    const { mobile } = req.body;

    if (!mobile || !/^\d{10}$/.test(mobile)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mobile number"
      });
    }

    const otp = Math.floor(1000 + Math.random() * 9000);
    const db = readDB();

    db.otps = db.otps.filter(o => o.mobile !== mobile);

    db.otps.push({
      mobile,
      otp,
      time: Date.now()
    });

    writeDB(db);

    // 👇 IMPORTANT: OTP shown in logs (demo)
    console.log(`📩 DEMO OTP for ${mobile}: ${otp}`);

    res.json({
      success: true,
      message: "OTP generated (demo mode)"
    });
  });

  // VERIFY OTP
  router.post("/verify", (req, res) => {
    const { mobile, otp } = req.body;
    const db = readDB();

    const record = db.otps.find(
      o => o.mobile === mobile && String(o.otp) === String(otp)
    );

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    // OTP valid for 5 minutes
    if (Date.now() - record.time > 5 * 60 * 1000) {
      return res.status(400).json({
        success: false,
        message: "OTP expired"
      });
    }

    res.json({
      success: true,
      message: "OTP verified"
    });
  });

  return router;
};
