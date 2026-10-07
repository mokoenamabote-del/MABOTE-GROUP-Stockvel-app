import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import nodemailer from "nodemailer";
import { createHash, randomBytes } from "node:crypto";
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
  setAccountRole,
  createPasswordResetToken,
  consumePasswordResetToken,
  deletePasswordResetToken,
  updateApplication,
} from "./database.js";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.join(currentDirectory, ".env") });

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;
app.set("trust proxy", 1);
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const DEFAULT_ADMIN_EMAIL = process.env.DEFAULT_ADMIN_EMAIL || "mokoenamabote@gmail.com";
const DEFAULT_ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD;
const DEFAULT_MANAGEMENT_EMAIL = process.env.DEFAULT_MANAGEMENT_EMAIL || "management@mabotegroup.co.za";
const DEFAULT_MANAGEMENT_PASSWORD = process.env.DEFAULT_MANAGEMENT_PASSWORD;
const PASSWORD_RESET_TTL_MS = 30 * 60 * 1000;
const APP_BASE_URL = (process.env.APP_BASE_URL || "https://www.mabote-group.co.za").replace(/\/+$/, "");

const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many password reset attempts. Please try again later." },
});

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET must be set in backend/.env before starting the server");
}

const ensureDefaultAdminAccount = async () => {
  const existingAccount = findAccountByEmail(DEFAULT_ADMIN_EMAIL);
  if (existingAccount) return;
  if (!DEFAULT_ADMIN_PASSWORD) {
    throw new Error("DEFAULT_ADMIN_PASSWORD must be set before creating the default admin account");
  }

  try {
    const passwordHash = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 12);
    createAccount({
      fullName: "MABOTE",
      surname: "GROUP",
      email: DEFAULT_ADMIN_EMAIL,
      passwordHash,
      role: "Admin",
    });

    console.log(`Default admin account created for ${DEFAULT_ADMIN_EMAIL}`);
  } catch (error) {
    if (error.code !== "SQLITE_CONSTRAINT_UNIQUE") {
      throw error;
    }
  }
};

const ensureDefaultManagementAccount = async () => {
  const existingAccount = findAccountByEmail(DEFAULT_MANAGEMENT_EMAIL);

  if (existingAccount) {
    setAccountRole(DEFAULT_MANAGEMENT_EMAIL, "Management");
    return;
  }

  if (!DEFAULT_MANAGEMENT_PASSWORD) {
    throw new Error("DEFAULT_MANAGEMENT_PASSWORD must be set before creating the management account");
  }

  try {
    const passwordHash = await bcrypt.hash(DEFAULT_MANAGEMENT_PASSWORD, 12);
    createAccount({
      fullName: "MABOTE",
      surname: "MANAGEMENT",
      email: DEFAULT_MANAGEMENT_EMAIL,
      passwordHash,
      role: "Management",
    });

    console.log(`Management account created for ${DEFAULT_MANAGEMENT_EMAIL}`);
  } catch (error) {
    if (error.code !== "SQLITE_CONSTRAINT_UNIQUE") {
      throw error;
    }
  }
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
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

const getPasswordResetMailer = () => {
  const user = String(process.env.SMTP_USER || "").trim();
  const pass = String(process.env.SMTP_APP_PASSWORD || "").replace(/\s/g, "");

  if (!user || !pass) return null;

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
};

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

app.post("/api/auth/password-reset-requests", passwordResetLimiter, async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      return res.status(400).json({ error: "Enter a valid email address" });
    }

    const mailer = getPasswordResetMailer();
    if (!mailer) {
      return res.status(503).json({
        error: "Password reset email is not configured yet. Please try again later.",
      });
    }

    const account = findAccountByEmail(email);
    if (!account) {
      return res.status(202).json({
        message: "If an account exists for that email, a password reset link will be sent.",
      });
    }

    const token = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(token).digest("hex");
    const expiresAt = new Date(Date.now() + PASSWORD_RESET_TTL_MS).toISOString();
    createPasswordResetToken(account.id, tokenHash, expiresAt);

    const resetUrl = `${APP_BASE_URL}/reset-password?token=${token}`;
    try {
      await mailer.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: account.email,
        subject: "Reset your MABOTE GROUP password",
        text: `We received a request to reset the password for your MABOTE GROUP account. Open this link within 30 minutes to choose a new password:\n\n${resetUrl}\n\nIf you did not request this, you can ignore this email.`,
        html: `<p>We received a request to reset the password for your MABOTE GROUP account.</p><p><a href="${resetUrl}">Reset your password</a></p><p>This link expires in 30 minutes. If you did not request this, you can ignore this email.</p>`,
      });
    } catch (error) {
      deletePasswordResetToken(tokenHash);
      console.error("Password reset email delivery failed:", error);
      return res.status(503).json({
        error: "We could not send the password reset email. Please try again later.",
      });
    }

    res.status(202).json({
      message: "If an account exists for that email, a password reset link will be sent.",
    });
  } catch (error) {
    console.error("Password reset request error:", error);
    res.status(500).json({ error: "Unable to process the password reset request" });
  }
});

app.post("/api/auth/reset-password", passwordResetLimiter, async (req, res) => {
  try {
    const token = String(req.body?.token || "");
    const newPassword = String(req.body?.newPassword || "");
    const confirmPassword = String(req.body?.confirmPassword || "");

    if (!/^[a-f0-9]{64}$/i.test(token)) {
      return res.status(400).json({ error: "This password reset link is invalid or expired" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters long" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const tokenHash = createHash("sha256").update(token).digest("hex");
    const passwordHash = await bcrypt.hash(newPassword, 12);
    const updated = consumePasswordResetToken(
      tokenHash,
      passwordHash,
      new Date().toISOString()
    );

    if (!updated) {
      return res.status(400).json({ error: "This password reset link is invalid or expired" });
    }

    res.json({ message: "Password updated successfully. You can now log in." });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({ error: "Unable to reset password" });
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

await ensureDefaultAdminAccount();
await ensureDefaultManagementAccount();

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`Payment sync endpoint: http://localhost:${PORT}/api/payments/sync`);
});
