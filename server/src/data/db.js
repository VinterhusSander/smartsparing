import pkg from "pg";
const { Pool } = pkg;

const connectionString = process.env.DATABASE_URL;

let pool = null;

if (connectionString) {
  pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false, // required for Render
    },
  });

  console.log("PostgreSQL pool created");
} else {
  console.log("No DATABASE_URL found. Running without PostgreSQL.");
}

async function initDb() {
  if (!pool) return;

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL,
      tos_version TEXT NOT NULL,
      privacy_version TEXT NOT NULL,
      accepted_tos_at TIMESTAMP NOT NULL,
      accepted_privacy_at TIMESTAMP NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tokens (
      token TEXT PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMP NOT NULL
    );
  `);

  console.log("Tables ensured");
}

export { pool, initDb };