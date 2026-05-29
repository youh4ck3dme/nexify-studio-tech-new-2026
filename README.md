# Nexify Studio - Private Repository 🔒

> **DÔVERNÉ / CONFIDENTIAL**  
> Tento repozitár obsahuje privátny zdrojový kód spoločnosti MA.GI.CA., s.r.o. (Nexify Studio). Neoprávnené šírenie, kopírovanie alebo poskytovanie prístupu tretím stranám je prísne zakázané.

## 🚀 Architektúra a Tech Stack (Next.js 16)

Projekt Nexify Studio je postavený na najnovších štandardoch pre maximálny výkon, bezpečnosť a dokonalý "Industrial Luxury" používateľský zážitok.

- **Framework:** Next.js 16 (App Router)
- **Design System:** Tailwind v4 (AMOLED Black, Glassmorphism, plynulé animácie)
- **PWA & Offline:** Serwist (Service Worker), plnohodnotná inštalácia na plochu iOS/Android s natívnym "black-translucent" stavovým riadkom.
- **Bezpečnosť:** Vlastný **Sentinel Engine** bežiaci na úrovni Edge Proxy.
- **Databáza / CRM:** Dexie.js (IndexedDB) pre Local-First/Offline spracovanie dát a Supabase pre backend.
- **Testovanie:** Vitest s masívnou sadou Unit a Integrity testov (100+ testov).

---

## 🛡️ Sentinel Engine (Edge Proxy / Middleware)

Aplikácia je chránená naším vlastným bezpečnostným štítom, ktorý beží priamo na Vercel Edge Runtime (v súbore `proxy.ts`). 
Tento štít zachytáva requesty ešte pred vstupom do aplikácie a zabezpečuje:
1. **Anti-Scraping:** Blokovanie známych botov (`curl`, `python-requests`, atď.) a requestov bez User-Agenta.
2. **Rate Limiting:** Ochrana API endpointov (max. 20 requestov / 10s per IP) proti DDoS.
3. **Edge JWT Validácia:** Extrémne rýchle overovanie prístupu (cez `jose`) do `/crm` a `/dashboard`. Neoverení používatelia sú okamžite presmerovaní na `/login`.
4. **Security Headers:** Automatická injekcia Strict-Transport-Security, X-Frame-Options (Clickjacking ochrana) a pod.

---

## 💼 Interné CRM (Offline-First)

CRM modul je navrhnutý v štýle **Local-First**.
- Ak je obchodník v teréne bez signálu, stále môže zadávať nových klientov.
- Dáta sa okamžite uložia do lokálnej IndexedDB databázy prehliadača (tabuľky `clients` a `offlineQueue`).
- Komponent `<SyncManager />` ticho na pozadí čaká na obnovenie pripojenia. Akonáhle telefón/PC získa internet, CRM odošle celú offline frontu do hlavnej databázy na serveri.

---

## ⚙️ Lokálny Vývoj a Premenné Prostredia

Na spustenie aplikácie v plnom režime je potrebné mať nastavený súbor `.env.local` v koreňovom adresári.

**Potrebné premenné:**
```env
# Kontakt a odosielanie emailov (Resend)
RESEND_API_KEY=re_your_api_key
CONTACT_FROM_EMAIL=support@nexify-studio.tech
CONTACT_TO_EMAIL=magicasro@hotmail.com
CONTACT_COPY_EMAIL=erikbabcan@gmail.com

# Supabase a Autentifikácia (Pre prístup do CRM)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_JWT_SECRET=vaše_veľmi_tajné_jwt_heslo
```
*(Poznámka: Ak chýba `SUPABASE_JWT_SECRET`, Sentinel Engine vás nepustí do `/crm` ani na lokálnom prostredí!)*

### Spustenie aplikácie:
```bash
pnpm install
pnpm dev
```

---

## 🧪 Testovanie (Vitest)

Projekt si zakladá na obrovskej odolnosti voči chybám. Pred každým nasadením spúšťame Unit aj Integrity testy.

```bash
# Spustenie kompletne všetkých testov
pnpm test:all

# Len Integrity testy (kontrolujú čistotu PWA, UI/UX, Assetov a Routeru)
pnpm test:integrity

# Len modulárne Unit testy
pnpm test:unit
```

---

## 📱 PWA (Progressive Web App) Zásady

1. **Ikony a Manifest:** Všetky ikony pre Apple a štandardný web sídlia priamo v `app/` (`icon.png`, `apple-icon.png`, `favicon.ico`). Ostatné maskable ikony pre Android sú v `public/icons/`.
2. **AMOLED Strict:** V `app/layout.tsx` nesmie byť iný `themeColor` ako `#000000`, aby PWA splynula s výrezom telefónu (Notch / Dynamic Island).
3. **Install Prompt:** Nepoužívame defaultný prehliadačový banner, ale náš vlastný nadizajnovaný `<CustomInstallPrompt />` so skleneným Glassmorphism efektom.
