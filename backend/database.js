
import Database from "better-sqlite3";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));

const databasePath =
  process.env.DATABASE_PATH || path.join(currentDirectory, "mabote.sqlite");

const database = new Database(databasePath);

database.pragma("journal_mode = WAL");

database.exec(`
  CREATE TABLE IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    surname TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Admin',
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    application_number TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending',
    application_json TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS contributions (
    id INTEGER PRIMARY KEY,
    email TEXT NOT NULL DEFAULT '',
    contribution_json TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS claims (
    id INTEGER PRIMARY KEY,
    email TEXT NOT NULL DEFAULT '',
    claim_json TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    account_id INTEGER NOT NULL,
    token_hash TEXT NOT NULL UNIQUE,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_reset_account
  ON password_reset_tokens(account_id);

  CREATE INDEX IF NOT EXISTS idx_reset_expiry
  ON password_reset_tokens(expires_at);

  CREATE TABLE IF NOT EXISTS payment_transactions (
    reference TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    amount_cents INTEGER NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'Pending',
    request_trace TEXT,
    payment_method TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    paid_at TEXT
  );

  CREATE INDEX IF NOT EXISTS idx_payment_email
  ON payment_transactions(email);

  CREATE INDEX IF NOT EXISTS idx_payment_status
  ON payment_transactions(status);
`);

function mapPaymentRow(row) {
  if (!row) return null;

  return {
    reference: row.reference,
    email: row.email,
    amount: row.amount_cents / 100,
    description: row.description,
    status: row.status,
    requestTrace: row.request_trace,
    paymentMethod: row.payment_method,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    paidAt: row.paid_at,
  };
}

export function findAccountByEmail(email) {
  return database
    .prepare("SELECT * FROM accounts WHERE email = ?")
    .get(email);
}

export function createAccount({
  fullName,
  surname,
  email,
  passwordHash,
  role = "Member",
}) {
  const result = database
    .prepare(`
      INSERT INTO accounts
        (full_name, surname, email, password_hash, role, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    .run(
      fullName,
      surname,
      email,
      passwordHash,
      role,
      new Date().toISOString()
    );

  return database
    .prepare(`
      SELECT id, full_name, surname, email, role, created_at
      FROM accounts
      WHERE id = ?
    `)
    .get(result.lastInsertRowid);
}

export function setAccountRole(email, role) {
  const result = database
    .prepare("UPDATE accounts SET role = ? WHERE email = ?")
    .run(role, email);

  return result.changes > 0;
}

export function setAccountPassword(email, passwordHash) {
  const result = database
    .prepare("UPDATE accounts SET password_hash = ? WHERE email = ?")
    .run(passwordHash, email);

  return result.changes > 0;
}

export function changeAccountPassword(accountId, passwordHash) {
  const result = database
    .prepare("UPDATE accounts SET password_hash = ? WHERE id = ?")
    .run(passwordHash, accountId);

  return result.changes > 0;
}

export function updateAccountEmail(currentEmail, newEmail) {
  const result = database
    .prepare("UPDATE accounts SET email = ? WHERE email = ?")
    .run(newEmail, currentEmail);

  return result.changes > 0;
}

// PASSWORD RECOVERY FUNCTIONS

export function createPasswordResetToken(accountId, tokenHash, expiresAt) {
  const create = database.transaction(() => {
    database
      .prepare("DELETE FROM password_reset_tokens WHERE account_id = ?")
      .run(accountId);

    database
      .prepare(`
        INSERT INTO password_reset_tokens
          (account_id, token_hash, expires_at, created_at)
        VALUES (?, ?, ?, ?)
      `)
      .run(accountId, tokenHash, expiresAt, new Date().toISOString());
  });

  create();

  return true;
}

export function deletePasswordResetToken(tokenHash) {
  const result = database
    .prepare("DELETE FROM password_reset_tokens WHERE token_hash = ?")
    .run(tokenHash);

  return result.changes > 0;
}

export function consumePasswordResetToken(
  tokenHash,
  passwordHash,
  currentTime
) {
  const consume = database.transaction(() => {
    const token = database
      .prepare(`
        SELECT account_id
        FROM password_reset_tokens
        WHERE token_hash = ?
          AND expires_at > ?
      `)
      .get(tokenHash, currentTime);

    if (!token) {
      return false;
    }

    const updated = database
      .prepare(`
        UPDATE accounts
        SET password_hash = ?
        WHERE id = ?
      `)
      .run(passwordHash, token.account_id);

    if (updated.changes !== 1) {
      return false;
    }

    database
      .prepare(`
        DELETE FROM password_reset_tokens
        WHERE token_hash = ?
      `)
      .run(tokenHash);

    return true;
  });

  return consume();
}

export function cleanExpiredPasswordResetTokens(
  currentTime = new Date().toISOString()
) {
  const result = database
    .prepare(`
      DELETE FROM password_reset_tokens
      WHERE expires_at <= ?
    `)
    .run(currentTime);

  return result.changes;
}

// APPLICATION FUNCTIONS

export function createApplication(application) {
  const now = new Date().toISOString();

  const result = database
    .prepare(`
      INSERT INTO applications
        (application_number, email, status, application_json, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    .run(
      application.applicationNumber,
      String(application.email || "").trim().toLowerCase(),
      application.status || "Pending",
      JSON.stringify(application),
      now,
      now
    );

  return getApplicationById(result.lastInsertRowid);
}

export function getApplicationById(id) {
  const row = database
    .prepare("SELECT * FROM applications WHERE id = ?")
    .get(id);

  return row ? JSON.parse(row.application_json) : null;
}

export function listApplications() {
  return database
    .prepare(`
      SELECT application_json
      FROM applications
      ORDER BY created_at DESC
    `)
    .all()
    .map((row) => JSON.parse(row.application_json));
}

export function listApplicationsForEmail(email) {
  return database
    .prepare(`
      SELECT application_json
      FROM applications
      WHERE email = ?
      ORDER BY created_at DESC
    `)
    .all(String(email || "").trim().toLowerCase())
    .map((row) => JSON.parse(row.application_json));
}

export function updateApplication(applicationNumber, changes) {
  const row = database
    .prepare("SELECT * FROM applications WHERE application_number = ?")
    .get(applicationNumber);

  if (!row) return null;

  const application = { ...JSON.parse(row.application_json), ...changes };

  database
    .prepare(`
      UPDATE applications
      SET status = ?, application_json = ?, updated_at = ?
      WHERE application_number = ?
    `)
    .run(
      application.status || row.status,
      JSON.stringify(application),
      new Date().toISOString(),
      applicationNumber
    );

  return application;
}

// CONTRIBUTION FUNCTIONS

export function saveContribution(contribution) {
  const now = new Date().toISOString();

  database
    .prepare(`
      INSERT INTO contributions
        (id, email, contribution_json, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        email = excluded.email,
        contribution_json = excluded.contribution_json,
        updated_at = excluded.updated_at
    `)
    .run(
      contribution.id,
      String(contribution.email || "").trim().toLowerCase(),
      JSON.stringify(contribution),
      now,
      now
    );

  return contribution;
}

export function listContributions() {
  return database
    .prepare(`
      SELECT contribution_json
      FROM contributions
      ORDER BY created_at DESC
    `)
    .all()
    .map((row) => JSON.parse(row.contribution_json));
}

export function listContributionsForEmail(email) {
  return database
    .prepare(`
      SELECT contribution_json
      FROM contributions
      WHERE email = ?
      ORDER BY created_at DESC
    `)
    .all(String(email || "").trim().toLowerCase())
    .map((row) => JSON.parse(row.contribution_json));
}

// CLAIM FUNCTIONS

export function saveClaim(claim) {
  const now = new Date().toISOString();

  database
    .prepare(`
      INSERT INTO claims
        (id, email, claim_json, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        email = excluded.email,
        claim_json = excluded.claim_json,
        updated_at = excluded.updated_at
    `)
    .run(
      claim.id,
      String(claim.email || "").trim().toLowerCase(),
      JSON.stringify(claim),
      now,
      now
    );

  return claim;
}

export function listClaims() {
  return database
    .prepare(`
      SELECT claim_json
      FROM claims
      ORDER BY created_at DESC
    `)
    .all()
    .map((row) => JSON.parse(row.claim_json));
}

export function listClaimsForEmail(email) {
  return database
    .prepare(`
      SELECT claim_json
      FROM claims
      WHERE email = ?
      ORDER BY created_at DESC
    `)
    .all(String(email || "").trim().toLowerCase())
    .map((row) => JSON.parse(row.claim_json));
}

// NETCASH PAYMENT FUNCTIONS

export function createPaymentTransaction({
  reference,
  email,
  amount,
  description = "",
}) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const amountNumber = Number(amount);

  if (!reference || !normalizedEmail) {
    throw new Error("A payment reference and customer email are required.");
  }

  if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
    throw new Error("A valid payment amount is required.");
  }

  const amountCents = Math.round(amountNumber * 100);
  const now = new Date().toISOString();

  database
    .prepare(`
      INSERT INTO payment_transactions
        (reference, email, amount_cents, description, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, 'Pending', ?, ?)
    `)
    .run(
      String(reference),
      normalizedEmail,
      amountCents,
      String(description).slice(0, 50),
      now,
      now
    );

  return getPaymentTransactionByReference(reference);
}

export function getPaymentTransactionByReference(reference) {
  const row = database
    .prepare(`
      SELECT *
      FROM payment_transactions
      WHERE reference = ?
    `)
    .get(String(reference || ""));

  return mapPaymentRow(row);
}

export function completePaymentTransaction({
  reference,
  requestTrace,
  paymentMethod = "",
}) {
  const complete = database.transaction(() => {
    const row = database
      .prepare(`
        SELECT *
        FROM payment_transactions
        WHERE reference = ?
      `)
      .get(String(reference || ""));

    if (!row) {
      return { success: false, reason: "Payment reference not found." };
    }

    if (row.status === "Paid") {
      return {
        success: true,
        alreadyPaid: true,
        payment: mapPaymentRow(row),
      };
    }

    if (row.status !== "Pending") {
      return {
        success: false,
        reason: "Payment is not pending.",
      };
    }

    const now = new Date().toISOString();

    database
      .prepare(`
        UPDATE payment_transactions
        SET status = 'Paid',
            request_trace = ?,
            payment_method = ?,
            updated_at = ?,
            paid_at = ?
        WHERE reference = ?
          AND status = 'Pending'
      `)
      .run(
        String(requestTrace || ""),
        String(paymentMethod || ""),
        now,
        now,
        String(reference)
      );

    // Create one contribution record only after payment verification.
    const contribution = {
      email: row.email,
      amount: row.amount_cents / 100,
      description: row.description,
      status: "Paid",
      paymentMethod: String(paymentMethod || ""),
      paymentReference: row.reference,
      createdAt: now,
      paidAt: now,
    };

    const insertResult = database
      .prepare(`
        INSERT INTO contributions
          (email, contribution_json, created_at, updated_at)
        VALUES (?, ?, ?, ?)
      `)
      .run(
        row.email,
        JSON.stringify(contribution),
        now,
        now
      );

    contribution.id = Number(insertResult.lastInsertRowid);

    database
      .prepare(`
        UPDATE contributions
        SET contribution_json = ?
        WHERE id = ?
      `)
      .run(JSON.stringify(contribution), contribution.id);

    const updatedRow = database
      .prepare(`
        SELECT *
        FROM payment_transactions
        WHERE reference = ?
      `)
      .get(String(reference));

    return {
      success: true,
      alreadyPaid: false,
      payment: mapPaymentRow(updatedRow),
      contribution,
    };
  });

  return complete();
}

export function failPaymentTransaction(reference) {
  const now = new Date().toISOString();

  const result = database
    .prepare(`
      UPDATE payment_transactions
      SET status = 'Failed',
          updated_at = ?
      WHERE reference = ?
        AND status = 'Pending'
    `)
    .run(now, String(reference || ""));

  return result.changes > 0;
}

export function listPaymentTransactionsForEmail(email) {
  return database
    .prepare(`
      SELECT *
      FROM payment_transactions
      WHERE email = ?
      ORDER BY created_at DESC
    `)
    .all(String(email || "").trim().toLowerCase())
    .map(mapPaymentRow);
}

export function closeDatabase() {
  database.close();
}
