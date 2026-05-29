# Resend email — posledný krok (Fáza 0)

Keď budeš pripravený, nastav na Verceli:

```bash
vercel env add RESEND_API_KEY production --scope h4ck3d --value "re_..." --sensitive
vercel env add CONTACT_FROM_EMAIL production --scope h4ck3d --value "onboarding@resend.dev"
vercel env add CONTACT_TO_EMAIL production --scope h4ck3d --value "magicasro@hotmail.com"
vercel env add CONTACT_COPY_EMAIL production --scope h4ck3d --value "erikbabcan@gmail.com"
```

Po overení domény `nexify-studio.tech` v Resend zmeň `CONTACT_FROM_EMAIL` na `hello@nexify-studio.tech`
a aktualizuj `lib/legal/company.ts` + footer email.

Smoke test:

```bash
SMOKE_BASE_URL=https://nexify-studio.tech pnpm test:contact:smoke
```
