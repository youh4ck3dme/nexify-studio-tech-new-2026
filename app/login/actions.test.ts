import { describe, it, expect, vi, beforeEach } from "vitest";
import { loginAction } from "./actions";

const { mockSet, mockRedirect, mockSign } = vi.hoisted(() => ({
  mockSet: vi.fn(),
  mockRedirect: vi.fn(),
  mockSign: vi.fn().mockResolvedValue("mocked_jwt_token"),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(() => ({
    set: mockSet,
  })),
}));

vi.mock("next/navigation", () => ({
  redirect: mockRedirect,
}));

vi.mock("jose", () => {
  return {
    SignJWT: class {
      constructor() {}
      setProtectedHeader() { return this; }
      setIssuedAt() { return this; }
      setExpirationTime() { return this; }
      sign() { return mockSign(); }
    },
  };
});

describe("Login Action (Bypass)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Nasimulujeme, že máme ENV premennú
    process.env.JWT_SECRET = "test_secret_key_1234567890_test";
  });

  it("by mal odmietnuť nesprávne heslo", async () => {
    const formData = new FormData();
    formData.append("password", "zle_heslo");

    const result = await loginAction(null, formData);
    
    expect(result).toEqual({ error: "Nesprávny bezpečnostný kód" });
    expect(mockSet).not.toHaveBeenCalled();
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it("by mal vrátiť chybu, ak chýba JWT secret", async () => {
    delete process.env.JWT_SECRET;
    
    const formData = new FormData();
    formData.append("password", "23513900");

    const result = await loginAction(null, formData);
    
    expect(result).toEqual({ error: "Systémová chyba: Chýba podpisový kľúč." });
    expect(mockSet).not.toHaveBeenCalled();
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it("by mal nastaviť cookie a presmerovať do /crm pri správnom hesle", async () => {
    const formData = new FormData();
    formData.append("password", "23513900");

    await loginAction(null, formData);

    // Skontroluje, či cookie.set bola zavolaná správne
    expect(mockSet).toHaveBeenCalledTimes(1);
    const cookieCall = mockSet.mock.calls[0][0];
    
    expect(cookieCall.name).toBe("sb-auth-token");
    expect(cookieCall.value).toBeDefined();
    expect(cookieCall.httpOnly).toBe(true);
    expect(cookieCall.path).toBe("/");

    // Skontroluje, či sme boli presmerovaní
    expect(mockRedirect).toHaveBeenCalledWith("/crm");
  });
});
