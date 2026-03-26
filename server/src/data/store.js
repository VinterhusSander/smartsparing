import crypto from "crypto";
import { pool } from "./db.js";

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

function mapDbGoal(row) {
  return {
    id: row.id,
    title: row.title,
    targetAmount: Number(row.target_amount),
    createdAt: new Date(row.created_at).toISOString(),
  };
}

function mapDbSaving(row) {
  return {
    id: row.id,
    goalId: row.goal_id,
    itemName: row.item_name,
    originalPrice: Number(row.original_price),
    discountPrice: Number(row.discount_price),
    savedAmount: Number(row.saved_amount),
    createdAt: new Date(row.created_at).toISOString(),
  };
}

/**
 * USERS
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

  const result = await pool.query(
    `DELETE FROM users WHERE id = $1 RETURNING id`,
    [userId]
  );

  return result.rowCount > 0;
}

/**
 * GOALS
 */
export async function getGoalsForUser(userId) {
  if (!pool) throw new Error("DB_NOT_CONFIGURED");

  const result = await pool.query(
    `
    SELECT id, title, target_amount, created_at
    FROM goals
    WHERE user_id = $1
    ORDER BY created_at DESC
    `,
    [userId]
  );

  return result.rows.map(mapDbGoal);
}

export async function getGoalsWithProgressForUser(userId) {
  if (!pool) throw new Error("DB_NOT_CONFIGURED");

  const result = await pool.query(
    `
    SELECT
      g.id,
      g.title,
      g.target_amount,
      g.created_at,
      COALESCE(SUM(s.saved_amount), 0) AS saved_so_far
    FROM goals g
    LEFT JOIN savings s
      ON s.goal_id = g.id
      AND s.user_id = g.user_id
    WHERE g.user_id = $1
    GROUP BY g.id, g.title, g.target_amount, g.created_at
    ORDER BY g.created_at DESC
    `,
    [userId]
  );

  return result.rows.map((row) => {
    const targetAmount = Number(row.target_amount);
    const savedSoFar = Number(row.saved_so_far);
    const remainingAmount = Math.max(0, targetAmount - savedSoFar);
    const progressPercent =
      targetAmount > 0 ? Math.min(100, (savedSoFar / targetAmount) * 100) : 0;

    return {
      id: row.id,
      title: row.title,
      targetAmount,
      savedSoFar,
      remainingAmount,
      progressPercent: Number(progressPercent.toFixed(2)),
      createdAt: new Date(row.created_at).toISOString(),
    };
  });
}

export async function addGoalForUser(userId, { title, targetAmount }) {
  if (!pool) throw new Error("DB_NOT_CONFIGURED");

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  await pool.query(
    `
    INSERT INTO goals (id, user_id, title, target_amount, created_at)
    VALUES ($1, $2, $3, $4, $5)
    `,
    [id, userId, title, targetAmount, createdAt]
  );

  return {
    id,
    title,
    targetAmount: Number(targetAmount),
    createdAt,
  };
}

export async function getGoalByIdForUser(userId, goalId) {
  if (!pool) throw new Error("DB_NOT_CONFIGURED");

  const result = await pool.query(
    `
    SELECT id, title, target_amount, created_at
    FROM goals
    WHERE id = $1 AND user_id = $2
    LIMIT 1
    `,
    [goalId, userId]
  );

  const row = result.rows[0];
  return row ? mapDbGoal(row) : null;
}

/**
 * SAVINGS
 */
export async function addSavingForUser(
  userId,
  { goalId = null, itemName, originalPrice, discountPrice, savedAmount }
) {
  if (!pool) throw new Error("DB_NOT_CONFIGURED");

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  await pool.query(
    `
    INSERT INTO savings (
      id, user_id, goal_id, item_name,
      original_price, discount_price, saved_amount, created_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `,
    [
      id,
      userId,
      goalId,
      itemName,
      originalPrice,
      discountPrice,
      savedAmount,
      createdAt,
    ]
  );

  return {
    id,
    goalId,
    itemName,
    originalPrice: Number(originalPrice),
    discountPrice: Number(discountPrice),
    savedAmount: Number(savedAmount),
    createdAt,
  };
}

export async function getSavingsForUser(userId) {
  if (!pool) throw new Error("DB_NOT_CONFIGURED");

  const result = await pool.query(
    `
    SELECT
      id,
      goal_id,
      item_name,
      original_price,
      discount_price,
      saved_amount,
      created_at
    FROM savings
    WHERE user_id = $1
    ORDER BY created_at DESC
    `,
    [userId]
  );

  return result.rows.map(mapDbSaving);
}

export async function getSavingsSummaryForUser(userId) {
  if (!pool) throw new Error("DB_NOT_CONFIGURED");

  const result = await pool.query(
    `
    SELECT
      COUNT(*)::int AS savings_count,
      COALESCE(SUM(saved_amount), 0) AS total_saved,
      COALESCE(SUM(CASE WHEN goal_id IS NOT NULL THEN saved_amount ELSE 0 END), 0) AS total_saved_for_goals,
      COALESCE(SUM(CASE WHEN goal_id IS NULL THEN saved_amount ELSE 0 END), 0) AS total_saved_without_goal
    FROM savings
    WHERE user_id = $1
    `,
    [userId]
  );

  const row = result.rows[0];

  return {
    savingsCount: Number(row.savings_count),
    totalSaved: Number(row.total_saved),
    totalSavedForGoals: Number(row.total_saved_for_goals),
    totalSavedWithoutGoal: Number(row.total_saved_without_goal),
  };
}