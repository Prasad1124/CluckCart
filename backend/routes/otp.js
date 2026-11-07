
const express = require("express");

module.exports = (readDB, writeDB) => {
  const router = express.Router();

  const DEMO_OTP = "1234";

  // SEND DEMO OTP
  router.post("/send", (req, res) => {
    const { mobile } = req.body || {};

    if (!/^[6-9]\d{9}$/.test(String(mobile || ""))) {
      return res.status(400).json({
        success: false,
        message: "Invalid mobile number."
      });
    }

    console.log(`Demo OTP generated for mobile: ${mobile}`);

    return res.status(200).json({
      success: true,
      message: "Demo OTP generated successfully.",
      demoOTP: DEMO_OTP
    });
  });

  // VERIFY DEMO OTP
  router.post("/verify", (req, res) => {
    const { mobile, otp } = req.body || {};

    if (!/^[6-9]\d{9}$/.test(String(mobile || ""))) {
      return res.status(400).json({
        success: false,
        message: "Invalid mobile number."
      });
    }

    if (String(otp).trim() !== DEMO_OTP) {
      return res.status(400).json({
        success: false,
        message: "Invalid demo OTP. Enter 1234."
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully."
    });
  });

  return router;
};
