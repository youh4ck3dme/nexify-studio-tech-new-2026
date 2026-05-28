import type { ParsedContact } from "./validate";

export type ContactEmailConfig = {
  fromEmail: string;
  toEmail: string;
  copyEmail: string;
};

export type ContactEmailClient = {
  emails: {
    send: (options: {
      from: string;
      to: string[];
      cc?: string[];
      replyTo: string;
      subject: string;
      text: string;
    }) => Promise<unknown>;
  };
};

export function buildContactEmailContent(data: ParsedContact) {
  const subject = `Nová správa z webu - ${data.name}`;
  const text = [
    "Nový kontakt z formulára",
    `Meno: ${data.name}`,
    `Email: ${data.email}`,
    `Telefón: ${data.phone}`,
    "",
    "Správa:",
    data.message,
  ].join("\n");

  return { subject, text };
}

export async function sendContactEmail(
  client: ContactEmailClient,
  data: ParsedContact,
  config: ContactEmailConfig
) {
  const { subject, text } = buildContactEmailContent(data);

  return client.emails.send({
    from: config.fromEmail,
    to: [config.toEmail],
    cc: [config.copyEmail],
    replyTo: data.email,
    subject,
    text,
  });
}
