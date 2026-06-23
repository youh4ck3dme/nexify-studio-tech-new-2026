import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Konfigurácia pre Edge Runtime
export const config = {
  matcher: [
    // Vynechať statické súbory, _next, favicon atď.
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|manifest.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

// ==========================================
// 1. In-Memory Rate Limiter (Edge Fallback)
// ==========================================
// Note: V distribuovanom Edge prostredí (Vercel) sa Map môže vyčistiť 
// kedykoľvek a neukladá globálny stav cez všetky inštancie.
// Pre lokálny/fallback účel je to však postačujúce.
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW_MS = 10 * 1000; // 10 sekúnd

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return false;
  }

  if (now - record.lastReset > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return false;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return true;
  }

  record.count += 1;
  return false;
}

// ==========================================
// 2. Anti-Scraping (Bot Protection)
// ==========================================
const BLOCKED_USER_AGENTS = [
  'curl', 'wget', 'python-requests', 'scrapy', 'postman', 'insomnia', 'httpie'
];

function isBotOrScraper(userAgent: string | null): boolean {
  if (!userAgent) return true; // Blokovať requesty bez User-Agenta
  const ua = userAgent.toLowerCase();
  return BLOCKED_USER_AGENTS.some(bot => ua.includes(bot));
}

// ==========================================
// 3. Hlavný Sentinel Engine (Middleware)
// ==========================================
export async function proxy(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
  const userAgent = request.headers.get('user-agent');
  const path = request.nextUrl.pathname;

  // --- Krok 1: Anti-Scraping ---
  if (isBotOrScraper(userAgent)) {
    return new NextResponse(
      JSON.stringify({ error: 'Forbidden: Access denied by Sentinel Engine' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // --- Krok 2: Rate Limiting pre API endpointy ---
  if (path.startsWith('/api/')) {
    const isLocalhost = ip === '127.0.0.1' || ip === '::1' || ip.includes('127.0.0.1');
    if (!isLocalhost && isRateLimited(ip)) {
      return new NextResponse(
        JSON.stringify({ error: 'Too Many Requests' }),
        { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': '10' } }
      );
    }
  }

  // --- Krok 3: JWT Overovanie (Supabase Auth) ---
  // TODO: Fáza 2/3 - Zabezpečiť užívateľský prístup (Role-Based Access Control / Supabase Auth Integration).
  // Momentálne vyžaduje prítomnosť JWT tokenu pre prístup k /crm, no pre produkčný tímový multi-user cloud
  // bude potrebné implementovať prísnejšie rolové matice (Admin, Editor, Viewer).
  const isProtectedRoute = path.startsWith('/crm') || path.startsWith('/dashboard');
  if (isProtectedRoute) {
    // Vyžadujeme prítomnosť JWT tokenu v cookies
    const token = request.cookies.get('sb-auth-token')?.value || request.cookies.get('access_token')?.value;

    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', path);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const secretString = process.env.JWT_SECRET;
      
      if (!secretString) {
        console.warn("Chýba JWT_SECRET v prostredí.");
        throw new Error("Missing JWT Secret");
      }

      const secret = new TextEncoder().encode(secretString);
      await jwtVerify(token, secret);
    } catch {
      // Token je neplatný / expirovaný, alebo chýba secret
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', path);
      return NextResponse.redirect(loginUrl);
    }
  }

  // --- Krok 4: Zostavenie Response so Security Hlavičkami ---
  const response = NextResponse.next();

  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy
  response.headers.set('Content-Security-Policy', [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com https://apis.google.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https://*.googleusercontent.com https://*.firebaseapp.com",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://*.firebaseio.com https://*.googleapis.com wss://*.firebaseio.com https://vitals.vercel-insights.com https://apis.google.com https://*.firebaseapp.com",
    "frame-src 'self' https://*.firebaseapp.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; '));

  // Signatúra ochrany
  response.headers.set('X-Protected-By', 'Sentinel Engine');

  return response;
}
