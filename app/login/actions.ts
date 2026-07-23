"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { loginSchema } from "@/lib/auth/schema";
import { verifyPassword } from "@/lib/auth/password";
import { createSession, destroySession } from "@/lib/auth/session";
import { isLoginRateLimited, resetLoginRateLimit } from "@/lib/auth/rate-limit";

const GENERIC_ERROR = "Invalid credentials.";
const RATE_LIMIT_ERROR = "Too many attempts. Please try again later.";

async function getClientIp(): Promise<string> {
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || "unknown";
}

export async function loginAction(prevState: unknown, formData: FormData) {
  const ip = await getClientIp();

  if (isLoginRateLimited(ip)) {
    return { error: RATE_LIMIT_ERROR };
  }

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: GENERIC_ERROR };
  }

  const { email, password } = parsed.data;

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!adminEmail || !adminPasswordHash) {
    console.error(
      "Chýbajú premenné prostredia ADMIN_EMAIL / ADMIN_PASSWORD_HASH."
    );
    return { error: GENERIC_ERROR };
  }

  // bcrypt.compare sa vždy vykoná (aj pri nesprávnom emaile), aby sme
  // predišli časovému úniku informácie o tom, ktoré pole bolo nesprávne.
  const isPasswordValid = await verifyPassword(password, adminPasswordHash);
  const isEmailValid = email === adminEmail;

  if (!isEmailValid || !isPasswordValid) {
    return { error: GENERIC_ERROR };
  }

  resetLoginRateLimit(ip);
  await createSession(email);
  redirect("/crm");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}
