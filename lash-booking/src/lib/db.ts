import "server-only";
import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

// Single SQLite file, opened once per process. node:sqlite is synchronous, which is
// what makes slot reservation race-free here: check-and-insert runs inside one
// transaction and nothing else can interleave within this process.
// Trade-off: one server process only. Moving to Postgres later means rewriting
// src/lib/store.ts (every query lives there), nothing else.

const g = globalThis as unknown as { __lashDb?: DatabaseSync };

function open(): DatabaseSync {
  const file = resolve(/*turbopackIgnore: true*/ process.env.DATABASE_PATH || "./data/lash.db");
  mkdirSync(dirname(file), { recursive: true });
  const db = new DatabaseSync(file);
  db.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;");
  migrate(db);
  return db;
}

function migrate(db: DatabaseSync) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS services (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      name         TEXT    NOT NULL,
      description  TEXT    NOT NULL DEFAULT '',
      duration_min INTEGER NOT NULL,
      price        INTEGER NOT NULL,
      active       INTEGER NOT NULL DEFAULT 1,
      sort         INTEGER NOT NULL DEFAULT 0,
      created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS closed_days (
      date   TEXT PRIMARY KEY,
      reason TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      code          TEXT    NOT NULL UNIQUE,
      service_id    INTEGER REFERENCES services(id) ON DELETE SET NULL,
      service_name  TEXT    NOT NULL,
      date          TEXT    NOT NULL,
      start_min     INTEGER NOT NULL,
      end_min       INTEGER NOT NULL,
      customer_name TEXT    NOT NULL,
      phone         TEXT    NOT NULL,
      note          TEXT    NOT NULL DEFAULT '',
      price         INTEGER NOT NULL,
      amount        INTEGER NOT NULL,
      status        TEXT    NOT NULL,
      authority     TEXT,
      ref_id        TEXT,
      expires_at    INTEGER,
      paid_at       TEXT,
      created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS bookings_date ON bookings(date, status);
    CREATE INDEX IF NOT EXISTS bookings_phone ON bookings(phone);
    CREATE INDEX IF NOT EXISTS bookings_authority ON bookings(authority);
  `);

  const count = db.prepare("SELECT COUNT(*) AS n FROM services").get() as { n: number };
  if (count.n === 0) {
    const ins = db.prepare(
      "INSERT INTO services (name, description, duration_min, price, sort) VALUES (?, ?, ?, ?, ?)",
    );
    ins.run("کاشت مژه کلاسیک", "یک مژه‌ی مصنوعی روی هر مژه‌ی طبیعی؛ طبیعی و سبک", 120, 850000, 1);
    ins.run("کاشت مژه والیوم", "چند مژه‌ی بسیار نازک روی هر مژه؛ پرپشت و حجیم", 150, 1200000, 2);
    ins.run("ترمیم مژه", "پر کردن جاهای خالی تا ۳ هفته بعد از کاشت", 75, 550000, 3);
    ins.run("لیفت و لمینت مژه", "فر و حالت‌دهی مژه‌ی طبیعی بدون اکستنشن", 60, 650000, 4);
    ins.run("برداشتن مژه", "برداشتن اصولی و بی‌آسیب اکستنشن", 30, 200000, 5);
  }
}

export function db(): DatabaseSync {
  if (!g.__lashDb) g.__lashDb = open();
  return g.__lashDb;
}

/** Runs fn inside BEGIN IMMEDIATE … COMMIT, rolling back on throw. */
export function tx<T>(fn: (d: DatabaseSync) => T): T {
  const d = db();
  d.exec("BEGIN IMMEDIATE");
  try {
    const out = fn(d);
    d.exec("COMMIT");
    return out;
  } catch (e) {
    d.exec("ROLLBACK");
    throw e;
  }
}
