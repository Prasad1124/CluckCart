const express = require("express");
const axios = require("axios");

module.exports = (readDB, writeDB) => {
  const router = express.Router();

  // ================= SEND OTP (DLT MODE) =================
  router.post("/send", async (req, res) => {
    const { mobile } = req.body;

    // validate mobile number
    if (!mobile || !/^[1-9][0-9]{9}$/.test(mobile)) {
      return res.status(400).json({ success: false, message: "Invalid mobile" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000);
    const db = readDB();

    // remove previous OTPs
    db.otps = db.otps.filter(o => o.mobile !== mobile);

    // save new OTP
    db.otps.push({
      mobile,
      otp,
      time: Date.now()
    });
    writeDB(db);

    try {
      await axios.get("https://www.fast2sms.com/dev/bulkV2", {
        params: {
          authorization: process.env.FAST2SMS_API_KEY,
          route: "dlt",
          sender_id: "TXTIND",       // MUST be approved sender ID
          message: `Your CluckCart OTP is ${otp}`, // MUST match DLT template
          numbers: mobile,
          flash: 0
        }
      });

      res.json({ success: true });
    } catch (err) {
      console.error(
        "Fast2SMS Error:",
        err.response?.data || err.message
      );
      res.status(500).json({ success: false });
    }
  });

  // ================= VERIFY OTP =================
  router.post("/verify", (req, res) => {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({ success: false });
    }

    const db = readDB();

    const record = db.otps.find(
      o =>
        o.mobile === mobile &&
        o.otp == otp &&
        Date.now() - o.time <= 2 * 60 * 1000 // 2 min expiry
    );

    if (!record) {
      return res.status(400).json({ success: false });
    }

    // delete OTP after success
    db.otps = db.otps.filter(o => o.mobile !== mobile);
    writeDB(db);

    res.json({ success: true });
  });

  return router;
};
