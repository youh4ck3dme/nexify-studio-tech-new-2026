import type { ParsedContact } from "./validate";

export type ContactEmailConfig = {
  fromEmail: string;
  toEmail: string;
  copyEmail?: string;
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
      html?: string;
    }) => Promise<unknown>;
  };
};

export function buildContactEmailContent(data: ParsedContact) {
  const subject = `Nová správa z webu - ${data.name}`;
  
  // Obyčajný text pre fallback
  const text = [
    "Nový kontakt z formulára",
    `Meno: ${data.name}`,
    `Email: ${data.email}`,
    `Telefón: ${data.phone}`,
    "",
    "Správa:",
    data.message,
  ].join("\n");

  // HTML šablóna v štýle Nexify Studio (Apple-grade clarity)
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #F5F5F7;
            color: #1D1D1F;
            margin: 0;
            padding: 40px 20px;
            line-height: 1.6;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border: 1px solid #E5E5EA;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 24px -12px rgba(0,0,0,0.08);
          }
          .header {
            margin-bottom: 32px;
            border-bottom: 1px solid #E5E5EA;
            padding-bottom: 24px;
          }
          .logo {
            font-size: 20px;
            font-weight: 700;
            letter-spacing: -0.5px;
            margin: 0;
            color: #1D1D1F;
          }
          .title {
            font-size: 24px;
            font-weight: 600;
            margin: 16px 0 0 0;
            letter-spacing: -0.5px;
          }
          .section {
            margin-bottom: 24px;
          }
          .label {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #6E6E73;
            margin-bottom: 4px;
            font-weight: 600;
          }
          .value {
            font-size: 16px;
            font-weight: 500;
            color: #1D1D1F;
            margin: 0;
          }
          .message-box {
            background-color: #F5F5F7;
            border-radius: 8px;
            padding: 20px;
            margin-top: 8px;
            font-size: 15px;
            color: #424245;
            white-space: pre-wrap;
          }
          .footer {
            margin-top: 40px;
            padding-top: 24px;
            border-top: 1px solid #E5E5EA;
            font-size: 13px;
            color: #6E6E73;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <p class="logo">Nexify Studio</p>
            <h1 class="title">Nová správa z webu</h1>
          </div>
          
          <div class="section">
            <div class="label">Meno klienta</div>
            <p class="value">${data.name}</p>
          </div>
          
          <div class="section">
            <div class="label">Kontaktný e-mail</div>
            <p class="value"><a href="mailto:${data.email}" style="color: #0066cc; text-decoration: none;">${data.email}</a></p>
          </div>
          
          <div class="section">
            <div class="label">Telefónne číslo</div>
            <p class="value">${data.phone}</p>
          </div>
          
          <div class="section">
            <div class="label">Obsah správy</div>
            <div class="message-box">${data.message}</div>
          </div>
          
          <div class="footer">
            Tento e-mail bol automaticky vygenerovaný z kontaktného formulára na webe Nexify Studio.
          </div>
        </div>
      </body>
    </html>
  `;

  return { subject, text, html };
}

export async function sendContactEmail(
  client: ContactEmailClient,
  data: ParsedContact,
  config: ContactEmailConfig
) {
  const { subject, text, html } = buildContactEmailContent(data);

  return client.emails.send({
    from: config.fromEmail,
    to: [config.toEmail],
    ...(config.copyEmail ? { cc: [config.copyEmail] } : {}),
    replyTo: data.email,
    subject,
    text,
    html,
  });
}
