# PHASE 6 — Inventory, Equipment, Maintenance

Read `AGENTS.md`, `PROGRESS.md`, and every `[P6]` ID in `docs/SPEC.md`. Implement ALL of them.

Includes: STK-01..03, EQP-01..03, REM-06, RPT-03.

Key rules:
- Stock changes only via inventory_transactions in a DB function; stock can never go negative (test it).
- Product sale creates a payment (+ invoice if GST); purchase can optionally create an expense.
- Maintenance/warranty/low-stock/expiry reminders plug into the Phase 5 engine as new triggers.

Exit criteria: all `[P6]` IDs ticked with evidence; checks pass. Then run `prompts/GAP_AUDIT.md` for P6.
