const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
const serviceAccount = require("./firebase-service-account.json"); // Replace with your Firebase service account JSON

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Endpoint to send notification
app.post("/send-notification", async (req, res) => {
  const { deviceToken, title, body, additionalData } = req.body;

  if (!deviceToken || !title || !body) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const message = {
      notification: {
        title: title,
        body: body,
      },
      data: additionalData || {}, // Optional payload data
      token: deviceToken,
    };

    // Send notification via FCM
    const response = await admin.messaging().send(message);
    console.log("Notification sent successfully:", response);

    return res.status(200).json({ message: "Notification sent successfully", response });
  } catch (error) {
    console.error("Error sending notification:", error);
    return res.status(500).json({ error: "Failed to send notification", details: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
