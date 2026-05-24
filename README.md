# Vyapara Ledger (MVP)

React + TypeScript + Vite + Supabase based private ledger/reminder app for BC weekly and monthly interest accounts.

## Features in this scaffold
- Supabase auth-ready login route
- Customer and dues screens
- Dashboard KPI cards
- CSV report export
- SQL migrations with RLS and owner-based isolation
- BC installment generation function
- English + Telugu labels starter
- Mobile-first shell layout

## Project structure
- `src/components` layout and reusable UI blocks
- `src/pages` route pages (`/dashboard`, `/customers`, `/dues`, `/reports`, `/login`)
- `src/lib/supabase.ts` Supabase client
- `src/lib/i18n.ts` INR formatter + English/Telugu labels
- `supabase/migrations` SQL schema + policies
- `supabase/seed` sample data

## Setup
1. `npm install`
2. Copy `.env.example` to `.env`
3. Add Supabase URL and anon key
4. Run SQL in `supabase/migrations/202605240001_init.sql`
5. Optional seed using `supabase/seed/seed.sql`
6. `npm run dev`

## Tailwind + shadcn/ui
- Tailwind configured in `tailwind.config.ts` and `src/index.css`
- Add shadcn/ui components with: `npx shadcn@latest init`

## Business logic notes
- BC weekly: use `generate_bc_installments` DB function after account insert
- Monthly interest due = `principal * apr / 12 / 100`
- Payment updates should append to `payments`, then update `installments`, then `audit_logs`

## Telugu notes scan import (Phase 2)
- Mobile camera capture + OCR pipeline (Tesseract.js or Google Vision API)
- Store OCR draft text in `customer notes` import review screen
- Manual verification required before save


## Google login setup
1. In Supabase Dashboard -> Authentication -> Providers, enable **Google**.
2. Add Google OAuth client ID/secret in Supabase.
3. In Supabase URL Configuration, add redirect URLs:
   - `http://localhost:5173/dashboard`
   - `https://<your-vercel-domain>/dashboard`
4. Use the Login page "Continue with Google" button.

## Deploy (Vercel)
1. Push repo to GitHub
2. Import to Vercel
3. Framework: Vite
4. Build command: `npm run build`
5. Output dir: `dist`
6. Add env vars from `.env.example`

## Free-tier guidance
- Supabase free tier for DB/Auth
- Vercel free tier for frontend hosting
- Manual WhatsApp reminders via wa.me links keep cost at zero
