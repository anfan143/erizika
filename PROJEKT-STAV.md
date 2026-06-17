# Projekt Rizika (e-rizika / erizika.sk) — stav a odovzdávací súhrn

Tento súbor slúži na **pokračovanie práce na inom počítači**. Keď otvoríš projekt s Claude Code (alebo iným AI), nech si najprv prečíta tento súbor — pochopí celý stav. Aktualizuj ho, keď pribudnú väčšie zmeny.

## Čo to je
SaaS na generovanie hodnotení rizík BOZP (§ 6 zákona č. 124/2006 Z. z., metodika 5×5). Používateľ zadá firmu/odvetvie/pozíciu/činnosti → AI vygeneruje tabuľku rizík → export do PDF a Word.

## Stack a cloud (nič nebeží len lokálne)
- **Kód:** GitHub `anfan143/erizika`, vetva `main`. Web sa nasadzuje **automaticky cez Vercel** z `main`.
- **Frontend/backend:** Next.js 14 (App Router), TypeScript.
- **DB + auth:** Supabase (projekt `e-rizika`, URL `https://aqtqzoghgfelxuiaxoan.supabase.co`, Frankfurt). Tabuľky: `profiles`, `projects`, `documents` (RLS zapnuté). Schéma v `supabase/schema.sql`.
- **AI:** Anthropic API (model `claude-sonnet-4-6`), volá sa v `app/api/generate/route.ts`.
- **Platby:** Stripe (účet HAVCO s.r.o.). Produkty + price IDs hotové, kľúče vo Verceli.
- **E-maily:** Resend SMTP (`noreply@erizika.sk`), doména verifikovaná.
- **Domény:** primárna `www.erizika.sk` (+ erizika.sk, e-rizika.sk, www.e-rizika.sk → redirect), DNS na Websupporte, SSL cez Vercel.

## Premenné prostredia (vo Verceli, nie v repe)
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_PROJECT/MONTHLY/3M/6M/YEAR`. Pozri `.env.example`.

## Cenník (finálny)
- Jednorazový projekt **15 €** (obmedzený počet činností do 15, platnosť 14 dní)
- Predplatné: **19 €/mes**, **49 €/3 mes**, **79 €/6 mes**, **99 €/rok** (neobmedzené, 20 činností/dokument)
- Zadarmo: 1 činnosť, plný obsah, len **PDF s vodoznakom** `www.erizika.sk` (Word je platený/editovateľný)

## Čo je HOTOVÉ
- Nasadenie (GitHub→Vercel→domény+SSL), prihlásenie (Google + e-mail/heslo s potvrdením cez Resend), generovanie, história, **profi výstupy PDF + Word na šírku**, freemium model (zadarmo = PDF s vodoznakom), tabová pracovná plocha (Hodnotenie/História/Profil), Stripe zapojený (kľúče + webhook + Billing Portal), vizuál v2 (animácie, mobil).

## Čo je PENDING / treba dokončiť
- **Stripe ID aktivácia** (čaká sa na overenie účtu) → potom reálny test platby (15 € + refund, predplatné) a aktivovať **Customer portal** v Stripe (Settings → Billing → Customer portal).
- **Otestovať výstupy** PDF/Word (formát, šírka, podpis). Paid výstup sa dá testovať aj manuálne: Supabase → `profiles` → `subscription_until` = budúci dátum.
- Voliteľné: „Zabudnuté heslo", slovenský predmet potvrdzovacieho e-mailu, ďalší vizuál.

## Dôležité poznámky k prostrediu
- Firemná sieť používateľa (`mp\`) **blokuje nové domény** ako „high-risk" → testovať web z **mobilných dát / domácej siete**.
- Na lokálnom PC **nie sú node/npm** — nebuilduj lokálne, spoliehaj sa na **Vercel build**. `git` a Git Credential Manager sú k dispozícii.
- Pri práci z viacerých PC: **`git pull` pred prácou, `git push` po práci.**

## Návody
- Plný návod na nasadenie a Stripe: `NAVOD-NASADENIE.md`.
