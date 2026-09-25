# PHASE 4 — Workouts, Diet, Progress, Personal Training, Member Portal

Read `AGENTS.md`, `PROGRESS.md`, and every `[P4]` ID in `docs/SPEC.md`. Implement ALL of them.

Includes: WO-01..06, DIET-01..05, PRG-01..04, PT-01..05, TRN-03, PORT-01..02, AUTH-10, RBAC-08, QR-04, PROF-04, RPT-02.

Key rules:
- Health/progress privacy per DEC-19 (RLS tests: unassigned trainer & accountant cannot read measurements/photos).
- Progress photos private, signed URLs, size/type validation.
- PT session overlap prevention enforced in DB (exclusion constraint or locked check).
- Member portal is mobile-first; member can only read own data (RLS tests) and edit only PORT-02 fields.
- Workout streak & adherence logic unit-tested in gym timezone.

Exit criteria:
- Trainer creates workout + diet → member logs in to portal → sees today's workout/diet → marks complete → trainer sees adherence.
- All checks pass; PROGRESS.md updated. Then run `prompts/GAP_AUDIT.md` for P4.
