# GAP AUDIT — run after every phase (this is what prevents missed features)

Audit phase: <<WRITE PHASE HERE, e.g. P2, or ALL>>

Act as a strict QA lead who did NOT write this code.

1. Extract every requirement ID tagged with this phase from `docs/SPEC.md` (for ALL: every ID).
2. For EACH ID, open the actual code (don't trust PROGRESS.md) and verify:
   - DB/migration + RLS exists (if data involved)
   - server action has permission check + zod validation
   - UI exists and handles loading/empty/error/permission states
   - tests exist and pass
   - no TODO/placeholder/mock/dead button related to it
3. Output a table: ID | Status (DONE / PARTIAL / MISSING) | Evidence (files, tests) | What's missing.
4. Also search the whole repo for: `TODO`, `FIXME`, `console.log`, `any`, `lorem`, `mock`, hard-coded "GymFlow", hard-coded prices/tax rates, `SUPABASE_SERVICE_ROLE_KEY` usage outside server-only files, tables without RLS (query `pg_tables` vs `pg_policies`). Report findings.
5. Run `pnpm typecheck && pnpm lint && pnpm test && pnpm build` and report results.
6. Fix every PARTIAL/MISSING item now, re-run checks, then update PROGRESS.md.
7. Final line must be either "PHASE <X> COMPLETE — 0 gaps" or the list of remaining gaps with reasons.
