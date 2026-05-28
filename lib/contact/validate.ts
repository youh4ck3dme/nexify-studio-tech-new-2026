export type ContactPayload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  message?: unknown;
};

export type ParsedContact = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

export type ContactValidationResult =
  | { ok: true; data: ParsedContact }
  | { ok: false; error: string; status: 400 };

export function asNonEmptyString(value: unknown) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function parseContactPayload(
  payload: ContactPayload
): ContactValidationResult {
  const name = asNonEmptyString(payload.name);
  const email = asNonEmptyString(payload.email);
  const phone = asNonEmptyString(payload.phone) || "Neuvedené";
  const message = asNonEmptyString(payload.message);

  if (!name || !email || !message) {
    return {
      ok: false,
      error: "Meno, email a správa sú povinné.",
      status: 400,
    };
  }

  if (!isValidEmail(email)) {
    return {
      ok: false,
      error: "Neplatný email.",
      status: 400,
    };
  }

  return {
    ok: true,
    data: { name, email, phone, message },
  };
}
