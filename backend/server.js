
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import nodemailer from "nodemailer";
import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
  randomInt,
} from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  getPaymentUpdates,
  getAuthUrl,
  saveToken,
} from "./sheetsHelper.js";

import {
  createAccount,
  createApplication,
  changeAccountPassword,
  consumePasswordResetToken,
  createPasswordResetToken,
  deletePasswordResetToken,
  findAccountByEmail,
  findClaimById,
  deleteClaim,
  listClaims,
  listClaimDocuments,
  listClaimsForEmail,
  listContributions,
  listContributionsForEmail,
  listApplications,
  listApplicationsForEmail,
  saveContribution,
  saveClaim,
  saveClaimWithDocuments,
  setAccountPassword,
  setAccountRole,
  updateApplication,
  createPaymentTransaction,
  getPaymentTransactionByReference,
  completePaymentTransaction,
  failPaymentTransaction,
} from "./database.js";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.join(currentDirectory, ".env") });

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

const DEFAULT_ADMIN_EMAIL =
  process.env.DEFAULT_ADMIN_EMAIL || "mokoenamabote@gmail.com";

const DEFAULT_ADMIN_PASSWORD =
  process.env.DEFAULT_ADMIN_PASSWORD || "Mabote@2026!";

const DEFAULT_MANAGEMENT_EMAIL =
  process.env.DEFAULT_MANAGEMENT_EMAIL || "management@mabotegroup.co.za";

const DEFAULT_MANAGEMENT_PASSWORD =
  process.env.DEFAULT_MANAGEMENT_PASSWORD || "MaboteManage@2026!";

const PASSWORD_RESET_TTL_MS = 10 * 60 * 1000;

const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many password reset attempts. Please try again later.",
  },
});

const passwordChangeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many password change attempts. Please try again later.",
  },
});

if (!JWT_SECRET) {
  throw new Error(
    "JWT_SECRET must be set in backend/.env before starting the server"
  );
}

// ==========================================
// DEFAULT ADMIN ACCOUNT
// ==========================================

const ensureDefaultAdminAccount = async () => {
  const existingAccount = findAccountByEmail(DEFAULT_ADMIN_EMAIL);
  const passwordHash = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 12);

  if (existingAccount) {
    const updated = setAccountPassword(
      DEFAULT_ADMIN_EMAIL,
      passwordHash
    );

    if (updated) {
      console.log(
        `Default admin password restored for ${DEFAULT_ADMIN_EMAIL}`
      );
    }

    return;
  }

  try {
    createAccount({
      fullName: "MABOTE",
      surname: "GROUP",
      email: DEFAULT_ADMIN_EMAIL,
      passwordHash,
      role: "Admin",
    });

    console.log(
      `Default admin account created for ${DEFAULT_ADMIN_EMAIL}`
    );
  } catch (error) {
    if (error.code !== "SQLITE_CONSTRAINT_UNIQUE") {
      throw error;
    }
  }
};

// ==========================================
// DEFAULT MANAGEMENT ACCOUNT
// ==========================================

const ensureDefaultManagementAccount = async () => {
  const existingAccount = findAccountByEmail(DEFAULT_MANAGEMENT_EMAIL);
  const passwordHash = await bcrypt.hash(
    DEFAULT_MANAGEMENT_PASSWORD,
    12
  );

  if (existingAccount) {
    setAccountPassword(DEFAULT_MANAGEMENT_EMAIL, passwordHash);
    setAccountRole(DEFAULT_MANAGEMENT_EMAIL, "Management");
    return;
  }

  try {
    createAccount({
      fullName: "MABOTE",
      surname: "MANAGEMENT",
      email: DEFAULT_MANAGEMENT_EMAIL,
      passwordHash,
      role: "Management",
    });

    console.log(
      `Management account created for ${DEFAULT_MANAGEMENT_EMAIL}`
    );
  } catch (error) {
    if (error.code !== "SQLITE_CONSTRAINT_UNIQUE") {
      throw error;
    }
  }
};

// ==========================================
// CORS AND MIDDLEWARE
// ==========================================

const configuredOrigins = [
  "https://mabote-group-stockvel-app.onrender.com",
  "https://www.mabote-group.co.za",
  "https://mabote-group.co.za",
  "https://www.mabotegroup.co.za",
  "https://mabotegroup.co.za",
  "capacitor://localhost",
  "https://localhost",
  "http://localhost:5173",
  ...(process.env.CORS_ORIGIN || "").split(","),
]
  .map((origin) => origin.trim())
  .filter(
    (origin, index, origins) =>
      origin && origins.indexOf(origin) === index
  );

app.use(
  cors({
    origin:
      configuredOrigins.length === 1
        ? configuredOrigins[0]
        : configuredOrigins,
  })
);

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: false }));

// ==========================================
// ACCOUNT HELPERS
// ==========================================

const publicAccount = (account) => ({
  id: account.id,
  fullName: account.full_name,
  surname: account.surname,
  email: account.email,
  role: account.role,
});

const createSessionToken = (account) =>
  jwt.sign(
    {
      sub: String(account.id),
      email: account.email,
      role: account.role,
    },
    JWT_SECRET,
    { expiresIn: "8h" }
  );

const getPasswordResetMailer = () => {
  const user = String(
    process.env.SMTP_USER || "info@mabote-group.co.za"
  ).trim();

  const pass = String(
    process.env.SMTP_APP_PASSWORD || ""
  ).replace(/\s/g, "");

  const port = Number(process.env.SMTP_PORT || 587);

  if (!user || !pass) return null;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.office365.com",
    port,
    secure: port === 465,
    auth: { user, pass },
  });
};

const requireAuth = (req, res, next) => {
  const authorization = req.headers.authorization || "";

  const token = authorization.startsWith("Bearer ")
    ? authorization.slice(7)
    : "";

  if (!token) {
    return res.status(401).json({
      error: "Authentication required",
    });
  }

  try {
    req.account = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({
      error: "Session expired or invalid",
    });
  }
};

// ==========================================
// REGISTRATION
// ==========================================

app.post("/api/auth/register", async (req, res) => {
  try {
    const fullName = String(req.body.fullName || "").trim();
    const surname = String(req.body.surname || "").trim();
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();

    const password = String(req.body.password || "");

    if (!fullName || !surname || !email || password.length < 8) {
      return res.status(400).json({
        error:
          "Full name, surname, email, and a password of at least 8 characters are required",
      });
    }

    if (findAccountByEmail(email)) {
      return res.status(409).json({
        error: "An account with this email already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const account = createAccount({
      fullName,
      surname,
      email,
      passwordHash,
    });

    res.status(201).json({
      account: publicAccount(account),
    });
  } catch (error) {
    console.error("Account registration error:", error);

    res.status(500).json({
      error: "Unable to create account",
    });
  }
});

// ==========================================
// LOGIN
// ==========================================

app.post("/api/auth/login", async (req, res) => {
  try {
    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();

    const password = String(req.body.password || "");

    const account = findAccountByEmail(email);

    if (
      !account ||
      !(await bcrypt.compare(password, account.password_hash))
    ) {
      return res.status(401).json({
        error: "Incorrect email or password",
      });
    }

    res.json({
      token: createSessionToken(account),
      account: publicAccount(account),
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      error: "Unable to log in",
    });
  }
});

// ==========================================
// CHANGE PASSWORD
// ==========================================

app.post(
  "/api/auth/change-password",
  requireAuth,
  passwordChangeLimiter,
  async (req, res) => {
    try {
      const email = String(req.account.email || "")
        .trim()
        .toLowerCase();

      const newPassword = String(req.body?.newPassword || "");
      const confirmPassword = String(
        req.body?.confirmPassword || ""
      );

      const account = findAccountByEmail(email);

      if (!account) {
        return res.status(404).json({
          error: "Account no longer exists",
        });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({
          error: "Password must be at least 8 characters long",
        });
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({
          error: "Passwords do not match",
        });
      }

      const passwordHash = await bcrypt.hash(newPassword, 12);

      const updated = changeAccountPassword(
        account.id,
        passwordHash
      );

      if (!updated) {
        return res.status(404).json({
          error: "Account no longer exists",
        });
      }

      res.json({
        message: "Password changed successfully.",
      });
    } catch (error) {
      console.error("Password change error:", error);

      res.status(500).json({
        error: "Unable to change password",
      });
    }
  }
);

// ==========================================
// PASSWORD RESET REQUEST
// ==========================================

app.post(
  "/api/auth/password-reset-requests",
  passwordResetLimiter,
  async (req, res) => {
    try {
      const email = String(req.body?.email || "")
        .trim()
        .toLowerCase();

      if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        email.length > 254
      ) {
        return res.status(400).json({
          error: "Enter a valid email address",
        });
      }

      const mailer = getPasswordResetMailer();

      if (!mailer) {
        return res.status(503).json({
          error:
            "Password reset email is not configured yet. Please try again later.",
        });
      }

      const account = findAccountByEmail(email);

      if (!account) {
        return res.status(202).json({
          message:
            "If an account exists for that email, a verification code will be sent.",
        });
      }

      const code = String(
        randomInt(0, 1_000_000)
      ).padStart(6, "0");

      const tokenHash = createHash("sha256")
        .update(`${email}:${code}`)
        .digest("hex");

      const expiresAt = new Date(
        Date.now() + PASSWORD_RESET_TTL_MS
      ).toISOString();

      createPasswordResetToken(
        account.id,
        tokenHash,
        expiresAt
      );

      try {
        await mailer.sendMail({
          from:
            process.env.SMTP_FROM ||
            process.env.SMTP_USER ||
            "info@mabote-group.co.za",

          to: account.email,

          subject: "Your MABOTE GROUP password reset code",

          text: `Your password reset verification code is ${code}. Enter this code on the login page to choose a new password. The code expires in 10 minutes. If you did not request this, you can ignore this email.`,

          html: `<p>Your MABOTE GROUP password reset verification code is:</p>
            <p style="font-size:24px;font-weight:bold;letter-spacing:4px">${code}</p>
            <p>Enter this code on the login page to choose a new password. It expires in 10 minutes. If you did not request this, you can ignore this email.</p>`,
        });
      } catch (error) {
        deletePasswordResetToken(tokenHash);

        console.error(
          "Password reset email delivery failed:",
          error
        );

        return res.status(503).json({
          error:
            "We could not send the password reset email. Please try again later.",
        });
      }

      res.status(202).json({
        message:
          "If an account exists for that email, a verification code will be sent.",
      });
    } catch (error) {
      console.error("Password reset request error:", error);

      res.status(500).json({
        error: "Unable to process the password reset request",
      });
    }
  }
);

// ==========================================
// RESET PASSWORD
// ==========================================

app.post(
  "/api/auth/reset-password",
  passwordResetLimiter,
  async (req, res) => {
    try {
      const email = String(req.body?.email || "")
        .trim()
        .toLowerCase();

      const code = String(req.body?.code || "").trim();

      const newPassword = String(req.body?.newPassword || "");

      const confirmPassword = String(
        req.body?.confirmPassword || ""
      );

      if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        !/^\d{6}$/.test(code)
      ) {
        return res.status(400).json({
          error: "The verification code is invalid or expired",
        });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({
          error: "Password must be at least 8 characters long",
        });
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({
          error: "Passwords do not match",
        });
      }

      const account = findAccountByEmail(email);

      if (!account) {
        return res.status(400).json({
          error: "The verification code is invalid or expired",
        });
      }

      const tokenHash = createHash("sha256")
        .update(`${email}:${code}`)
        .digest("hex");

      const passwordHash = await bcrypt.hash(
        newPassword,
        12
      );

      const updated = consumePasswordResetToken(
        tokenHash,
        passwordHash,
        new Date().toISOString()
      );

      if (!updated) {
        return res.status(400).json({
          error: "The verification code is invalid or expired",
        });
      }

      res.json({
        message: "Password updated successfully. You can now log in.",
      });
    } catch (error) {
      console.error("Password reset error:", error);

      res.status(500).json({
        error: "Unable to reset password",
      });
    }
  }
);

// ==========================================
// CURRENT ACCOUNT
// ==========================================

app.get("/api/auth/me", requireAuth, (req, res) => {
  const account = findAccountByEmail(req.account.email);

  if (!account) {
    return res.status(401).json({
      error: "Account no longer exists",
    });
  }

  res.json({
    account: publicAccount(account),
  });
});

// ==========================================
// APPLICATIONS
// ==========================================

app.post("/api/applications", requireAuth, (req, res) => {
  try {
    const email =
      req.account.role === "Member"
        ? req.account.email
        : req.body.email || req.account.email;
    const application = {
      ...req.body,
      email: String(email)
        .trim()
        .toLowerCase(),
    };

    if (!application.applicationNumber || !application.email) {
      return res.status(400).json({
        error: "Application number and email are required",
      });
    }

    const savedApplication = createApplication(application);

    res.status(201).json({
      application: savedApplication,
    });
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json({
        error: "This application has already been submitted",
      });
    }

    console.error("Application creation error:", error);

    res.status(500).json({
      error: "Unable to save application",
    });
  }
});

app.get("/api/applications", requireAuth, (req, res) => {
  const isStaff = [
    "Admin",
    "Management",
    "Support Staff",
  ].includes(req.account.role);

  const applications = isStaff
    ? listApplications()
    : listApplicationsForEmail(req.account.email);

  res.json({ applications });
});

app.patch(
  "/api/applications/:applicationNumber",
  requireAuth,
  (req, res) => {
    const isStaff = [
      "Admin",
      "Management",
      "Support Staff",
    ].includes(req.account.role);

    if (!isStaff) {
      return res.status(403).json({
        error: "Staff access required",
      });
    }

    const application = updateApplication(
      req.params.applicationNumber,
      req.body
    );

    if (!application) {
      return res.status(404).json({
        error: "Application not found",
      });
    }

    res.json({ application });
  }
);

// ==========================================
// CONTRIBUTIONS
// ==========================================

app.post("/api/contributions", requireAuth, (req, res) => {
  const isStaff = [
    "Admin",
    "Management",
    "Support Staff",
  ].includes(req.account.role);

  if (!isStaff) {
    return res.status(403).json({
      error: "Staff access required",
    });
  }

  const contribution = {
    ...req.body,
    email: String(req.body.email || "")
      .trim()
      .toLowerCase(),
  };

  if (!contribution.id) {
    return res.status(400).json({
      error: "Contribution id is required",
    });
  }

  res.status(201).json({
    contribution: saveContribution(contribution),
  });
});

app.get("/api/contributions", requireAuth, (req, res) => {
  const isStaff = [
    "Admin",
    "Management",
    "Support Staff",
  ].includes(req.account.role);

  const contributions = isStaff
    ? listContributions()
    : listContributionsForEmail(req.account.email);

  res.json({ contributions });
});

// ==========================================
// CLAIMS
// ==========================================

const claimStaffRoles = ["Admin", "Management", "Support Staff"];
const requiredClaimDocumentTypes = new Set([
  "deathCertificate",
  "claimantId",
  "deceasedId",
  "doctorConfirmation",
]);
const maximumClaimDocumentBytes = 3 * 1024 * 1024;
const claimDocumentEncryptionKey = createHash("sha256")
  .update(`mabote-claim-documents:${JWT_SECRET}`)
  .digest();

const isClaimStaff = (account) => claimStaffRoles.includes(account.role);

const encryptClaimDocument = (document, claimId) => {
  const fileName = String(document.name || "document")
    .replace(/[^\w.-]/g, "_")
    .slice(0, 100);
  const mimeType = String(document.mimeType || "");
  const data = String(document.data || "");

  if (
    !fileName ||
    !["application/pdf", "image/jpeg", "image/png"].includes(mimeType) ||
    !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(data)
  ) {
    throw new Error("A claim document has an unsupported file format.");
  }

  const fileBuffer = Buffer.from(data, "base64");
  if (
    !fileBuffer.length ||
    fileBuffer.length > maximumClaimDocumentBytes ||
    fileBuffer.toString("base64") !== data
  ) {
    throw new Error("Each claim document must be no larger than 3 MB.");
  }

  const hasValidSignature =
    (mimeType === "application/pdf" &&
      fileBuffer.subarray(0, 5).toString() === "%PDF-") ||
    (mimeType === "image/jpeg" &&
      fileBuffer[0] === 0xff &&
      fileBuffer[1] === 0xd8 &&
      fileBuffer[2] === 0xff) ||
    (mimeType === "image/png" &&
      fileBuffer.subarray(0, 8).equals(
        Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
      ));

  if (!hasValidSignature) {
    throw new Error("A claim document does not match its file type.");
  }

  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", claimDocumentEncryptionKey, iv);
  cipher.setAAD(Buffer.from(`${claimId}:${document.type}`));
  const encryptedData = Buffer.concat([
    cipher.update(fileBuffer),
    cipher.final(),
  ]);

  return {
    type: document.type,
    name: fileName,
    mimeType,
    size: fileBuffer.length,
    encryptedData: encryptedData.toString("base64"),
    iv: iv.toString("base64"),
    authTag: cipher.getAuthTag().toString("base64"),
  };
};

const decryptClaimDocument = (claimId, document) => {
  const decipher = createDecipheriv(
    "aes-256-gcm",
    claimDocumentEncryptionKey,
    Buffer.from(document.iv, "base64")
  );
  decipher.setAAD(Buffer.from(`${claimId}:${document.document_type}`));
  decipher.setAuthTag(Buffer.from(document.auth_tag, "base64"));
  const data = Buffer.concat([
    decipher.update(Buffer.from(document.encrypted_data, "base64")),
    decipher.final(),
  ]);

  return {
    type: document.document_type,
    name: document.file_name,
    mimeType: document.mime_type,
    size: document.file_size,
    data: data.toString("base64"),
  };
};

app.post("/api/claims", requireAuth, (req, res) => {
  const isStaff = isClaimStaff(req.account);
  const claimId = Number(req.body.id);

  if (!Number.isSafeInteger(claimId) || claimId <= 0) {
    return res.status(400).json({ error: "A valid claim id is required" });
  }

  if (!isStaff && findClaimById(claimId)) {
    return res.status(409).json({ error: "Claim already exists" });
  }

  let encryptedDocuments;
  if (!isStaff) {
    const documents = req.body.documents;
    if (
      !Array.isArray(documents) ||
      documents.length !== requiredClaimDocumentTypes.size ||
      documents.some(
        (document) =>
          !document ||
          typeof document.type !== "string" ||
          !requiredClaimDocumentTypes.has(document.type)
      ) ||
      new Set(documents.map((document) => document.type)).size !==
        requiredClaimDocumentTypes.size
    ) {
      return res.status(400).json({
        error: "All four required claim documents must be uploaded.",
      });
    }

    if (
      !String(req.body.member || "").trim() ||
      !String(req.body.membershipNumber || "").trim() ||
      !String(req.body.claimantName || "").trim() ||
      !String(req.body.deceasedName || "").trim() ||
      !String(req.body.date || "").trim() ||
      !String(req.body.reason || "").trim()
    ) {
      return res.status(400).json({
        error: "Complete all required claim information.",
      });
    }

    try {
      encryptedDocuments = documents.map((document) =>
        encryptClaimDocument(document, claimId)
      );
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  const claimDocuments = encryptedDocuments?.map((document) => ({
    type: document.type,
    name: document.name,
    mimeType: document.mimeType,
    size: document.size,
  }));
  const claim = {
    ...req.body,
    id: claimId,
    ...(claimDocuments ? { documents: claimDocuments } : {}),
    email: isStaff
      ? String(req.body.email || req.account.email).trim().toLowerCase()
      : String(req.account.email).trim().toLowerCase(),
    ...(!isStaff ? { status: "Pending" } : {}),
  };

  res.status(201).json({
    claim: encryptedDocuments
      ? saveClaimWithDocuments(claim, encryptedDocuments)
      : saveClaim(claim),
  });
});

app.get(
  "/api/claims/:id/documents/:documentType",
  requireAuth,
  (req, res) => {
    if (!isClaimStaff(req.account)) {
      return res.status(403).json({
        error: "Only management and staff can access claim documents.",
      });
    }

    const claimId = Number(req.params.id);
    if (!Number.isSafeInteger(claimId) || claimId <= 0) {
      return res.status(400).json({ error: "A valid claim id is required" });
    }

    const document = listClaimDocuments(claimId).find(
      (item) => item.document_type === req.params.documentType
    );
    if (!document) {
      return res.status(404).json({ error: "Claim document not found." });
    }

    res.json({ document: decryptClaimDocument(claimId, document) });
  }
);

app.get("/api/claims", requireAuth, (req, res) => {
  const isStaff = isClaimStaff(req.account);

  const claims = isStaff
    ? listClaims()
    : listClaimsForEmail(req.account.email);

  res.json({ claims });
});

app.delete("/api/claims/:id", requireAuth, (req, res) => {
  const claimId = Number(req.params.id);
  if (!Number.isSafeInteger(claimId) || claimId <= 0) {
    return res.status(400).json({ error: "A valid claim id is required" });
  }

  const claim = findClaimById(claimId);
  if (!claim) {
    return res.status(404).json({ error: "Claim not found." });
  }

  if (!isClaimStaff(req.account) && claim.email !== req.account.email) {
    return res.status(403).json({
      error: "You can only delete claims submitted from your account.",
    });
  }

  if (!deleteClaim(claimId)) {
    return res.status(404).json({ error: "Claim not found." });
  }

  res.json({ success: true });
});

// ==========================================
// MABOTE GROUP - NETCASH PAY NOW
// ==========================================

const NETCASH_PAYNOW_URL =
  "https://paynow.netcash.co.za/site/paynow.aspx";

const netcashServiceKey = () =>
  String(
    process.env.NETCASH_PAYNOW_SERVICE_KEY || ""
  ).trim();

const netcashVendorKey = () =>
  String(
    process.env.NETCASH_VENDOR_KEY ||
      "24ade73c-98cf-47b3-99be-cc7b867b3080"
  ).trim();

const getAppBaseUrl = () =>
  String(
    process.env.APP_BASE_URL ||
      "https://www.mabote-group.co.za"
  ).replace(/\/+$/, "");

const netcashConfigured = () =>
  Boolean(netcashServiceKey());

const allowedPaymentAmounts = [80, 300, 350, 450];

const paymentDescription = (amount, purpose) => {
  const cleanPurpose = String(purpose || "").trim();

  if (cleanPurpose) {
    return cleanPurpose.slice(0, 50);
  }

  if (amount === 80) {
    return "MABOTE GROUP Registration Fee";
  }

  if (amount === 300) {
    return "MABOTE GROUP Plan A";
  }

  if (amount === 350) {
    return "MABOTE GROUP Plan B";
  }

  if (amount === 450) {
    return "MABOTE GROUP Plan C";
  }

  return "MABOTE GROUP Payment";
};

// The frontend checks this endpoint before showing online payment.
app.get("/api/payments/config", (req, res) => {
  res.json({
    configured: netcashConfigured(),
    provider: "Netcash",
    environment: netcashConfigured()
      ? "configured"
      : "not-configured",
    onlinePaymentsEnabled: netcashConfigured(),
    supportedAmounts: allowedPaymentAmounts,
  });
});

// Create a pending payment and prepare the Netcash checkout form.
app.post("/api/payments/checkout", (req, res) => {
  try {
    if (!netcashConfigured()) {
      return res.status(503).json({
        error:
          "Netcash payments are not activated yet. Please contact MABOTE GROUP for payment assistance.",
      });
    }

    const amount = Number(req.body.amount);

    if (!allowedPaymentAmounts.includes(amount)) {
      return res.status(400).json({
        error:
          "Choose R80 registration or an available R300, R350 or R450 package.",
      });
    }

    const name = String(req.body.name || "")
      .trim()
      .slice(0, 100);

    const email = String(req.body.email || "")
      .trim()
      .toLowerCase();

    const purpose = paymentDescription(
      amount,
      req.body.purpose
    );

    if (
      !name ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      email.length > 254
    ) {
      return res.status(400).json({
        error: "Enter your full name and a valid email address.",
      });
    }

    // Unique reference, within Netcash's 25-character limit.
    const reference =
      `MG${Date.now().toString(36).toUpperCase()}` +
      randomInt(0, 0xffffff)
        .toString(36)
        .toUpperCase()
        .padStart(5, "0");

    // Save pending payment before redirecting to Netcash.
    createPaymentTransaction({
      reference,
      email,
      amount,
      description: purpose,
    });

    const fields = {
      m1: netcashServiceKey(),
      m2: netcashVendorKey(),
      p2: reference,
      p3: purpose,
      p4: amount.toFixed(2),
      Budget: "Y",
      m9: email,
      submit: "Pay Now",
    };

    return res.status(201).json({
      provider: "Netcash",
      redirectUrl: NETCASH_PAYNOW_URL,
      fields,
      reference,
    });
  } catch (error) {
    console.error("Netcash checkout error:", error);

    res.status(500).json({
      error: "Unable to prepare your Netcash payment.",
    });
  }
});

// Verify the notification directly with Netcash.
// A browser return is never treated as proof of payment.
const verifyNetcashTransaction = async ({
  requestTrace,
  reference,
  amount,
}) => {
  if (
    !requestTrace ||
    !reference ||
    !Number.isFinite(amount)
  ) {
    return {
      matches: false,
      accepted: false,
    };
  }

  const verificationUrl = new URL(
    "https://ws.netcash.co.za/PayNow/TransactionStatus/Check"
  );

  verificationUrl.searchParams.set(
    "RequestTrace",
    requestTrace
  );

  const response = await fetch(verificationUrl, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error(
      `Netcash verification returned HTTP ${response.status}`
    );
  }

  const result = await response.json();

  const accepted =
    result.TransactionAccepted === true ||
    String(result.TransactionAccepted).toLowerCase() === "true";

  const returnedReference = String(
    result.Reference || ""
  );

  const returnedTrace = String(
    result.RequestTrace || ""
  );

  const returnedAmount = Number(result.Amount);

  const sameAmount =
    Number.isFinite(returnedAmount) &&
    Math.round(returnedAmount * 100) ===
      Math.round(amount * 100);

  return {
    matches:
      returnedReference === reference &&
      returnedTrace === requestTrace &&
      sameAmount,
    accepted,
  };
};

// Netcash server-to-server notification.
// Successful and unsuccessful transactions can be reported here.
app.post(
  "/api/payments/netcash-notify",
  async (req, res) => {
    try {
      const reference = String(
        req.body.Reference || ""
      ).trim();

      const requestTrace = String(
        req.body.RequestTrace || ""
      ).trim();

      const amount = Number(req.body.Amount);

      const notificationAccepted =
        String(
          req.body.TransactionAccepted
        ).toLowerCase() === "true";

      const paymentMethod = String(
        req.body.Method || ""
      ).trim();

      if (
        !reference ||
        !requestTrace ||
        !Number.isFinite(amount)
      ) {
        return res.status(400).send(
          "Invalid Netcash notification"
        );
      }

      const payment =
        getPaymentTransactionByReference(reference);

      if (!payment) {
        console.warn(
          "Netcash notification for unknown reference:",
          reference
        );

        return res.status(404).send(
          "Payment reference not found"
        );
      }

      // Compare notification amount with original checkout amount.
      if (
        Math.round(payment.amount * 100) !==
        Math.round(amount * 100)
      ) {
        console.warn(
          "Netcash amount mismatch:",
          reference
        );

        return res.status(400).send(
          "Payment amount mismatch"
        );
      }

      // Verify reference, trace and amount directly with Netcash.
      const verification =
        await verifyNetcashTransaction({
          requestTrace,
          reference,
          amount,
        });

      if (
        !verification.matches ||
        verification.accepted !== notificationAccepted
      ) {
        console.warn(
          "Netcash transaction verification failed:",
          reference
        );

        return res.status(400).send(
          "Netcash verification failed"
        );
      }

      if (!verification.accepted) {
        failPaymentTransaction(reference);

        return res.status(200).send(
          "Declined payment recorded"
        );
      }

      const result = completePaymentTransaction({
        reference,
        requestTrace,
        paymentMethod,
      });

      if (!result.success) {
        console.error(
          "Could not complete Netcash payment:",
          result.reason
        );

        return res.status(500).send(
          "Unable to record payment"
        );
      }

      console.log(
        result.alreadyPaid
          ? `Duplicate Netcash notification received: ${reference}`
          : `Netcash payment verified and recorded: ${reference}`
      );

      return res.status(200).send("OK");
    } catch (error) {
      console.error(
        "Netcash notification error:",
        error
      );

      // A server error allows the provider to retry notification.
      return res.status(500).send(
        "Unable to process Netcash notification"
      );
    }
  }
);

// Browser return routes display status only.
// They never mark a payment as paid.
const redirectToPaymentPage = (
  res,
  status,
  reference
) => {
  const destination = new URL(
    "/payments",
    getAppBaseUrl()
  );

  destination.searchParams.set(
    "payment",
    status
  );

  if (reference) {
    destination.searchParams.set(
      "reference",
      reference
    );
  }

  return res.redirect(
    303,
    destination.toString()
  );
};

app.post(
  "/api/payments/netcash-accept",
  (req, res) => {
    const reference = String(
      req.body.Reference || ""
    ).trim();

    return redirectToPaymentPage(
      res,
      "processing",
      reference
    );
  }
);

app.post(
  "/api/payments/netcash-decline",
  (req, res) => {
    const reference = String(
      req.body.Reference || ""
    ).trim();

    return redirectToPaymentPage(
      res,
      "failed",
      reference
    );
  }
);

app.post(
  "/api/payments/netcash-redirect",
  (req, res) => {
    const reference = String(
      req.body.Reference || ""
    ).trim();

    return redirectToPaymentPage(
      res,
      "processing",
      reference
    );
  }
);

// ==========================================
// GOOGLE SHEETS PAYMENT SYNC
// ==========================================

app.get("/api/payments/sync", async (req, res) => {
  try {
    const spreadsheetId =
      process.env.GOOGLE_SHEETS_ID;

    const sheetName =
      process.env.GOOGLE_SHEETS_NAME || "Sheet1";

    if (!spreadsheetId) {
      return res.status(400).json({
        error:
          "Google Sheets ID not configured in environment variables",
      });
    }

    const payments = await getPaymentUpdates(
      spreadsheetId,
      sheetName
    );

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

// ==========================================
// GOOGLE SHEETS AUTHENTICATION URL
// ==========================================

app.get(
  "/api/auth/google-sheets-url",
  async (req, res) => {
    try {
      const authUrl = await getAuthUrl();

      res.json({ authUrl });
    } catch (error) {
      res.status(500).json({
        error: "Failed to generate auth URL",
        details: error.message,
      });
    }
  }
);

// ==========================================
// GOOGLE SHEETS AUTHENTICATION CALLBACK
// ==========================================

app.post(
  "/api/auth/google-sheets-callback",
  async (req, res) => {
    try {
      const { code } = req.body;

      if (!code) {
        return res.status(400).json({
          error: "Authorization code required",
        });
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
  }
);

// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// ==========================================
// START SERVER
// ==========================================

await ensureDefaultAdminAccount();
await ensureDefaultManagementAccount();

app.listen(PORT, () => {
  console.log(
    `Backend server running on http://localhost:${PORT}`
  );

  console.log(
    `Payment sync endpoint: http://localhost:${PORT}/api/payments/sync`
  );

  console.log(
    `Netcash configured: ${netcashConfigured() ? "YES" : "NO"}`
  );
});
