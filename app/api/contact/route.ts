import { NextResponse } from "next/server";
import { Resend } from "resend";
import { sendContactEmail } from "@/lib/contact/send-email";
import { parseContactPayload, type ContactPayload } from "@/lib/contact/validate";

function getContactConfig() {
  return {
    resendApiKey: process.env.RESEND_API_KEY,
    toEmail: process.env.CONTACT_TO_EMAIL,
    copyEmail: process.env.CONTACT_COPY_EMAIL,
    fromEmail: process.env.CONTACT_FROM_EMAIL,
  };
}

export async function POST(request: Request) {
  let payload: ContactPayload;
  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const parsed = parseContactPayload(payload);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  }

  const { resendApiKey, fromEmail, toEmail, copyEmail } = getContactConfig();

  if (!resendApiKey || !fromEmail || !toEmail) {
    return NextResponse.json(
      { error: "Server is missing email configuration." },
      { status: 500 }
    );
  }

  const resend = new Resend(resendApiKey);

  try {
    await sendContactEmail(resend, parsed.data, {
      fromEmail,
      toEmail,
      copyEmail,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Email sa nepodarilo odoslať." },
      { status: 502 }
    );
  }
}
