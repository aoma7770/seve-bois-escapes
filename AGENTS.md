# Base44 Dev Environment

## Stack
- **Frontend**: Vite 7 + React 19 + TailwindCSS 4 (client-served via Express Vite middleware, single origin on port 3000)
- **Backend**: Express + tRPC 11 (server entry: `server/_core/index.ts`)
- **Database**: MySQL 8 via Drizzle ORM (`mysql2` driver)
- **Package manager**: pnpm 10.4.1 (specified in `packageManager` field)

## Running
```bash
docker compose -f docker-compose.base44.yml up -d
```
- `db` — MySQL 8 with healthcheck
- `migrate` — one-shot service that runs `drizzle-kit push --force` to sync `drizzle/schema.ts` to the database, then exits
- `app` — runs `pnpm dev` (=`NODE_ENV=development tsx watch server/_core/index.ts`), live reload via Vite HMR + tsx watch

## Database migrations — IMPORTANT
The SQL migration files in `drizzle/*.sql` are **out of sync** with `drizzle/schema.ts`. Migration 0001 creates a `cottages` table, but the schema references `properties` — there is no migration that renames `cottages` → `properties` or creates `amenities`/`property_photos`. Running `drizzle-kit migrate` will fail. **Always use `drizzle-kit push`** (which syncs schema.ts directly) instead of `migrate`.

## Environment variables
- `DATABASE_URL` — set inline in compose (local MySQL)
- `JWT_SECRET` — admin session HMAC secret; has a dev fallback in code but a placeholder is in `.env.base44-defaults`
- `VITE_APP_ID`, `VITE_OAUTH_PORTAL_URL`, `OAUTH_SERVER_URL`, `OWNER_OPEN_ID` — OAuth config (not functional without a real OAuth server)
- `BUILT_IN_FORGE_API_URL`, `BUILT_IN_FORGE_API_KEY` — Forge data API (optional)
- `SMTP_HOST/PORT/USER/PASS` — email (Nodemailer); has defaults, non-functional without `SMTP_PASS`
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` — Stripe payments (optional; `getStripe()` returns null if no key)

All non-secret placeholders live in `.env.base44-defaults` (first in `env_file`); real secrets are delivered via `/run/base44/app.env` (last in `env_file`, always wins).

## Path aliases
- `@/*` → `client/src/*`
- `@shared/*` → `shared/*`

## Images — local serving
All 85 production images (84 WebP/JPG + 1 PDF guide) were downloaded from the original Manus-hosted site (`https://sevebois.manus.space/manus-storage/`) and stored in `client/public/manus-storage/`. The storage proxy (`server/_core/storageProxy.ts`) serves these local files first, falling back to the Forge API only if a file isn't found locally. Since `forge.manus.im` doesn't resolve from this sandbox, the local files are the primary serving path.

## Known warnings (harmless)
- `[OAuth] OAUTH_SERVER_URL is not configured` — expected without OAuth server (downgraded to warn)
- `Ignored build scripts: @tailwindcss/oxide, esbuild` — pnpm safety feature, doesn't affect dev

## Verification
- `curl http://localhost:3000/` → 200 with Vite-served HTML
- `curl http://localhost:3000/api/trpc/cottages.list` → `{"result":{"data":{"json":[]}}}` (empty until properties are seeded)
- `pnpm check` — TypeScript type check
- `pnpm test` — Vitest tests
