import crypto from "crypto";

// In-memory store (no database).
// Data forsvinner når serveren restartes – helt ok for denne oppgaven.

const store = {
  users: new Map(),        // userId -> user
  usernameToId: new Map(), // username -> userId
  tokens: new Map(),       // token -> userId
  goalsByUserId: new Map(), // userId -> Array<goal>

};

export function generateId() {
  return crypto.randomUUID();
}

export function generateToken() {
  // 32 bytes => 64 hex chars
  return crypto.randomBytes(32).toString("hex");
}

export function findUserByUsername(username) {
  const userId = store.usernameToId.get(username);
  if (!userId) return null;
  return store.users.get(userId) ?? null;
}

export function createUser({ username, passwordHash, consent }) {
  if (store.usernameToId.has(username)) {
    const err = new Error("USERNAME_TAKEN");
    err.code = "USERNAME_TAKEN";
    throw err;
  }

  const id = generateId();
  const createdAt = new Date().toISOString();

  const user = {
    id,
    username,
    passwordHash,
    createdAt,
    consent: {
      tosVersion: consent.tosVersion,
      privacyVersion: consent.privacyVersion,
      acceptedTosAt: consent.acceptedTosAt,
      acceptedPrivacyAt: consent.acceptedPrivacyAt,
    },
  };

  store.users.set(id, user);
  store.usernameToId.set(username, id);

  return user;
}

export function createTokenForUser(userId) {
  const token = generateToken();
  store.tokens.set(token, userId);
  return token;
}

export function getUserByToken(token) {
  const userId = store.tokens.get(token);
  if (!userId) return null;
  return store.users.get(userId) ?? null;
}

export function deleteUserById(userId) {
  const user = store.users.get(userId);
  if (!user) return false;

  store.usernameToId.delete(user.username);

  for (const [token, uid] of store.tokens.entries()) {
    if (uid === userId) store.tokens.delete(token);
  }

  store.users.delete(userId);
  return true;
}

//GOALS
export function getGoalsForUser(userId) {
    return store.goalsByUserId.get(userId) ?? [];
  }
  
  export function addGoalForUser(userId, goal) {
    const existing = store.goalsByUserId.get(userId) ?? [];
    existing.push(goal);
    store.goalsByUserId.set(userId, existing);
    return goal;
  }
  
  export function deleteGoalsForUser(userId) {
    store.goalsByUserId.delete(userId);
  }
  

// Kun for debugging i dev (kan fjernes senere)
export function _debugDump() {
  return {
    users: Array.from(store.users.values()).map(u => ({
      id: u.id,
      username: u.username,
      createdAt: u.createdAt,
      consent: u.consent,
    })),
    tokensCount: store.tokens.size,
  };
}
