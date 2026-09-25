# PHASE 5 — Notifications, Templates, Channels, Reminder Engine, Automation Builder, Churn

Read `AGENTS.md`, `PROGRESS.md`, and every `[P5]` ID in `docs/SPEC.md`. Implement ALL of them.

Includes: NOTI-01..03, CHN-01..03, TPL-01..02, REM-01..05, REM-07, AUTO-01..08, CHURN-01..02, INV-04, PROF-05.

Key rules:
- Channel adapter interface (CHN-01). In-app works fully; email works when env configured; WhatsApp/SMS/push adapters exist behind the interface and are marked "not configured" in UI without credentials — NEVER faked as sent.
- Scheduler per DEC-16 (pg_cron primary). Idempotency per DEC-17. Every attempt logged in reminder_logs.
- Condition builder stores JSON rules validated by zod; evaluated server-side/SQL.
- "Test automation" is a dry run (AUTO-05).
- Respect opt-outs and quiet hours. Churn wording per CHURN-02.
- Realtime unread badge via Supabase Realtime (RLS-safe).

Exit criteria:
- Tests prove: expiry-in-7-days reminder fires exactly once on the correct gym-tz date; disabled automation doesn't fire; opted-out member doesn't get marketing.
- All checks pass; PROGRESS.md updated. Then run `prompts/GAP_AUDIT.md` for P5.
