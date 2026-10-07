import Database from "better-sqlite3";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const databasePath = process.env.DATABASE_PATH || path.join(currentDirectory, "mabote.sqlite");
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
    token_hash TEXT PRIMARY KEY,
    account_id INTEGER NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS password_reset_tokens_account_id
    ON password_reset_tokens(account_id);
`);

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
    .prepare("SELECT id, full_name, surname, email, role, created_at FROM accounts WHERE id = ?")
    .get(result.lastInsertRowid);
}

export function createPasswordResetToken(accountId, tokenHash, expiresAt) {
  const insertToken = database.transaction(() => {
    database
      .prepare("DELETE FROM password_reset_tokens WHERE account_id = ?")
      .run(accountId);

    database
      .prepare(`
        INSERT INTO password_reset_tokens (token_hash, account_id, expires_at, created_at)
        VALUES (?, ?, ?, ?)
      `)
      .run(tokenHash, accountId, expiresAt, new Date().toISOString());
  });

  insertToken();
}

export function consumePasswordResetToken(tokenHash, passwordHash, now) {
  const resetPassword = database.transaction(() => {
    const token = database
      .prepare(`
        SELECT account_id
        FROM password_reset_tokens
        WHERE token_hash = ? AND expires_at > ?
      `)
      .get(tokenHash, now);

    if (!token) return false;

    const result = database
      .prepare("UPDATE accounts SET password_hash = ? WHERE id = ?")
      .run(passwordHash, token.account_id);

    if (result.changes === 0) return false;

    database
      .prepare("DELETE FROM password_reset_tokens WHERE account_id = ?")
      .run(token.account_id);

    return true;
  });

  return resetPassword();
}

export function deletePasswordResetToken(tokenHash) {
  database
    .prepare("DELETE FROM password_reset_tokens WHERE token_hash = ?")
    .run(tokenHash);
}

export function setAccountRole(email, role) {
  const result = database
    .prepare("UPDATE accounts SET role = ? WHERE email = ?")
    .run(role, email);

  return result.changes > 0;
}

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
    .prepare("SELECT application_json FROM applications ORDER BY created_at DESC")
    .all()
    .map((row) => JSON.parse(row.application_json));
}

export function listApplicationsForEmail(email) {
  return database
    .prepare("SELECT application_json FROM applications WHERE email = ? ORDER BY created_at DESC")
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

export function saveContribution(contribution) {
  const now = new Date().toISOString();
  database
    .prepare(`
      INSERT INTO contributions (id, email, contribution_json, created_at, updated_at)
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
    .prepare("SELECT contribution_json FROM contributions ORDER BY created_at DESC")
    .all()
    .map((row) => JSON.parse(row.contribution_json));
}

export function listContributionsForEmail(email) {
  return database
    .prepare("SELECT contribution_json FROM contributions WHERE email = ? ORDER BY created_at DESC")
    .all(String(email || "").trim().toLowerCase())
    .map((row) => JSON.parse(row.contribution_json));
}

export function saveClaim(claim) {
  const now = new Date().toISOString();
  database
    .prepare(`
      INSERT INTO claims (id, email, claim_json, created_at, updated_at)
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
    .prepare("SELECT claim_json FROM claims ORDER BY created_at DESC")
    .all()
    .map((row) => JSON.parse(row.claim_json));
}

export function listClaimsForEmail(email) {
  return database
    .prepare("SELECT claim_json FROM claims WHERE email = ? ORDER BY created_at DESC")
    .all(String(email || "").trim().toLowerCase())
    .map((row) => JSON.parse(row.claim_json));
}

export function closeDatabase() {
  database.close();
}