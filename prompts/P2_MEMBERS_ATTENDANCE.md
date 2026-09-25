# PHASE 2 — Members, Plans, Memberships, Trainers, Attendance, QR, Branches, Staff

Read `AGENTS.md`, `PROGRESS.md`, and every `[P2]` ID in `docs/SPEC.md`. Implement ALL of them.

Includes: MEM-01..07, PROF-01, PROF-02, PROF-06..08, PLAN-01..02, MS-01..05, ATT-01..05, ATT-07, QR-01..03, QR-05, TRN-01..02, RBAC-07, SET-03, SET-04, SEC-03, STACK-06, DASH-05 (trainer dashboard can show assigned members now; sessions filled in P4).

Key rules:
- Membership math strictly per DEC-03/04/05 with unit tests incl. 31 Jan, 29 Feb, leap years, freeze + resume, renewal while active, proration on upgrade/downgrade.
- Attendance rules per DEC-10/11. Check-in validation done in ONE DB function (atomic) called by a server action.
- QR per DEC-09. Scanner page works on mobile camera (HTTPS on Vercel; document local testing via `--experimental-https` or ngrok alternative).
- Member code per DEC-08. Uploads per DEC-18 / SEC-03.
- New tables: RLS + indexes + audit + tenant-isolation tests.

Exit criteria:
- Receptionist can register member → assign plan → check in via QR, code, phone search and manual; expired member blocked with "Membership Expired".
- Trainer only sees assigned members (SQL test proves it).
- All checks pass; PROGRESS.md updated. Then run `prompts/GAP_AUDIT.md` for P2.
