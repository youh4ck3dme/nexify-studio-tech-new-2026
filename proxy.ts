import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken } from '@/lib/auth/jwt';
import { SESSION_COOKIE_NAME, PROTECTED_PATH_PREFIXES } from '@/lib/auth/config';

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
    if (isRateLimited(ip)) {
      return new NextResponse(
        JSON.stringify({ error: 'Too Many Requests' }),
        { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': '10' } }
      );
    }
  }

  // --- Krok 3: JWT Overovanie (Credentials Auth) ---
  // Chránené routy: /crm, /dashboard, /admin, /api/private/*
  const isProtectedRoute = PROTECTED_PATH_PREFIXES.some((prefix) => path.startsWith(prefix));
  if (isProtectedRoute) {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = token ? await verifySessionToken(token) : null;

    if (!session) {
      if (path.startsWith('/api/')) {
        return new NextResponse(
          JSON.stringify({ error: 'Unauthorized' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', path);
      return NextResponse.redirect(loginUrl);
    }
  }

  // --- Krok 4: Zostavenie Response so Security Hlavičkami ---
  const response = NextResponse.next();
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy
  response.headers.set('Content-Security-Policy', [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://vitals.vercel-insights.com",
    "frame-src 'self' http://localhost:5175 http://localhost:3000",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self' http://localhost:5175 http://localhost:3000",
  ].join('; '));

  // Signatúra ochrany
  response.headers.set('X-Protected-By', 'Sentinel Engine');

  return response;
}
