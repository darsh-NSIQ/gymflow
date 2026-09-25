# PHASE 3 — Payments, Invoices, Expenses, Revenue, Dashboard, Reports

Read `AGENTS.md`, `PROGRESS.md`, and every `[P3]` ID in `docs/SPEC.md`. Implement ALL of them.

Includes: PAY-01..07, INV-01..03, EXP-01..03, FIN-01..02, DASH-01..04, TBL-01, RPT-01, RPT-04, ATT-06, PROF-03, STACK-05, IND-02, IND-03.

Key rules:
- Money integer paise (DEC-02). GST per DEC-06 with tests for inclusive/exclusive, CGST+SGST vs IGST, rounding, non-GST gym.
- Invoice numbers via locked counter DB function per DEC-07; test concurrent generation (no duplicates, no gaps).
- Outstanding balance always derived (PAY-04). Refunds → credit note, audited.
- Dashboard & reports aggregate in SQL (views/RPC), filtered by gym tz date range + branch.
- Shared DataTable (TBL-01) retro-fitted to Phase 2 lists (members, memberships, attendance).
- Amount in words, Indian format (IND-01).

Exit criteria:
- Partial payment → second payment → status paid → invoice PDF downloads with correct GST lines.
- Dashboard numbers match a hand-calculated test fixture (write this test).
- All checks pass; PROGRESS.md updated. Then run `prompts/GAP_AUDIT.md` for P3.
