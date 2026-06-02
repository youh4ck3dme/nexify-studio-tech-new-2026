"use server";

import { cookies } from "next/headers";
import { SignJWT } from "jose";
import { redirect } from "next/navigation";

export async function loginAction(prevState: unknown, formData: FormData) {
  const password = formData.get("password");

  // Lokálny hardcoded bypass podľa požiadavky
  if (password !== "23513900") {
    return { error: "Nesprávny bezpečnostný kód" };
  }

  const secretString = process.env.JWT_SECRET;
  if (!secretString) {
    return { error: "Systémová chyba: Chýba podpisový kľúč." };
  }

  // Generujeme kryptografický JWT token, ktorý oklame Sentinel Engine
  const secret = new TextEncoder().encode(secretString);
  const token = await new SignJWT({ sub: "local-admin", role: "authenticated" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret);

  // Uložíme token do cookies s rovnakým menom, aké očakáva Sentinel (sb-auth-token)
  const cookieStore = await cookies();
  cookieStore.set({
    name: "sb-auth-token",
    value: token,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 24 hodín
    sameSite: "lax",
  });

  // Po úspešnej autentifikácii pustíme používateľa dnu
  redirect("/crm");
}

export async function loginWithGoogleAction(email: string) {
  const secretString = process.env.JWT_SECRET;
  if (!secretString) {
    return { error: "Systémová chyba: Chýba podpisový kľúč." };
  }

  // Generujeme kryptografický JWT token pre Sentinel Engine
  const secret = new TextEncoder().encode(secretString);
  const token = await new SignJWT({ sub: email, role: "authenticated", provider: "google" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set({
    name: "sb-auth-token",
    value: token,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 24 hodín
    sameSite: "lax",
  });

  return { success: true };
}
