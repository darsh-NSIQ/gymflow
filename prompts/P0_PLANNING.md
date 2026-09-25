# PHASE 0 — Architecture & Planning (NO feature code yet)

Read `AGENTS.md` and ALL of `docs/SPEC.md` (every section, every ID) before answering.

Goal: produce the complete blueprint. Do NOT write application feature code in this phase.

Create these files:

1. `docs/ARCHITECTURE.md`
   - System diagram (Mermaid): Browser/PWA → Next.js on Vercel (RSC, server actions, route handlers, middleware) → Supabase (Postgres + RLS, Auth, Storage, Realtime, pg_cron, Edge Functions) → external providers (email/WhatsApp/SMS/push/billing via interfaces).
   - Multi-tenancy model (gym → branches), how active gym/branch is resolved on each request.
   - Auth flow, invite flow, member-portal linking (DEC-15).
   - Permission model (3 layers, RBAC-05), helper SQL functions.
   - Notification/automation engine design (DEC-16, DEC-17, CHN-01).
   - Money, tax, dates, invoice numbering design (DEC-02, 03, 06, 07).
   - File storage design (DEC-18). Extension points (FUT-01).

2. `docs/DATABASE.md` — full ERD in Mermaid for ALL tables in DB-01, plus for each table: columns, types, constraints, FKs (with ON DELETE), indexes (IDX-01), RLS policy summary, and which phase creates it.

3. `docs/FOLDER_STRUCTURE.md` — full tree per STR-01 with a one-line purpose for each folder.

4. `docs/ROUTES.md` — every route: path, route group, who can access (permission key), purpose, main components. Include public, auth, onboarding, `/app/*` staff, `/portal/*` member, `/admin/*` super admin.

5. `ROLE_PERMISSIONS.md` — full matrix: roles × permission keys (RBAC-02, RBAC-04), branch-scope rules, trainer/member row-level rules.

6. `docs/UI_PAGE_MAP.md` — every page: sections, components, states, mobile behavior.

7. `docs/API.md` — every server action / route handler / RPC: name, input schema, permission, tables touched, audit event.

8. `docs/DESIGN_SYSTEM.md` — tokens, typography, spacing, component list (UI-01..UI-05), light/dark.

9. `docs/ROADMAP.md` — phases P1..P9 with the ID list per phase copied from SPEC tags.

10. `docs/DECISIONS-LOG.md` — start the log.

Finally, run a coverage check: list every ID in SPEC.md and show where it appears in the plan (file + section). Any ID not covered = add it before finishing. Print the coverage table.

Stop after this phase and wait for my approval.
