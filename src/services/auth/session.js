import crypto from "node:crypto";

export const SESSION_COOKIE = "jonjobs_session";

function getSecret() {
  return process.env.SESSION_SECRET || "dev-only-session-secret-change-me";
}

function base64Url(input) {
  return Buffer.from(input).toString("base64url");
}

function sign(payload) {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

export function createSessionToken(username) {
  const payload = base64Url(JSON.stringify({ username, createdAt: Date.now() }));
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token) {
  if (!token || !token.includes(".")) return false;
  const [payload, signature] = token.split(".");
  const expected = sign(payload);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (actualBuffer.length !== expectedBuffer.length) return false;
  return crypto.timingSafeEqual(actualBuffer, expectedBuffer);
}

export function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export function verifyPassword(password, expectedHash) {
  if (!password || !expectedHash) return false;
  const actual = hashPassword(password);
  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expectedHash);
  if (actualBuffer.length !== expectedBuffer.length) return false;
  return crypto.timingSafeEqual(actualBuffer, expectedBuffer);
}
