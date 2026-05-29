# nexify-studio-tech-new-2026

This is a [Next.js](https://nextjs.org) project bootstrapped with [v0](https://v0.app).

## Built with v0

This repository is linked to a [v0](https://v0.app) project. You can continue developing by visiting the link below -- start new chats to make changes, and v0 will push commits directly to this repo. Every merge to `main` will automatically deploy.

[Continue working on v0 →](https://v0.app/chat/projects/prj_gYDH8GzRCv5BIfKlfFJieMBYFEMI)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Contact form (Resend)

The contact section posts to `/api/contact` and sends emails through Resend.

Required environment variables:

- `RESEND_API_KEY`
- `CONTACT_FROM_EMAIL`
- `CONTACT_TO_EMAIL` (defaults to `magicasro@hotmail.com`)
- `CONTACT_COPY_EMAIL` (defaults to `erikbabcan@gmail.com`)

Important: `CONTACT_FROM_EMAIL` must be a verified sender in Resend. If you use a non-verified sender, delivery will fail.

### Tests

```bash
pnpm test
```

Unit tests cover contact validation, email payload, and the `/api/contact` route (mocked Resend).

### Smoke test (live email)

Requires a running app and configured env (`.env.local` locally or Vercel Production env):

```bash
pnpm dev
# in another terminal:
RESEND_API_KEY=re_... CONTACT_FROM_EMAIL=verified@yourdomain.com pnpm test:contact:smoke

# production:
SMOKE_BASE_URL=https://nexify-studio.tech pnpm test:contact:smoke
```

Smoke sends a message prefixed with `[SMOKE]`. Check `CONTACT_TO_EMAIL` and `CONTACT_COPY_EMAIL` inboxes.

### Go-live checklist

- [ ] Vercel env: `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL`, `CONTACT_COPY_EMAIL`
- [ ] Redeploy after env changes
- [ ] `pnpm test` passes
- [ ] Smoke test on production
- [ ] Chrome DevTools → Application → Manifest (192 + 512 icons, no errors)
- [ ] Install app from browser (desktop/mobile)
- [ ] Offline: disconnect network, reload → `/~offline` fallback

## PWA a ikony

Podrobná dokumentácia: [`docs/PWA-ASSETS.md`](docs/PWA-ASSETS.md).

Statické assety v [`public/`](public/):

| Súbor | Účel |
|-------|------|
| `favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png` | Favicon v prehliadači |
| `apple-touch-icon.png` | iOS „Pridať na plochu“ |
| `android-chrome-192x192.png`, `android-chrome-512x512.png` | PWA / Android |
| `android-chrome-512x512-maskable.png` | Maskable ikona (AMOLED safe zone) |
| `manifest.webmanifest` | Web App Manifest (Nexify branding) |
| `og-image.png` | Open Graph náhľad (1200×630) |

**Manifest:** [`public/manifest.webmanifest`](public/manifest.webmanifest) — `theme_color: #000000` (AMOLED), `background_color: #FCFCFC`.

**Service worker:** generovaný pri `pnpm build` do `public/sw.js` (Serwist, len produkcia).

### Aktualizácia ikon (favicon.io)

1. Export z [favicon.io](https://favicon.io) do priečinka (napr. `favicon_nexify/`).
2. Skopíruj do `public/`: `favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png`, `android-chrome-192x192.png`, `android-chrome-512x512.png`.
3. Spusti regeneráciu odvodených assetov:

```bash
pnpm icons:generate   # maskable + resize z android-chrome-512x512.png
pnpm og:generate      # OG obrázok s logom
```

4. Overenie:

```bash
pnpm test:pwa
pnpm test:integrity
```

5. Hard refresh v prehliadači (Cmd+Shift+R) kvôli cache favicon.

- Install prompt v navigácii; iOS: Zdieľať → Pridať na plochu

## Learn More

To learn more, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [v0 Documentation](https://v0.app/docs) - learn about v0 and how to use it.
