# CRM Security & Hardening Notes

This document highlights security safeguards, controls, and hardening practices implemented to protect the `/crm` module.

## 1. Web Indexing & Crawler Protection
- **Noindex Meta Tags**: Both the main CRM page (`app/crm/page.tsx`) and the detailed profile view (`app/crm/[id]/page.tsx`) contain explicit `robots: { index: false, follow: false }` metadata. This signals search engines (e.g., Google, Bing) to ignore these routes entirely.
- **Robots.txt Exclusion**: The `app/robots.ts` file has been updated to explicitly forbid access to `/crm` and `/crm/` directories.
- **Sitemap Exclusion**: The sitemap generation engine in `app/sitemap.ts` does not list or link to any CRM routes.

## 2. API Security Skepticism
- All route skeletons (`/api/crm/*`) return `501 Not Implemented`.
- Verified that no client-side payload sent to these routes is stored, logged, or cached anywhere on the server.

## 3. Data Integrity & Content Sanitization
- **JSON Import Validation**: The import wizard verifies the `schemaVersion === 3` before parsing. It skips duplicates safely, and prevents schema Injection by striping database auto-increment keys.
- **Console Log Hygiene**: No sensitive customer attributes (such as email, phone numbers, budgets, or notes) are output to standard browser console streams.

## 4. Current Authentication State
- **Middleware Guard**: The sentinel middleware (`proxy.ts`) requires a JWT authorization cookie (`sb-auth-token` or `access_token`) before rendering protected `/crm` pages.
- **Security Limitation**: While E2E testing bypasses are restricted, the client-side login password is not a replacement for true production-grade multi-user auth. Role-based access control (RBAC) and user session verification are planned for the backend phase.
