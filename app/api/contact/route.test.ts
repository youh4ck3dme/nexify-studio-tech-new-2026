import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { mockSend } = vi.hoisted(() => ({
  mockSend: vi.fn(),
}));

vi.mock("resend", () => ({
  Resend: class MockResend {
    emails = { send: mockSend };
    constructor(_apiKey: string) {
      void _apiKey;
    }
  },
}));

import { POST } from "./route";

const originalEnv = {
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL,
  CONTACT_FROM_EMAIL: process.env.CONTACT_FROM_EMAIL,
  CONTACT_COPY_EMAIL: process.env.CONTACT_COPY_EMAIL,
};

function createRequest(body: unknown) {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/contact", () => {
  beforeEach(() => {
    mockSend.mockReset();
    process.env.CONTACT_TO_EMAIL = "to@example.com";
    process.env.CONTACT_FROM_EMAIL = "from@example.com";
    process.env.CONTACT_COPY_EMAIL = "copy@example.com";
  });

  afterEach(() => {
    for (const [key, val] of Object.entries(originalEnv)) {
      if (val === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = val;
      }
    }
  });

  it("returns 400 for invalid JSON", async () => {
    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{",
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it("returns 400 for missing fields", async () => {
    const response = await POST(
      createRequest({ name: "", email: "a@b.cz", message: "hi" })
    );
    expect(response.status).toBe(400);
  });

  it("returns 500 without RESEND_API_KEY", async () => {
    delete process.env.RESEND_API_KEY;
    const response = await POST(
      createRequest({
        name: "Test",
        email: "user@example.com",
        message: "Hello",
      })
    );
    expect(response.status).toBe(500);
  });

  it("returns 200 when Resend succeeds", async () => {
    process.env.RESEND_API_KEY = "re_test";
    mockSend.mockResolvedValue({ data: { id: "email_1" } });

    const response = await POST(
      createRequest({
        name: "Test",
        email: "user@example.com",
        message: "Hello",
      })
    );
    expect(response.status).toBe(200);
    expect(mockSend).toHaveBeenCalled();
  });

  it("returns 502 when Resend fails", async () => {
    process.env.RESEND_API_KEY = "re_test";
    mockSend.mockRejectedValue(new Error("Resend error"));

    const response = await POST(
      createRequest({
        name: "Test",
        email: "user@example.com",
        message: "Hello",
      })
    );
    expect(response.status).toBe(502);
  });
});
