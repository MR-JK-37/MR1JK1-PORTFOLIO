import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const BCRYPT_ROUNDS = 12;
const SESSION_EXPIRY = "24h";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signSession(adminId: string): string {
  return jwt.sign({ adminId }, JWT_SECRET, { expiresIn: SESSION_EXPIRY });
}

export function verifySession(
  token: string
): { adminId: string } | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { adminId: string };
    return payload;
  } catch {
    return null;
  }
}

export const COOKIE_NAME = "mrjk_admin_session";

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  };
}
