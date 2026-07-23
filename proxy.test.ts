import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "./proxy";

// Mock jose jwtVerify as we don't have a secret and we want to test logic
vi.mock("jose", () => ({
  jwtVerify: vi.fn().mockResolvedValue({
    payload: { sub: "admin@kestudio.sk", role: "admin" },
  }),
}));

describe("Sentinel Engine (Proxy)", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = "test_secret_key_1234567890_test_padding";
  });

  it("by mal prepustiť bežný request a pridať bezpečnostné hlavičky", async () => {
    const req = new NextRequest("http://localhost/produkty", {
      headers: new Headers({
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      }),
    });

    const res = await proxy(req);
    
    // Keď nie sme v API alebo chránenej ceste, vráti sa štandardný Next response, 
    // do ktorého len pridáme hlavičky.
    expect(res.headers.get("x-protected-by")).toBe("Sentinel Engine");
    expect(res.headers.get("strict-transport-security")).toContain("max-age=63072000");
    expect(res.headers.get("x-frame-options")).toBe("SAMEORIGIN");
  });

  it("by mal zablokovať bota a vrátiť 403 Forbidden", async () => {
    const req = new NextRequest("http://localhost/sluzby", {
      headers: new Headers({
        "user-agent": "python-requests/2.28.1",
      }),
    });

    const res = await proxy(req);
    
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.error).toContain("Forbidden");
  });

  it("by mal zablokovať request bez User-Agenta", async () => {
    const req = new NextRequest("http://localhost/api/test");
    // nevyplnený user agent
    const res = await proxy(req);
    
    expect(res.status).toBe(403);
  });

  it("by mal presmerovať na /login, ak nie je token pri prístupe do /crm", async () => {
    const req = new NextRequest("http://localhost/crm/dashboard", {
      headers: new Headers({
        "user-agent": "Mozilla/5.0",
      }),
    });

    const res = await proxy(req);

    // Keďže nemáme 'session' cookie, má nasledovať redirect.
    // Next.js redirect vracia status 307
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/login?callbackUrl=%2Fcrm%2Fdashboard");
  });

  it("by mal prepustiť request do /crm s platnou session cookie", async () => {
    const req = new NextRequest("http://localhost/crm", {
      headers: new Headers({
        "user-agent": "Mozilla/5.0",
        cookie: "session=valid.jwt.token",
      }),
    });

    const res = await proxy(req);

    expect(res.status).not.toBe(307);
    expect(res.headers.get("x-protected-by")).toBe("Sentinel Engine");
  });

  it("by mal vrátiť 401 pre chránené /api/private/* cesty bez session", async () => {
    const req = new NextRequest("http://localhost/api/private/secret", {
      headers: new Headers({
        "user-agent": "Mozilla/5.0",
        "x-forwarded-for": "10.0.0.9",
      }),
    });

    const res = await proxy(req);

    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe("Unauthorized");
  });

  it("by mal uplatniť Rate Limit pre API cesty", async () => {
    // Vytvoríme veľa rýchlych requestov na ten istý API endpoint z tej istej IP
    const createReq = () => new NextRequest("http://localhost/api/contact", {
      headers: new Headers({
        "user-agent": "Mozilla/5.0",
        "x-forwarded-for": "192.168.1.5",
      }),
    });

    let lastRes;
    for (let i = 0; i <= 21; i++) {
      lastRes = await proxy(createReq());
    }

    // Posledný request (21. a 22.) by mal byť zablokovaný
    expect(lastRes!.status).toBe(429);
    const body = await lastRes!.json();
    expect(body.error).toBe("Too Many Requests");
    expect(lastRes!.headers.get("retry-after")).toBe("10");
  });
});
