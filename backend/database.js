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
`);

export function findAccountByEmail(email) {
  return database
    .prepare("SELECT * FROM accounts WHERE email = ?")
    .get(email);
}

export function createAccount({ fullName, surname, email, passwordHash }) {
  const result = database
    .prepare(`
      INSERT INTO accounts
        (full_name, surname, email, password_hash, role, created_at)
      VALUES (?, ?, ?, ?, 'Admin', ?)
    `)
    .run(
      fullName,
      surname,
      email,
      passwordHash,
      new Date().toISOString()
    );

  return database
    .prepare("SELECT id, full_name, surname, email, role, created_at FROM accounts WHERE id = ?")
    .get(result.lastInsertRowid);
}

export function closeDatabase() {
  database.close();
}