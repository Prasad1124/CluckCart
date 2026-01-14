const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ⭐ Replace with your REAL Fast2SMS key
const API_KEY = "Your_API_key_Here";

app.post("/send-otp", async (req, res) => {
  const mobile = req.body.mobile;
  const otp = Math.floor(1000 + Math.random() * 9000);

  try {
    await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      {
        route: "v3",
        sender_id: "TXTIND",
        message: `Your CluckCart OTP is ${otp}`,
        language: "english",
        flash: 0,
        numbers: mobile
      },
      {
        headers: {
          authorization: API_KEY
        }
      }
    );

    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

app.listen(3000, () => {
  console.log("OTP server running on port 3000");
});
