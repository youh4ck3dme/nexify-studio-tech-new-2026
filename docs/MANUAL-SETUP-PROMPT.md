# Prompt: manuálne dokončenie Nexify Studio (produkcia)

Skopíruj tento prompt do nového chatu v Cursori (alebo ho pošli agentovi), keď máš pripravený **Resend API kľúč** a overený **FROM email**.

---

## Prompt (SK)

```
Projekt: /Users/erikbabcan/nexify-studio-tech-new-2026
Vercel: team h4ck3d, project v0-optimus-the-ai-platform-to-bu
Doména: https://nexify-studio.tech

Dokonči produkčné nastavenie cez CLI:

1. Vercel env (Production + Preview):
   - RESEND_API_KEY = <vložím ja v dashboarde alebo ti ho dám>
   - CONTACT_FROM_EMAIL = <overený sender v Resend, napr. onboarding@resend.dev alebo mail@nexify-studio.tech>
   - CONTACT_TO_EMAIL = magicasro@hotmail.com
   - CONTACT_COPY_EMAIL = erikbabcan@gmail.com

   Príkazy:
   vercel env add RESEND_API_KEY production --scope h4ck3d --value "re_..." -y
   vercel env add CONTACT_FROM_EMAIL production --scope h4ck3d --value "..." -y
   (opakuj pre preview ak treba)

2. Redeploy production:
   vercel --prod --scope h4ck3d

3. Overenie:
   - pnpm test (lokálne)
   - SMOKE_BASE_URL=https://nexify-studio.tech pnpm test:contact:smoke
   - Chrome DevTools → Application → Manifest + Service Worker
   - Odoslať reálny formulár na webe, skontrolovať magicasro@hotmail.com + CC erikbabcan@gmail.com

4. Ak favicon.io ZIP mám v Downloads, nahraď PNG v public/ a spusti pnpm icons:generate, commitni.

Nespýtaj sa na commit — už je na main. Len env, deploy, smoke, krátky report čo je zelené/červené.
```

---

## Čo už spravil agent (CLI)

- [x] Commit `ac5a101` + push na `main` (PWA, Serwist, testy, ikony)
- [x] Vercel production deploy (READY)
- [x] Vercel env (Production): `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL`, `CONTACT_COPY_EMAIL`
- [x] Produkcia: `/manifest.webmanifest` → 200, `/sw.js` → 200
- [ ] **`RESEND_API_KEY` na Verceli** — agent k nemu nemal prístup v shelli

## Čo musíš urobiť ty (1 príkaz + redeploy)

```bash
cd /Users/erikbabcan/nexify-studio-tech-new-2026
vercel env add RESEND_API_KEY production --scope h4ck3d --value "re_TVoj_KLUC" --sensitive -y
vercel env add RESEND_API_KEY preview --scope h4ck3d --value "re_TVoj_KLUC" --sensitive -y
vercel --prod --scope h4ck3d --yes
SMOKE_BASE_URL=https://nexify-studio.tech pnpm test:contact:smoke
```

1. Kľúč: [resend.com/api-keys](https://resend.com/api-keys)
2. Ak máš overený vlastný sender, uprav `CONTACT_FROM_EMAIL` vo Vercel dashboarde
3. Po redeploy over formulár + oba inboxy
