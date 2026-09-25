# PHASE 8 — Seed Data, Demo Users, Full Testing, Documentation, Deployment

Read `AGENTS.md`, `PROGRESS.md`, and every `[P8]` ID in `docs/SPEC.md`. Implement ALL of them.

Includes: SEED-01..02, DEMO-01, TEST-01..04, DOC-01..02, DB-05, DEP-01, DEP-03..05, ACC-01..28.

Steps:
1. Seed + demo users (credentials from env only).
2. Fill test gaps: run coverage, add missing success/failure tests for every module.
3. Write/finish all docs in DOC-01 with exact copy-paste commands.
4. CI workflow (DEP-04).
5. Deployment guide: create Supabase cloud project → push migrations → set Auth site URL/redirects to the Vercel URL → import GitHub repo in Vercel → env vars → deploy → run seed (optional) → verify.
6. Walk through ACC-01..ACC-28 one by one. For each, give: how verified (test name or manual steps) and result. Any failure → fix before ticking.

Exit criteria: every ACC ID passes; all checks pass. Then run `prompts/GAP_AUDIT.md` for ALL phases (P1–P8).
