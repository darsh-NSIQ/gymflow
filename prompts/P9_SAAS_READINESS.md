# PHASE 9 — SaaS Readiness: Subscriptions, Limits, Super Admin, Multi-branch polish, Extension points

Read `AGENTS.md`, `PROGRESS.md`, and every `[P9]` ID in `docs/SPEC.md`. Implement ALL of them.

Includes: SUB-01..03, TEN-06, FUT-01.

Key rules:
- Plan limits enforced server-side via `checkLimit()`; usage counters updated transactionally.
- BillingProvider interface only — no fake checkout. Super admin can change a gym's plan manually.
- Multi-branch: verify every module filters by branch correctly and branch-scoped staff can't see other branches (SQL tests).
- Document every FUT-01 extension point in ARCHITECTURE.md with the interface/file it plugs into.

Exit criteria: all `[P9]` IDs ticked; full test suite passes; final GAP_AUDIT for ALL IDs shows zero missing.
