# PHASE 1 — Foundation: setup, auth, database core, RBAC, tenancy, onboarding, layout

Read `AGENTS.md`, `PROGRESS.md`, the Phase 0 docs, and every `[P1]` ID in `docs/SPEC.md`.
Implement ALL `[P1]` IDs. Nothing from later phases except what DEC-20 requires.

Order of work:
1. Project init: Next.js (App Router) + TS strict + Tailwind + shadcn/ui + lucide + ESLint/Prettier + pnpm scripts (STACK-08). `.gitignore` covers `.env*` except `.env.example`.
2. Supabase local setup (CLI), `supabase/migrations` for: gyms, branches, profiles, gym_staff, roles, permissions, role_permissions, user_roles, invitations, gym_settings, branch_settings, membership_plans, trainers, notification_templates, notification_automations (table only), audit_logs, invoice_counters, member code counter. Helper SQL functions (TEN-02), updated_at + audit triggers (AUD-01, AUD-02), indexes (IDX-01). Seed system roles + permissions + default matrix (RBAC-03/04).
3. Generate DB types (STACK-09). Supabase clients: browser, server, middleware, service-role (`server-only`).
4. `lib/`: `requirePermission()`, `getActiveContext()` (gym + branch + roles, TEN-04), `money` (DEC-02), `dates` (DEC-01, DEC-03 base helpers), `phone` (DEC-13), error mapper (ERR-01, SEC-08).
5. Auth pages & flows AUTH-01..09, AUTH-11, middleware (AUTH-04/05), role redirect (AUTH-06).
6. Onboarding wizard ONB-01..03 with transactional DB function.
7. App shell: sidebar, top bar (gym/branch switcher, bell placeholder that works as a link to notifications page shown as "coming in a later phase" empty state), bottom nav, theme/branding provider (BRAND-01/02), design system + shared components (UI-01..05), error/loading/not-found pages (ERR-02), i18n structure (IND-04), security headers (SEC-05).
8. Staff invite UI (minimal: invite, list, revoke) to satisfy AUTH-09.
9. Tests: unit (money, dates, phone, permission helper), SQL tests for RLS + tenant isolation of every P1 table (TEN-05, RBAC-09), e2e: signup → verify (mock email via local Inbucket/Mailpit) → onboarding → dashboard shell.

Exit criteria (all must be true):
- `pnpm typecheck && pnpm lint && pnpm test && pnpm build` pass; `supabase db reset` works.
- Two gyms created in tests cannot see each other's data.
- Every `[P1]` ID ticked in PROGRESS.md with evidence, or listed in Known gaps with reason.
Then run `prompts/GAP_AUDIT.md` for phase P1.
