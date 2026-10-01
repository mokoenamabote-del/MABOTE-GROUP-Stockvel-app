import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getPaymentUpdates, getAuthUrl, saveToken } from "./sheetsHelper.js";
import {
  createAccount,
  createApplication,
  findAccountByEmail,
  listClaims,
  listClaimsForEmail,
  listContributions,
  listContributionsForEmail,
  listApplications,
  listApplicationsForEmail,
  saveContribution,
  saveClaim,
  updateApplication,
} from "./database.js";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.join(currentDirectory, ".env") });

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET must be set in backend/.env before starting the server");
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());

const publicAccount = (account) => ({
  id: account.id,
  fullName: account.full_name,
  surname: account.surname,
  email: account.email,
  role: account.role,
});

const createSessionToken = (account) =>
  jwt.sign(
    { sub: String(account.id), email: account.email, role: account.role },
    JWT_SECRET,
    { expiresIn: "8h" }
  );

const requireAuth = (req, res, next) => {
  const authorization = req.headers.authorization || "";
  const token = authorization.startsWith("Bearer ")
    ? authorization.slice(7)
    : "";

  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    req.account = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Session expired or invalid" });
  }
};

app.post("/api/auth/register", async (req, res) => {
  try {
    const fullName = String(req.body.fullName || "").trim();
    const surname = String(req.body.surname || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!fullName || !surname || !email || password.length < 8) {
      return res.status(400).json({
        error: "Full name, surname, email, and a password of at least 8 characters are required",
      });
    }

    if (findAccountByEmail(email)) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const account = createAccount({ fullName, surname, email, passwordHash });

    res.status(201).json({ account: publicAccount(account) });
  } catch (error) {
    console.error("Account registration error:", error);
    res.status(500).json({ error: "Unable to create account" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    const account = findAccountByEmail(email);

    if (!account || !(await bcrypt.compare(password, account.password_hash))) {
      return res.status(401).json({ error: "Incorrect email or password" });
    }

    res.json({ token: createSessionToken(account), account: publicAccount(account) });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Unable to log in" });
  }
});

app.get("/api/auth/me", requireAuth, (req, res) => {
  const account = findAccountByEmail(req.account.email);

  if (!account) {
    return res.status(401).json({ error: "Account no longer exists" });
  }

  res.json({ account: publicAccount(account) });
});

app.post("/api/applications", requireAuth, (req, res) => {
  try {
    const application = {
      ...req.body,
      email: String(req.body.email || req.account.email).trim().toLowerCase(),
    };

    if (!application.applicationNumber || !application.email) {
      return res.status(400).json({ error: "Application number and email are required" });
    }

    const savedApplication = createApplication(application);
    res.status(201).json({ application: savedApplication });
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json({ error: "This application has already been submitted" });
    }

    console.error("Application creation error:", error);
    res.status(500).json({ error: "Unable to save application" });
  }
});

app.get("/api/applications", requireAuth, (req, res) => {
  const isStaff = ["Admin", "Management", "Support Staff"].includes(req.account.role);
  const applications = isStaff
    ? listApplications()
    : listApplicationsForEmail(req.account.email);

  res.json({ applications });
});

app.patch("/api/applications/:applicationNumber", requireAuth, (req, res) => {
  const isStaff = ["Admin", "Management", "Support Staff"].includes(req.account.role);

  if (!isStaff) {
    return res.status(403).json({ error: "Staff access required" });
  }

  const application = updateApplication(req.params.applicationNumber, req.body);

  if (!application) {
    return res.status(404).json({ error: "Application not found" });
  }

  res.json({ application });
});

app.post("/api/contributions", requireAuth, (req, res) => {
  const isStaff = ["Admin", "Management", "Support Staff"].includes(req.account.role);

  if (!isStaff) {
    return res.status(403).json({ error: "Staff access required" });
  }

  const contribution = {
    ...req.body,
    email: String(req.body.email || "").trim().toLowerCase(),
  };

  if (!contribution.id) {
    return res.status(400).json({ error: "Contribution id is required" });
  }

  res.status(201).json({ contribution: saveContribution(contribution) });
});

app.get("/api/contributions", requireAuth, (req, res) => {
  const isStaff = ["Admin", "Management", "Support Staff"].includes(req.account.role);
  const contributions = isStaff
    ? listContributions()
    : listContributionsForEmail(req.account.email);

  res.json({ contributions });
});

app.post("/api/claims", requireAuth, (req, res) => {
  const claim = {
    ...req.body,
    email: String(req.body.email || req.account.email).trim().toLowerCase(),
  };

  if (!claim.id) {
    return res.status(400).json({ error: "Claim id is required" });
  }

  res.status(201).json({ claim: saveClaim(claim) });
});

app.get("/api/claims", requireAuth, (req, res) => {
  const isStaff = ["Admin", "Management", "Support Staff"].includes(req.account.role);
  const claims = isStaff ? listClaims() : listClaimsForEmail(req.account.email);

  res.json({ claims });
});

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
