# RESUME — use this at the start of every NEW chat/session

Read `AGENTS.md`, `PROGRESS.md` (especially "Session summary" and "Known gaps"), and `docs/SPEC.md`.

Then tell me:
1. Current phase.
2. IDs done in this phase, IDs remaining.
3. Whether the last session left the build broken (run `pnpm typecheck && pnpm lint && pnpm test && pnpm build` to confirm).

Then continue with the next remaining ID of the current phase following the AGENTS.md workflow.
Do not redo completed work. Do not start the next phase until GAP_AUDIT for this phase shows 0 gaps.
