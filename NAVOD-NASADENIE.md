# Rizika — návod na nasadenie (klik po kliku)

Celý postup zaberie cca 45 – 60 minút. Potrebujete účty: github.com, supabase.com, vercel.com, console.anthropic.com.

## 1. Supabase (databáza a prihlasovanie) — 15 min
1. Na supabase.com → **New project** → názov `e-rizika`, región **Frankfurt (eu-central-1)**, silné DB heslo (uložte si ho).
2. Po vytvorení: ľavé menu **SQL Editor** → **New query** → skopírujte CELÝ obsah súboru `supabase/schema.sql` → **Run**. Musí skončiť „Success".
3. Ľavé menu **Authentication → URL Configuration**: do **Site URL** dajte zatiaľ `http://localhost:3000` (po nasadení zmeníte na vašu doménu) a do **Redirect URLs** pridajte `https://VASA-DOMENA/auth/confirm`.
4. Ľavé menu **Project Settings → API**: odkopírujte si **Project URL**, **anon public** kľúč a **service_role** kľúč (ten nikdy nedávajte do verejného kódu).

## 1b. Prihlásenie cez Google — 15 min
1. Na **console.cloud.google.com** (prihláste sa Google účtom) → hore **Select a project → New Project** → názov `rizika` → Create.
2. Ľavé menu **APIs & Services → OAuth consent screen** → **Get started**: App name `Rizika`, support e-mail váš, Audience **External**, kontaktný e-mail váš → Create.
3. Ľavé menu **APIs & Services → Credentials** → **Create Credentials → OAuth client ID**:
   - Application type: **Web application**, názov `rizika-web`
   - **Authorized redirect URIs** → Add URI: vložte adresu zo Supabase — nájdete ju v Supabase **Authentication → Sign In / Providers → Google** ako „Callback URL" (tvar `https://VAS-PROJEKT.supabase.co/auth/v1/callback`)
   - Create → odkopírujte **Client ID** a **Client secret**.
4. V Supabase **Authentication → Sign In / Providers → Google**: zapnite **Enable**, vložte Client ID a Client secret → Save.
5. Hotovo — tlačidlo „Prihlásiť sa cez Google" na stránke začne fungovať. (Kým je Google aplikácia v režime „Testing", prihlásia sa len e-maily pridané v Audience → Test users; pred spustením prepnite na **Publish app**.)

## 2. Anthropic API — 5 min
1. console.anthropic.com → **API Keys** → **Create Key** → odkopírujte (zobrazí sa len raz).
2. V **Billing** dobite kredit (na štart stačí 20 USD; jedno hodnotenie stojí rádovo centy).

## 3. GitHub + Vercel (nasadenie) — 15 min
1. Na github.com vytvorte **nový privátny repozitár** `rizika`.
2. Nahrajte doň obsah tohto priečinka. Najjednoduchšie cez web: **uploading an existing file** → pretiahnite všetky súbory a priečinky (OKREM `node_modules`, `.next` a `.env.local`, ak existujú).
3. Na vercel.com → **Add New → Project** → **Import** repozitár `rizika`.
4. V kroku **Environment Variables** pridajte (názvy presne podľa `.env.example`):
   - `NEXT_PUBLIC_SUPABASE_URL` = Project URL zo Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon kľúč
   - `SUPABASE_SERVICE_ROLE_KEY` = service_role kľúč
   - `ANTHROPIC_API_KEY` = kľúč z Anthropic
   - `ANTHROPIC_MODEL` = `claude-sonnet-4-6`
5. **Deploy**. Po 2 – 3 minútach dostanete adresu `https://rizika-....vercel.app` — appka beží.

## 4. Doména — 10 min
1. Kúpte doménu (websupport.sk).
2. Vercel → projekt → **Settings → Domains** → pridajte doménu a nastavte DNS záznamy podľa pokynov Vercelu (vo Websupporte: DNS → pridať záznamy).
3. V Supabase **Authentication → URL Configuration** zmeňte Site URL na `https://vasadomena.sk` a v Redirect URLs nechajte `https://vasadomena.sk/auth/confirm`.

## 5. Prvý test
1. Otvorte stránku → **Vyskúšať zadarmo** → zadajte svoj e-mail → kliknite na odkaz v e-maile.
2. Vygenerujte hodnotenie (prvé je zadarmo) a stiahnite Word.
3. V Supabase **Table Editor → documents** uvidíte uložený dokument.

## 5. Stripe — platby (po schválení účtu) — 25 min
1. Na dashboard.stripe.com → **Product catalog → Add product**. Vytvorte 5 produktov (mena EUR):
   - `Predplatné mesačné` — Recurring, 19 €, Billing period **Monthly**
   - `Predplatné 3 mesiace` — Recurring, 51 €, Billing period **Every 3 months**
   - `Predplatné 6 mesiacov` — Recurring, 90 €, Billing period **Every 6 months**
   - `Predplatné ročné` — Recurring, 99 €, Billing period **Yearly**
   - `Jednorazový projekt` — One-off, 15 €
2. Pri každom produkte otvorte cenu a odkopírujte **Price ID** (začína `price_...`).
3. Vo Verceli → projekt → **Settings → Environment Variables** pridajte:
   - `STRIPE_SECRET_KEY` (Developers → API keys → Secret key)
   - `STRIPE_PRICE_MONTHLY`, `STRIPE_PRICE_3M`, `STRIPE_PRICE_6M`, `STRIPE_PRICE_YEAR`, `STRIPE_PRICE_PROJECT` (Price ID z kroku 2)
4. **Webhook** (automatická aktivácia po platbe): Stripe → **Developers → Webhooks → Add endpoint**
   - Endpoint URL: `https://VASA-DOMENA/api/stripe-webhook`
   - Events: `checkout.session.completed`, `invoice.paid`, `customer.subscription.deleted`
   - Po vytvorení odkopírujte **Signing secret** (`whsec_...`) → do Vercelu ako `STRIPE_WEBHOOK_SECRET`.
5. Vo Verceli dajte **Redeploy**, aby sa nové premenné načítali.
6. Test: v Stripe zapnite **Test mode**, použite testovaciu kartu `4242 4242 4242 4242` — po platbe sa v Supabase (profiles/projects) musí objaviť predplatné alebo projekt.

### Ako fungujú balíky (logika v kóde)
- **Zadarmo**: 1 pracovná činnosť; výsledok viditeľný celý, stĺpec Predpisy a Požadované konanie rozmazané, export zamknutý; max. 3 pokusy generovania.
- **Jednorazový projekt (15 €)**: obmedzený počet činností (15), platnosť 14 dní; každá vygenerovaná činnosť odpočíta 1; zostatok vidno v hlavičke aplikácie.
- **Predplatné**: bez limitov; platnosť sa predlžuje automaticky pri každej platbe (webhook), pri zrušení dobehne do konca obdobia.
- Manuálna aktivácia (predaj na faktúru) stále funguje: profiles → `subscription_until` = dátum konca, alebo projects → nový riadok s `expires_at`.

## Manuálna aktivácia zákazníkov (alternatíva k Stripe)
Prvých zákazníkov môžete fakturovať klasicky zo s.r.o. a aktivovať ručne:
- Supabase → **Table Editor → profiles** → nájdite zákazníka podľa e-mailu →
  - predplatné: `subscription_active` = `true`
  - jednorazový projekt: `project_credits` = počet zaplatených projektov
Toto je plnohodnotný spôsob predaja na prvé týždne — Stripe automatizáciu doplníme hneď, ako budete mať Stripe účet schválený.

## Poznámky
- E-maily s prihlasovacím odkazom posiela Supabase (na štart stačí; pre vlastnú adresu odosielateľa sa neskôr nastaví SMTP).
- Limity: neprihlásený nik negeneruje; bez predplatného/kreditu 1 dokument zadarmo; všetko sa vynucuje na serveri.
- Knižnica rizík je v `data/kniznica.json` — keď pošlete vyplnený katalóg, dostanete novú verziu tohto súboru a len ho v repozitári nahradíte (Vercel automaticky nasadí).
