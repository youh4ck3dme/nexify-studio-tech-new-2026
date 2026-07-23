import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { JWT_ALG, SESSION_MAX_AGE_SECONDS } from "./config";

export type SessionPayload = JWTPayload & {
  sub: string;
  role: "admin";
};

function getSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("JWT_SECRET nie je nakonfigurovaný alebo je príliš krátky.");
  }
  return new TextEncoder().encode(secret);
}

export async function signSessionToken(email: string): Promise<string> {
  return new SignJWT({ sub: email, role: "admin" })
    .setProtectedHeader({ alg: JWT_ALG })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (typeof payload.sub !== "string" || payload.role !== "admin") {
      return null;
    }
    return payload as SessionPayload;
  } catch {
    return null;
  }
}
