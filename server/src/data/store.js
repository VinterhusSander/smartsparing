import crypto from "crypto";
import { pool } from "./db.js";

/**
 * Goals holdes in-memory foreløpig (ikke krav i denne ukens oppgave)
 */
const goalsByUserId = new Map(); // userId -> Array<goal>

/**
 * Helpers
 */
function mapDbUser(row) {
  return {
    id: row.id,
    username: row.username,
    passwordHash: row.password_hash,
    createdAt: new Date(row.created_at).toISOString(),
    consent: {
      tosVersion: row.tos_version,
      privacyVersion: row.privacy_version,
      acceptedTosAt: new Date(row.accepted_tos_at).toISOString(),
      acceptedPrivacyAt: new Date(row.accepted_privacy_at).toISOString(),
    },
  };
}

/**
 * USERS (PostgreSQL når pool finnes)
 */
export async function findUserByUsername(username) {
  if (!pool) return null;

  const result = await pool.query(
    `SELECT * FROM users WHERE username = $1 LIMIT 1`,
    [username]
  );
  const row = result.rows[0];
  return row ? mapDbUser(row) : null;
}

export async function createUser({ username, passwordHash, consent }) {
  if (!pool) throw new Error("DB_NOT_CONFIGURED");

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  await pool.query(
    `
    INSERT INTO users (
      id, username, password_hash, created_at,
      tos_version, privacy_version, accepted_tos_at, accepted_privacy_at
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    `,
    [
      id,
      username,
      passwordHash,
      createdAt,
      consent.tosVersion,
      consent.privacyVersion,
      consent.acceptedTosAt,
      consent.acceptedPrivacyAt,
    ]
  );

  return {
    id,
    username,
    passwordHash,
    createdAt,
    consent,
  };
}

export async function createTokenForUser(userId) {
  if (!pool) throw new Error("DB_NOT_CONFIGURED");

  const token = crypto.randomBytes(32).toString("hex");
  const createdAt = new Date().toISOString();

  await pool.query(
    `INSERT INTO tokens (token, user_id, created_at) VALUES ($1,$2,$3)`,
    [token, userId, createdAt]
  );

  return token;
}

export async function getUserByToken(token) {
  if (!pool) return null;

  const result = await pool.query(
    `
    SELECT u.*
    FROM tokens t
    JOIN users u ON u.id = t.user_id
    WHERE t.token = $1
    LIMIT 1
    `,
    [token]
  );

  const row = result.rows[0];
  return row ? mapDbUser(row) : null;
}

export async function deleteUserById(userId) {
  if (!pool) return false;

  // Tokens slettes automatisk pga ON DELETE CASCADE
  const result = await pool.query(
    `DELETE FROM users WHERE id = $1 RETURNING id`,
    [userId]
  );

  return result.rowCount > 0;
}

/**
 * GOALS (in-memory)
 */
export function getGoalsForUser(userId) {
  return goalsByUserId.get(userId) ?? [];
}

export function addGoalForUser(userId, goal) {
  const goals = goalsByUserId.get(userId) ?? [];
  goals.push(goal);
  goalsByUserId.set(userId, goals);
}

export function deleteGoalsForUser(userId) {
  goalsByUserId.delete(userId);
}