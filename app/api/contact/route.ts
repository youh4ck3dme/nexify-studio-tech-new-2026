import { NextResponse } from "next/server";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;

const toEmail = process.env.CONTACT_TO_EMAIL || "magicasro@hotmail.com";
const copyEmail = process.env.CONTACT_COPY_EMAIL || "erikbabcan@gmail.com";
const fromEmail = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  message?: unknown;
};

function asNonEmptyString(value: unknown) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  let payload: ContactPayload;
  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const name = asNonEmptyString(payload.name);
  const email = asNonEmptyString(payload.email);
  const phone = asNonEmptyString(payload.phone) || "Neuvedené";
  const message = asNonEmptyString(payload.message);

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Meno, email a správa sú povinné." },
      { status: 400 }
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Neplatný email." }, { status: 400 });
  }

  if (!resendApiKey) {
    return NextResponse.json(
      { error: "Server is missing RESEND_API_KEY configuration." },
      { status: 500 }
    );
  }

  const resend = new Resend(resendApiKey);
  const subject = `Nová správa z webu - ${name}`;
  const text = [
    "Nový kontakt z formulára",
    `Meno: ${name}`,
    `Email: ${email}`,
    `Telefón: ${phone}`,
    "",
    "Správa:",
    message,
  ].join("\n");

  try {
    await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      cc: [copyEmail],
      replyTo: email,
      subject,
      text,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Email sa nepodarilo odoslať." },
      { status: 502 }
    );
  }
}
