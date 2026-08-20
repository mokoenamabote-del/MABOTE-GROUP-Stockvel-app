import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getPaymentUpdates, getAuthUrl, saveToken } from "./sheetsHelper.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Get the current payment data from Google Sheets
app.get("/api/payments/sync", async (req, res) => {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
    const sheetName = process.env.GOOGLE_SHEETS_NAME || "Sheet1";

    if (!spreadsheetId) {
      return res.status(400).json({
        error: "Google Sheets ID not configured in environment variables",
      });
    }

    const payments = await getPaymentUpdates(spreadsheetId, sheetName);
    res.json({
      success: true,
      data: payments,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Payment sync error:", error);
    res.status(500).json({
      error: "Failed to sync payments from Google Sheets",
      details: error.message,
    });
  }
});

// Get authentication URL for initial Google Sheets setup
app.get("/api/auth/google-sheets-url", async (req, res) => {
  try {
    const authUrl = await getAuthUrl();
    res.json({ authUrl });
  } catch (error) {
    res.status(500).json({
      error: "Failed to generate auth URL",
      details: error.message,
    });
  }
});

// Save the authorization code received from Google
app.post("/api/auth/google-sheets-callback", async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ error: "Authorization code required" });
    }

    await saveToken(code);
    res.json({
      success: true,
      message: "Google Sheets authenticated successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to authenticate with Google Sheets",
      details: error.message,
    });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`Payment sync endpoint: http://localhost:${PORT}/api/payments/sync`);
});
