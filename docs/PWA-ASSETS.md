# PWA a statické assety (`public/`)

Prehľad favicon sady, manifestu a skriptov na regeneráciu.

## Súbory v `public/`

| Súbor | Rozmer | Zdroj | Popis |
|-------|--------|-------|-------|
| `favicon.ico` | multi | favicon.io export | Klasický favicon |
| `favicon-16x16.png` | 16×16 | favicon.io / `icons:generate` | Tab ikona |
| `favicon-32x32.png` | 32×32 | favicon.io / `icons:generate` | Tab ikona (retina) |
| `apple-touch-icon.png` | 180×180 | favicon.io / `icons:generate` | iOS home screen |
| `android-chrome-192x192.png` | 192×192 | favicon.io / `icons:generate` | PWA launcher |
| `android-chrome-512x512.png` | 512×512 | favicon.io (master) | PWA splash / zdroj pre skripty |
| `android-chrome-512x512-maskable.png` | 512×512 | `pnpm icons:generate` | Maskable s 10% safe zone na `#000000` |
| `manifest.webmanifest` | — | ručne | Nexify Web App Manifest |
| `og-image.png` | 1200×630 | `pnpm og:generate` | Open Graph / Twitter card |

**Negenerované / gitignored:** `public/sw.js` — vytvára Serwist pri `pnpm build`.

## Manifest

[`public/manifest.webmanifest`](../public/manifest.webmanifest):

- `name`: Nexify Studio
- `short_name`: Nexify
- `theme_color`: `#000000` (AMOLED dark chrome)
- `background_color`: `#FCFCFC` (Apple-grade light splash)
- `display`: standalone
- Ikony: 192, 512 (any), 512 (maskable), 180 (apple-touch)

Metadata v [`app/layout.tsx`](../app/layout.tsx) odkazuje na rovnaké cesty (`manifest`, `icons`, `appleWebApp`).

## Skripty

```bash
pnpm icons:generate   # scripts/generate-pwa-icons.mjs
pnpm og:generate      # scripts/generate-og-image.mjs
```

`icons:generate` číta master `public/android-chrome-512x512.png` a vytvorí:
- resized PNG sady (16, 32, 180, 192, 512)
- `android-chrome-512x512-maskable.png`

`favicon.ico` sa **neprepisuje** — pri výmene brandingu ho skopíruj z favicon.io exportu.

## Workflow: nová favicon sada

1. Stiahni ZIP z favicon.io (alebo použi `favicon_nexify/`).
2. Skopíruj 6 súborov do `public/` (vrátane `favicon.ico`).
3. `pnpm icons:generate && pnpm og:generate`
4. `pnpm test:pwa && pnpm test:integrity`
5. Commit + deploy; v prehliadači hard refresh.

## Testy

- [`lib/pwa/pwa.test.ts`](../lib/pwa/pwa.test.ts) — manifest, ikony, favicon sada
- [`tests/integrity/manifest.integrity.test.ts`](../tests/integrity/manifest.integrity.test.ts)
- [`tests/e2e/pwa.spec.ts`](../tests/e2e/pwa.spec.ts)

## Téma a farby

Manifest a viewport sú zladené s theme systémom:

- Light pozadie: `#FCFCFC` (`globals.css` `--background`)
- AMOLED dark: `#000000`
- Text light: `#1D1D1F` / dark: `#EDEDED`
