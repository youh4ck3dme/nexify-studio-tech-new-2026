import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";
import bcrypt from "bcryptjs";
import { loginAction, logoutAction } from "./actions";

const { mockSet, mockDelete, mockRedirect, mockHeadersGet } = vi.hoisted(() => ({
  mockSet: vi.fn(),
  mockDelete: vi.fn(),
  mockRedirect: vi.fn(),
  mockHeadersGet: vi.fn(() => "127.0.0.1"),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(() => ({
    set: mockSet,
    delete: mockDelete,
  })),
  headers: vi.fn(() => ({
    get: mockHeadersGet,
  })),
}));

vi.mock("next/navigation", () => ({
  redirect: mockRedirect,
}));

vi.mock("@/lib/auth/rate-limit", () => ({
  isLoginRateLimited: vi.fn(() => false),
  resetLoginRateLimit: vi.fn(),
}));

// jose's WebCrypto signing path hits a jsdom/Uint8Array realm mismatch under
// the project's default jsdom test environment, so the real SignJWT is
// swapped for a lightweight stub here - the cookie/session side effects are
// what this suite verifies, not the JWT signature itself.
vi.mock("jose", () => ({
  SignJWT: class {
    setProtectedHeader() {
      return this;
    }
    setIssuedAt() {
      return this;
    }
    setExpirationTime() {
      return this;
    }
    sign() {
      return Promise.resolve("mocked.jwt.token");
    }
  },
}));

const ADMIN_EMAIL = "admin@kestudio.sk";
const CORRECT_PASSWORD = "correct-horse-battery-staple";
let correctPasswordHash: string;

describe("Login Action (Credentials)", () => {
  beforeAll(async () => {
    // Nízky salt rounds počet pre rýchlosť testov
    correctPasswordHash = await bcrypt.hash(CORRECT_PASSWORD, 4);
  });

  beforeEach(() => {
    vi.clearAllMocks();
    mockHeadersGet.mockReturnValue("127.0.0.1");
    process.env.JWT_SECRET = "test_secret_key_1234567890_test_padding";
    process.env.ADMIN_EMAIL = ADMIN_EMAIL;
    process.env.ADMIN_PASSWORD_HASH = correctPasswordHash;
  });

  it("odmietne neplatný formát emailu", async () => {
    const formData = new FormData();
    formData.append("email", "not-an-email");
    formData.append("password", CORRECT_PASSWORD);

    const result = await loginAction(null, formData);

    expect(result).toEqual({ error: "Invalid credentials." });
    expect(mockSet).not.toHaveBeenCalled();
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it("odmietne nesprávne heslo so všeobecnou chybou", async () => {
    const formData = new FormData();
    formData.append("email", ADMIN_EMAIL);
    formData.append("password", "wrong-password");

    const result = await loginAction(null, formData);

    expect(result).toEqual({ error: "Invalid credentials." });
    expect(mockSet).not.toHaveBeenCalled();
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it("odmietne nesprávny email s rovnakou všeobecnou chybou", async () => {
    const formData = new FormData();
    formData.append("email", "someone-else@kestudio.sk");
    formData.append("password", CORRECT_PASSWORD);

    const result = await loginAction(null, formData);

    expect(result).toEqual({ error: "Invalid credentials." });
    expect(mockSet).not.toHaveBeenCalled();
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it("vráti všeobecnú chybu, ak chýbajú ADMIN_EMAIL / ADMIN_PASSWORD_HASH", async () => {
    delete process.env.ADMIN_EMAIL;
    delete process.env.ADMIN_PASSWORD_HASH;

    const formData = new FormData();
    formData.append("email", ADMIN_EMAIL);
    formData.append("password", CORRECT_PASSWORD);

    const result = await loginAction(null, formData);

    expect(result).toEqual({ error: "Invalid credentials." });
    expect(mockSet).not.toHaveBeenCalled();
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it("nastaví HttpOnly session cookie a presmeruje do /crm pri správnych údajoch", async () => {
    const formData = new FormData();
    formData.append("email", ADMIN_EMAIL.toUpperCase());
    formData.append("password", CORRECT_PASSWORD);

    await loginAction(null, formData);

    expect(mockSet).toHaveBeenCalledTimes(1);
    const cookieCall = mockSet.mock.calls[0][0];

    expect(cookieCall.name).toBe("session");
    expect(cookieCall.value).toBeDefined();
    expect(cookieCall.httpOnly).toBe(true);
    expect(cookieCall.sameSite).toBe("lax");
    expect(cookieCall.path).toBe("/");

    expect(mockRedirect).toHaveBeenCalledWith("/crm");
  });

  it("zablokuje prihlásenie pri prekročení rate limitu", async () => {
    const { isLoginRateLimited } = await import("@/lib/auth/rate-limit");
    vi.mocked(isLoginRateLimited).mockReturnValueOnce(true);

    const formData = new FormData();
    formData.append("email", ADMIN_EMAIL);
    formData.append("password", CORRECT_PASSWORD);

    const result = await loginAction(null, formData);

    expect(result).toEqual({
      error: "Too many attempts. Please try again later.",
    });
    expect(mockSet).not.toHaveBeenCalled();
  });

  it("zmaže session cookie a presmeruje na /login pri logoutAction", async () => {
    await logoutAction();

    expect(mockDelete).toHaveBeenCalledWith("session");
    expect(mockRedirect).toHaveBeenCalledWith("/login");
  });
});
