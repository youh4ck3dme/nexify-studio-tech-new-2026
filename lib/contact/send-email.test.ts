import { describe, expect, it, vi } from "vitest";
import { buildContactEmailContent, sendContactEmail } from "./send-email";

describe("buildContactEmailContent", () => {
  it("includes contact fields in subject and body", () => {
    const { subject, text } = buildContactEmailContent({
      name: "Ján",
      email: "jan@example.com",
      phone: "Neuvedené",
      message: "Potrebujem web",
    });

    expect(subject).toBe("Nová správa z webu - Ján");
    expect(text).toContain("jan@example.com");
    expect(text).toContain("Potrebujem web");
  });
});

describe("sendContactEmail", () => {
  it("sends to primary with cc and replyTo", async () => {
    const send = vi.fn().mockResolvedValue({ id: "1" });
    const client = { emails: { send } };

    await sendContactEmail(
      client,
      {
        name: "Smoke",
        email: "visitor@example.com",
        phone: "0900123456",
        message: "Test",
      },
      {
        fromEmail: "from@resend.dev",
        toEmail: "magicasro@hotmail.com",
        copyEmail: "erikbabcan@gmail.com",
      }
    );

    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "from@resend.dev",
        to: ["magicasro@hotmail.com"],
        cc: ["erikbabcan@gmail.com"],
        replyTo: "visitor@example.com",
      })
    );
  });
});
