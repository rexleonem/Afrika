import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { ApiUser } from "./types.js";

const COOKIE_NAME = "afrika_session";

function authSecret() {
  return process.env.AUTH_SECRET ?? "afrika-dev-auth-secret";
}

export function hashPassword(password: string, salt = randomBytes(16).toString("hex")) {
  const hash = scryptSync(password, salt, 64).toString("hex");
  return { salt, hash };
}

export function verifyPassword(password: string, salt: string, expectedHash: string) {
  const derived = scryptSync(password, salt, 64).toString("hex");
  return timingSafeEqual(Buffer.from(derived, "hex"), Buffer.from(expectedHash, "hex"));
}

function sign(userId: string) {
  return createHmac("sha256", authSecret()).update(userId).digest("hex");
}

function isProduction() {
  return process.env.NODE_ENV === "production";
}

export function createSessionToken(userId: string) {
  return `${userId}.${sign(userId)}`;
}

export function verifySessionToken(token?: string | null) {
  if (!token) return null;
  const [userId, signature] = token.split(".");
  if (!userId || !signature) return null;
  const expected = sign(userId);
  if (expected.length !== signature.length) return null;
  if (!timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(expected, "hex"))) return null;
  return userId;
}

export function parseCookie(header?: string) {
  const pairs = new Map<string, string>();
  if (!header) return pairs;
  for (const chunk of header.split(";")) {
    const [rawKey, ...rest] = chunk.trim().split("=");
    if (!rawKey) continue;
    pairs.set(rawKey, decodeURIComponent(rest.join("=") ?? ""));
  }
  return pairs;
}

export function readSessionUserId(request: FastifyRequest) {
  const authHeader = request.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice("Bearer ".length).trim();
    const userId = verifySessionToken(token);
    if (userId) return userId;
  }

  const cookies = parseCookie(request.headers.cookie);
  return verifySessionToken(cookies.get(COOKIE_NAME));
}

export function setSessionCookie(reply: FastifyReply, userId: string) {
  const token = createSessionToken(userId);
  const secure = isProduction();
  const sameSite = secure ? "None" : "Lax";
  reply.header(
    "Set-Cookie",
    `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=${sameSite};${secure ? " Secure;" : " "} Max-Age=${60 * 60 * 24 * 30}`
  );
}

export function clearSessionCookie(reply: FastifyReply) {
  const secure = isProduction();
  const sameSite = secure ? "None" : "Lax";
  reply.header("Set-Cookie", `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=${sameSite};${secure ? " Secure;" : " "} Max-Age=0`);
}

export function sanitizeUser(user: ApiUser) {
  const { passwordHash: _passwordHash, passwordSalt: _passwordSalt, ...safeUser } = user;
  return safeUser;
}
