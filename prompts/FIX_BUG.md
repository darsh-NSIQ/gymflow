# BUG FIX PROMPT

Bug: <<describe what happened, steps, expected vs actual, screenshot/error text>>

1. Reproduce: write a failing test first (unit/SQL/e2e as appropriate).
2. Find the root cause (explain in 2–3 lines). Don't patch symptoms.
3. Fix it without breaking other IDs; check RLS/permissions weren't weakened.
4. Run `pnpm typecheck && pnpm lint && pnpm test && pnpm build`.
5. Add a line to PROGRESS.md "Bug log": date, bug, cause, fix, test name.
