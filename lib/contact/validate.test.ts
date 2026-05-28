import { describe, expect, it } from "vitest";
import { parseContactPayload } from "./validate";

describe("parseContactPayload", () => {
  it("returns 400 when required fields are missing", () => {
    const result = parseContactPayload({ name: "  ", email: "a@b.cz" });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.status).toBe(400);
      expect(result.error).toContain("povinné");
    }
  });

  it("returns 400 for invalid email", () => {
    const result = parseContactPayload({
      name: "Test",
      email: "not-an-email",
      message: "Hello",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("Neplatný");
    }
  });

  it("defaults phone to Neuvedené", () => {
    const result = parseContactPayload({
      name: "Test",
      email: "user@example.com",
      message: "Hello",
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.phone).toBe("Neuvedené");
    }
  });

  it("trims string fields", () => {
    const result = parseContactPayload({
      name: "  Anna  ",
      email: " user@example.com ",
      phone: " 0900 ",
      message: "  Ahoj  ",
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toEqual({
        name: "Anna",
        email: "user@example.com",
        phone: "0900",
        message: "Ahoj",
      });
    }
  });
});
