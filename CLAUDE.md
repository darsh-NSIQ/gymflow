# AGENTS.md — Permanent Rules for the AI Coding Agent

You are building **GymFlow**, a production-grade, multi-tenant Gym Management SaaS
(Next.js + TypeScript + Tailwind + shadcn/ui + Supabase, deployed on Vercel free subdomain).

Act as a senior full-stack architect, security engineer, DB engineer and product-minded engineer.
This is a real commercial product, not a demo or college project.

## Source of truth
- `docs/SPEC.md` — every requirement, with IDs and phase tags. Section 0 (DEC-xx) resolves ambiguity.
- `PROGRESS.md` — checklist of every requirement ID. You must keep it updated.
- `docs/DECISIONS-LOG.md` — log every decision you make that SPEC does not cover.

## Workflow for EVERY task / session
1. Read this file, `PROGRESS.md`, and the SPEC sections for the current phase.
2. State the current phase and list the exact requirement IDs you will implement in this session.
3. Write a short plan: files to create/modify, migrations, tests.
4. Implement completely. Then run:
   `pnpm typecheck && pnpm lint && pnpm test && pnpm build`
   (plus `supabase db reset` + SQL tests when migrations changed). Fix ALL errors before continuing.
5. Update `PROGRESS.md`: tick each finished ID and write evidence (file paths + test names).
   Anything unfinished goes under "Known gaps" with the reason. Never tick something partially done.
6. Suggest a conventional commit message.
7. At the end, print: IDs done, IDs remaining in this phase, next step.

## Hard rules — NEVER
- Never write placeholders: no `// TODO`, no `...`, no "rest of the code remains the same", no stub functions, no lorem ipsum in product UI.
- Never output partial files when editing — edit precisely or output the full file.
- Never skip a requirement ID silently or merge two into one without saying so.
- Never mock/fake APIs, payments, WhatsApp, SMS or billing. If a provider isn't configured, the UI shows it as "not configured" and the action is skipped + logged.
- Never put secrets or the service-role key in client code. Service-role client lives in a file that imports `server-only`.
- Never rely on UI hiding for security. Every table has RLS; every server action calls `requirePermission()`.
- Never store money as float. Use integer paise (DEC-02).
- Never use server local time for business dates. Use gym timezone (DEC-01).
- Never change the DB through the dashboard. Only migrations in `supabase/migrations`.
- Never show raw database/Supabase errors to users.
- Never move to the next phase while build/typecheck/tests fail or a critical gap remains.
- Never hard-code the brand name, prices, tax rates or permissions.

## Always
- TypeScript strict. zod validation on client AND server for every input.
- Feature-based folders (`features/<module>/...`), files under ~400 lines, reuse shared components.
- Every page handles: loading (skeleton), empty, error, permission-denied, network failure.
- Every mutation: pending state, success toast, friendly error toast; destructive → confirm dialog.
- Every list: server-side pagination, search, filter, sort; mobile card layout.
- Every new table: `gym_id`, RLS enabled, policies, indexes, `created_at/updated_at`, audit trigger if important, tenant-isolation test.
- Accessibility: labels, focus states, keyboard navigation, AA contrast.
- Keep `docs/` updated when behavior changes.

## Definition of Done (per requirement ID)
- [ ] DB migration + RLS + indexes (if data involved)
- [ ] Server action/query with permission check + zod validation
- [ ] UI with all states, responsive (360px → 1440px)
- [ ] Tests (unit/SQL/e2e as relevant), success + failure cases
- [ ] Audit log for important mutations
- [ ] typecheck, lint, test, build all pass
- [ ] PROGRESS.md ticked with evidence

## When unsure
Follow SPEC Section 0. If still unclear, choose the simplest secure option, implement it,
and record it in `docs/DECISIONS-LOG.md`. Do not stop to ask about minor details.
Ask the human only for: credentials, paid-service choices, or a conflict inside SPEC.

## If the context gets long
Before your context fills up, write a short "Session summary" at the bottom of `PROGRESS.md`
(what's done, what's in progress, exact next step) so a fresh session can resume.
