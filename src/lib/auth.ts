import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { timingSafeEqual } from "crypto";

export const SESSION_COOKIE = "ss_admin_session";
const EXPIRES = "7d";

function getSecret(): Uint8Array {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET is not configured");
  return new TextEncoder().encode(s);
}

export async function createSessionToken(email: string): Promise<string> {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(EXPIRES)
    .sign(getSecret());
}

export async function verifySessionToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return (payload.email as string) ?? null;
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<string | null> {
  try {
    const store = await cookies();
    const token = store.get(SESSION_COOKIE)?.value;
    if (!token) return null;
    return verifySessionToken(token);
  } catch {
    return null;
  }
}

export async function setAdminSession(email: string): Promise<void> {
  const token = await createSessionToken(email);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });
}

export async function clearAdminSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export function verifyAdminCredentials(email: string, password: string): boolean {
  const adminEmail = process.env.ADMIN_EMAIL ?? "";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "";

  if (!adminEmail || !adminPassword) return false;

  try {
    const emailA = Buffer.from(email.padEnd(adminEmail.length));
    const emailB = Buffer.from(adminEmail);
    const passA = Buffer.from(password.padEnd(adminPassword.length));
    const passB = Buffer.from(adminPassword);

    const emailMatch =
      email.length === adminEmail.length && timingSafeEqual(emailA, emailB);
    const passMatch =
      password.length === adminPassword.length && timingSafeEqual(passA, passB);

    return emailMatch && passMatch;
  } catch {
    return false;
  }
}
