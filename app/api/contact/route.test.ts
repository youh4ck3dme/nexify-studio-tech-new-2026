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

const originalApiKey = process.env.RESEND_API_KEY;

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
  });

  afterEach(() => {
    if (originalApiKey === undefined) {
      delete process.env.RESEND_API_KEY;
    } else {
      process.env.RESEND_API_KEY = originalApiKey;
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
