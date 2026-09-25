# PROGRESS.md — Requirement Checklist

Auto-generated from `docs/SPEC.md`. The agent ticks an item ONLY when fully done, and adds evidence after the arrow.
Format: `- [x] ID — short title → evidence: files, test names`

Total requirements: 281

## Phase 0 — Decisions (verify they are implemented where used) (22)
- [ ] DEC-01 — Timezone: store all timestamps as `timestamptz` (UTC). "Today", "this month", expiry and r → evidence: 
- [ ] DEC-02 — Money: store all amounts as `bigint` in minor units (paise). All calculations use integer → evidence: 
- [ ] DEC-03 — Membership dates: `end_date = start_date + plan duration − 1 day` (inclusive). Month-based → evidence: 
- [ ] DEC-04 — Freeze: freezing records a `membership_freezes` row (start, end, reason). On resume, `end_ → evidence: 
- [ ] DEC-05 — Membership status is derived: `upcoming | active | frozen | expired | cancelled`. Member s → evidence: 
- [ ] DEC-06 — Tax / GST: gym setting `gst_registered` (default false). If true: GSTIN required, rate con → evidence: 
- [ ] DEC-07 — Invoice numbering: per gym, per Indian financial year (1 Apr – 31 Mar), configurable prefi → evidence: 
- [ ] DEC-08 — Member code: per-gym sequential with configurable prefix (e.g. `GF-0001`), generated in DB → evidence: 
- [ ] DEC-09 — QR code content: an opaque, regenerable `qr_token` (random UUID or HMAC-signed token). Nev → evidence: 
- [ ] DEC-10 — Attendance duplicates: a member can have only one open check-in at a time (partial unique → evidence: 
- [ ] DEC-11 — Grace access: setting `grace_days` (default 0). Expired members are refused with "Membersh → evidence: 
- [ ] DEC-12 — Soft delete: `deleted_at` on members, trainers, staff, plans, products, equipment, expense → evidence: 
- [ ] DEC-13 — Phone numbers: stored in E.164. Default country +91; Indian mobiles validated as 10 digits → evidence: 
- [ ] DEC-14 — Date display format is a gym setting (default `DD/MM/YYYY` for India). → evidence: 
- [ ] DEC-15 — Users vs members vs staff: Supabase `auth.users` is identity. `profiles` (1:1 with auth us → evidence: 
- [ ] DEC-16 — Scheduler: reminders/nightly jobs run via Supabase `pg_cron` calling a DB function or Edge → evidence: 
- [ ] DEC-17 — Reminder idempotency: `reminder_logs` has a unique key `(automation_id, entity_type, entit → evidence: 
- [ ] DEC-18 — Files: private Supabase Storage buckets, path `{gym_id}/{entity}/{id}/{filename}`, storage → evidence: 
- [ ] DEC-19 — Health & privacy: health notes, measurements and progress photos are visible only to the m → evidence: 
- [ ] DEC-20 — Onboarding needs plans & trainers: the `membership_plans`, invitations and `trainers` tabl → evidence: 
- [ ] DEC-21 — All app URLs come from `NEXT_PUBLIC_APP_URL`. Nothing references `gymflow.vercel.app` dire → evidence: 
- [ ] DEC-22 — Ambiguity rule: if a detail is not specified, choose the simplest secure option, implement → evidence: 

## Phase 1 — Foundation (72)
- [ ] GEN-01 — TypeScript `strict: true` everywhere. No `any` unless justified in a comment. → evidence: 
- [ ] GEN-02 — No hard-coded business data, brand names, prices, tax rates or permissions in code. They c → evidence: 
- [ ] GEN-03 — No secrets in client code. Service-role key is used only in files importing `server-only`. → evidence: 
- [ ] GEN-04 — No sensitive data (tokens, roles, PII) in localStorage/sessionStorage. → evidence: 
- [ ] GEN-05 — No fake APIs or mock data in production code paths. Demo data exists only via seed scripts → evidence: 
- [ ] GEN-06 — No dead buttons. Every control works, or is visibly disabled with a tooltip explaining why → evidence: 
- [ ] GEN-07 — Reusable components; no duplicated components. → evidence: 
- [ ] GEN-08 — Every data list: server-side pagination, search, filter, sort. → evidence: 
- [ ] GEN-09 — Every mutation: loading state, success toast, friendly error toast. Destructive actions re → evidence: 
- [ ] GEN-10 — Accessibility: labels, keyboard navigation, visible focus, WCAG AA contrast, aria attribut → evidence: 
- [ ] GEN-11 — Mobile-first responsive layout for every page. → evidence: 
- [ ] GEN-12 — Every state handled per page: loading (skeleton), empty, error, permission denied, network → evidence: 
- [ ] BRAND-01 — Working name "GymFlow" lives in one config file only (platform default). → evidence: 
- [ ] BRAND-02 — Gym-level name, logo, primary color applied via a theme provider (CSS variables). No liter → evidence: 
- [ ] STACK-01 — Next.js (App Router, latest stable), React, TypeScript, Tailwind CSS, shadcn/ui, lucide-re → evidence: 
- [ ] STACK-02 — Supabase Postgres, Auth, Storage; `@supabase/ssr` for cookie-based sessions. → evidence: 
- [ ] STACK-03 — zod schemas shared between client and server; react-hook-form for forms. → evidence: 
- [ ] STACK-04 — TanStack Table for tables; Recharts for charts; date-fns + date-fns-tz for dates. → evidence: 
- [ ] STACK-07 — Vitest (unit), Playwright (e2e), SQL/RLS tests (pgTAP via Supabase CLI or equivalent). → evidence: 
- [ ] STACK-08 — pnpm, ESLint, Prettier. Scripts: `dev`, `build`, `typecheck`, `lint`, `test`, `test:e2e`, → evidence: 
- [ ] STACK-09 — Supabase generated TypeScript types committed and used everywhere. → evidence: 
- [ ] STR-01 — Folders: `app/`, `components/ui`, `components/shared`, `features/<module>/{components,acti → evidence: 
- [ ] STR-02 — No source file above ~400 lines; split by responsibility. → evidence: 
- [ ] STR-03 — UI never imports the service-role client. Data access only via feature server actions/quer → evidence: 
- [ ] RBAC-01 — Roles: `super_admin` (platform), `owner`, `branch_manager`, `receptionist`, `trainer`, `nu → evidence: 
- [ ] RBAC-02 — Permission keys (minimum): members.view/create/update/delete/export, plans.manage, members → evidence: 
- [ ] RBAC-03 — `roles`, `permissions`, `role_permissions`, `user_roles` tables. System roles have `gym_id → evidence: 
- [ ] RBAC-04 — Default matrix: Owner = all. Manager = members, memberships, attendance, payments, trainer → evidence: 
- [ ] RBAC-05 — Enforcement in 3 layers: RLS (source of truth) + `requirePermission()` in every server act → evidence: 
- [ ] RBAC-06 — Branch scope: `user_roles.branch_id` nullable (NULL = all branches). → evidence: 
- [ ] RBAC-09 — Tests prove each role can/can't perform representative actions. → evidence: 
- [ ] TEN-01 — Every tenant table has `gym_id NOT NULL` FK; branch-scoped tables also have `branch_id`. → evidence: 
- [ ] TEN-02 — RLS enabled on EVERY table (no exceptions). Helper functions `is_gym_staff(gym_id)`, `has_ → evidence: 
- [ ] TEN-03 — Child rows must match parent gym (composite FKs or validation triggers), e.g. a payment's → evidence: 
- [ ] TEN-04 — A user may belong to multiple gyms. Active gym/branch switcher; selection stored in a cook → evidence: 
- [ ] TEN-05 — Tenant isolation tests: Gym A user cannot select/insert/update/delete Gym B rows for every → evidence: 
- [ ] AUTH-01 — Email/password sign up, login, logout. → evidence: 
- [ ] AUTH-02 — Email verification required before creating a gym. → evidence: 
- [ ] AUTH-03 — Forgot password + reset password pages. → evidence: 
- [ ] AUTH-04 — Session persistence via `@supabase/ssr`; middleware refreshes session. → evidence: 
- [ ] AUTH-05 — Protected routes (middleware + server-side check in layouts). → evidence: 
- [ ] AUTH-06 — Role-based redirect after login: owner/manager/receptionist/accountant → `/app/dashboard`; → evidence: 
- [ ] AUTH-07 — Optional phone number on profile (E.164). → evidence: 
- [ ] AUTH-08 — Google login: architecture ready; button shown only if enabled via env/config, otherwise h → evidence: 
- [ ] AUTH-09 — Staff invite: invite by email + role + branch → server-side Supabase admin invite → invite → evidence: 
- [ ] AUTH-11 — Friendly auth error messages; no raw Supabase errors shown. → evidence: 
- [ ] ONB-01 — Shown when a verified owner has no gym. Steps: 1 gym name, 2 logo, 3 address (incl. state → evidence: 
- [ ] ONB-02 — Progress persisted per step (resume after refresh), back/next, per-step validation, progre → evidence: 
- [ ] ONB-03 — Finish runs ONE transactional DB function: creates gym, default branch "Main", owner role, → evidence: 
- [ ] SET-01 — Settings storage: typed `gym_settings` (and `branch_settings` overrides) with zod schema v → evidence: 
- [ ] AUD-01 — `audit_logs`: gym_id, user_id, action, entity, entity_id, timestamp, metadata (before/afte → evidence: 
- [ ] AUD-02 — Audit logs are append-only (no update/delete policies). → evidence: 
- [ ] SEC-01 — RLS everywhere (see TEN-02). Service-role usage limited, listed in `SECURITY.md`. → evidence: 
- [ ] SEC-02 — Server-side zod validation on every action/route; never trust client role checks. → evidence: 
- [ ] SEC-04 — Env vars only; `.env*` in `.gitignore`; `.env.example` committed. → evidence: 
- [ ] SEC-05 — Security headers (CSP, X-Frame-Options, Referrer-Policy) in Next config. → evidence: 
- [ ] SEC-08 — No raw DB errors to users; errors logged server-side with a request id. → evidence: 
- [ ] DB-01 — Normalized schema via Supabase migrations (never manual dashboard edits). Tables (minimum) → evidence: 
- [ ] DB-02 — Each phase adds its own migrations; tables needed early (DEC-20) are created in P1. → evidence: 
- [ ] DB-03 — `created_at`, `updated_at` (trigger), `created_by` on important tables; `deleted_at` per D → evidence: 
- [ ] DB-04 — Proper FKs with explicit ON DELETE behavior; CHECK constraints for enums/amounts ≥ 0. → evidence: 
- [ ] IDX-01 — Indexes: gym_id, branch_id, member_id, phone, email, membership status, membership end_dat → evidence: 
- [ ] UI-01 — Design system: tokens (colors, radius, spacing, shadows) as CSS variables, light/dark mode → evidence: 
- [ ] UI-02 — Style: clean, professional, fitness-focused, minimal, soft shadows, no excessive gradients → evidence: 
- [ ] UI-03 — Layout: desktop sidebar (collapsible, permission-filtered), top bar with gym/branch switch → evidence: 
- [ ] UI-04 — Mobile bottom nav: Home, Members, Attendance, Payments, More. → evidence: 
- [ ] UI-05 — Shared components: DataTable, EmptyState, ErrorState, Skeletons, ConfirmDialog, FormField → evidence: 
- [ ] IND-01 — INR default, `en-IN` number formatting (lakhs/crores), amount in words. → evidence: 
- [ ] IND-04 — i18n-ready structure (e.g. next-intl) with English strings in message files; Hindi/Gujarat → evidence: 
- [ ] DEP-02 — `.env.example` with: NEXT_PUBLIC_APP_URL, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_A → evidence: 
- [ ] ERR-01 — Central error mapper: DB/Supabase errors → friendly messages (e.g. "Unable to record atten → evidence: 
- [ ] ERR-02 — `error.tsx`, `not-found.tsx`, `loading.tsx` for route groups; permission-denied page. → evidence: 

## Phase 7 — PWA, Mobile, Search, Settings, Security (14)
- [ ] BRAND-03 — Branding settings page (name, logo, color) with live preview. → evidence: 
- [ ] RBAC-10 — Permission matrix UI in settings: view all, edit custom roles, system roles read-only. → evidence: 
- [ ] PWA-01 — Web manifest (name from gym branding where possible), icons (192, 512, maskable), theme co → evidence: 
- [ ] PWA-02 — Service worker (e.g. Serwist): cache app shell/static assets; network-first for data; offl → evidence: 
- [ ] PWA-03 — Install prompt UX on Android; iOS "Add to Home Screen" instructions. → evidence: 
- [ ] PWA-04 — Web push architecture (VAPID keys in env, subscription table), used by push channel where → evidence: 
- [ ] SRCH-01 — Global search (Cmd/Ctrl+K + mobile search): members, trainers, memberships, payments, invo → evidence: 
- [ ] SET-02 — Settings pages: gym profile, logo, contact, address, business hours, currency, timezone, d → evidence: 
- [ ] AUD-03 — Audit log page (permission `audit.view`) with filters by user, entity, action, date. → evidence: 
- [ ] SEC-06 — Rate limiting on auth, attendance scan, public endpoints (architecture: interface with in- → evidence: 
- [ ] SEC-07 — Security review checklist executed and recorded in `SECURITY.md` (IDOR checks, RLS test co → evidence: 
- [ ] UI-06 — Mobile dashboard shows: today's attendance, membership status summary, pending payments, t → evidence: 
- [ ] RESP-01 — Verified at 360px, 390px, 768px, 1024px, 1440px for every main page (Playwright screenshot → evidence: 
- [ ] LAND-01 — Public `/` page: hero, features, how it works, for gym owners, for trainers, for members, → evidence: 

## Phase 3 — Payments, Invoices, Expenses, Reports (27)
- [ ] STACK-05 — Server-side PDF generation (e.g. @react-pdf/renderer). → evidence: 
- [ ] DASH-01 — KPI cards: total members, active, expiring (next 7 days, configurable), expired, today's a → evidence: 
- [ ] DASH-02 — Charts: revenue trend, new member trend, attendance trend, membership distribution, paymen → evidence: 
- [ ] DASH-03 — Quick actions (each opens a working form): add member, record payment, mark attendance, cr → evidence: 
- [ ] DASH-04 — Date range + branch filter. Aggregates computed in SQL (views/RPC), not client-side loops. → evidence: 
- [ ] PROF-03 — Payments tab complete. → evidence: 
- [ ] ATT-06 — Analytics: peak hours heatmap, daily/weekly/monthly attendance, member attendance %. → evidence: 
- [ ] PAY-01 — Methods: cash, UPI, card, bank transfer, online, custom methods (gym-defined). → evidence: 
- [ ] PAY-02 — Fields: payment id, member, membership/PT/product reference, amount, discount, tax, final → evidence: 
- [ ] PAY-03 — Statuses: paid, partial, pending, failed, refunded. → evidence: 
- [ ] PAY-04 — Partial payments: multiple payments against one due; outstanding balance always derived fr → evidence: 
- [ ] PAY-05 — Refunds (permission `payments.refund`), with reason, audited, credit note. → evidence: 
- [ ] PAY-06 — Pending/overdue payments list with filters. → evidence: 
- [ ] PAY-07 — Tests: partial → paid transitions, refund, tax calc, rounding, cross-gym rejection. → evidence: 
- [ ] INV-01 — Invoice/receipt with gym logo, details, GSTIN (if configured), invoice number (DEC-07), me → evidence: 
- [ ] INV-02 — Printable HTML view + PDF download. → evidence: 
- [ ] INV-03 — Invoice settings: prefix, terms, footer note, show/hide fields. → evidence: 
- [ ] EXP-01 — Categories (gym-editable, seeded): rent, electricity, water, salary, trainer commission, e → evidence: 
- [ ] EXP-02 — Fields: amount, date, category, branch, vendor, notes, receipt attachment (private storage → evidence: 
- [ ] EXP-03 — CRUD with filters, soft delete, audit. → evidence: 
- [ ] FIN-01 — Revenue, expenses, net operating result for any date range/branch. → evidence: 
- [ ] FIN-02 — Charts: daily, monthly, annual revenue; revenue by membership plan, by branch, by trainer/ → evidence: 
- [ ] TBL-01 — Shared DataTable component: search, sort, filters (date range, status, branch, trainer), p → evidence: 
- [ ] RPT-01 — Reports: membership, attendance, revenue, payment, pending payment, expense, profit, train → evidence: 
- [ ] RPT-04 — Each report: date filter, branch filter, other relevant filters, on-screen table + summary → evidence: 
- [ ] IND-02 — UPI, cash, bank transfer, card methods seeded. → evidence: 
- [ ] IND-03 — GST per DEC-06 (CGST/SGST/IGST), GSTIN validation (15-char format), non-GST gyms fully sup → evidence: 

## Phase 2 — Members, Memberships, Trainers, Attendance (37)
- [ ] STACK-06 — QR generation (`qrcode`) and camera scanning library (e.g. html5-qrcode or @zxing/browser) → evidence: 
- [ ] RBAC-07 — Trainer/nutritionist see only members assigned to them (`trainer_members`). → evidence: 
- [ ] DASH-05 — Trainer dashboard (see TRN-03). → evidence: 
- [ ] MEM-01 — Fields: member code (auto), full name, photo, gender, DOB, phone, email, address, emergenc → evidence: 
- [ ] MEM-02 — Statuses: active, inactive, frozen, suspended, expired, archived (per DEC-05). → evidence: 
- [ ] MEM-03 — Create / edit / archive (soft delete) / restore. Duplicate-phone warning within gym. → evidence: 
- [ ] MEM-04 — List: search (name, phone, member code), filters (status, branch, trainer, plan, date rang → evidence: 
- [ ] MEM-05 — Mobile: table becomes card list. → evidence: 
- [ ] MEM-06 — Photo upload with type (jpg/png/webp) and size (≤2 MB) validation, private storage. → evidence: 
- [ ] MEM-07 — Sensitive fields (health notes, DOB, address) hidden from roles without need (e.g. account → evidence: 
- [ ] PROF-01 — Header: photo, name, code, status badge, current plan, expiry date, days remaining, attend → evidence: 
- [ ] PROF-02 — Tabs: Overview, Membership, Attendance, Payments, Workout, Diet, Progress, PT Sessions, No → evidence: 
- [ ] PROF-06 — Documents tab: upload/list/download (signed URLs)/delete with confirmation. → evidence: 
- [ ] PROF-07 — Notes tab: timestamped staff notes with author. → evidence: 
- [ ] PROF-08 — Activity timeline built from audit log + domain events. → evidence: 
- [ ] PLAN-01 — Unlimited plans. Fields: name, duration (value + unit days/months), price, description, ac → evidence: 
- [ ] PLAN-02 — Plan types supported via fields: monthly, quarterly, half-yearly, yearly, couple, family, → evidence: 
- [ ] MS-01 — Membership fields: id, member(s), plan, start, end, price, discount, tax, final amount, pa → evidence: 
- [ ] MS-02 — Actions: assign, renew (starts day after current end if still active), upgrade, downgrade → evidence: 
- [ ] MS-03 — Every action recorded in `membership_events` and audit log. → evidence: 
- [ ] MS-04 — Unit tests for end-date, days remaining, freeze extension, renewal, proration, including m → evidence: 
- [ ] MS-05 — Creating/renewing a membership creates a pending payment due (links to Phase 3 payments; i → evidence: 
- [ ] ATT-01 — Methods: QR scan, member code entry, mobile number search, manual selection. → evidence: 
- [ ] ATT-02 — Check-in and check-out. → evidence: 
- [ ] ATT-03 — Record: member, date (gym tz), check-in, check-out, branch, method, device info/IP (option → evidence: 
- [ ] ATT-04 — Validation before check-in: membership active, not frozen/suspended, branch access allowed → evidence: 
- [ ] ATT-05 — Attendance screen: today's check-ins, currently inside, quick search, big success/error fe → evidence: 
- [ ] ATT-07 — Tests: expired blocked, frozen blocked, duplicate prevented, check-out works, other-gym me → evidence: 
- [ ] QR-01 — QR generated for every member from `qr_token` (DEC-09); downloadable/printable member ID c → evidence: 
- [ ] QR-02 — Scanner page (camera) for reception: identifies member, validates membership, shows status → evidence: 
- [ ] QR-03 — Expired → shows "Membership Expired" and does NOT record attendance unless grace is enable → evidence: 
- [ ] QR-05 — Regenerate QR (invalidates old one), audited. → evidence: 
- [ ] TRN-01 — Fields: name, photo, phone, email, specialization, experience, joining date, salary, commi → evidence: 
- [ ] TRN-02 — Assign/unassign members (`trainer_members`), history kept. → evidence: 
- [ ] SET-03 — Branch management: create/edit/deactivate branches, branch hours, branch settings override → evidence: 
- [ ] SET-04 — Staff management: list, invite, change role/branch, deactivate (revokes access immediately → evidence: 
- [ ] SEC-03 — Secure uploads: MIME + extension + size validation server-side, private buckets, signed UR → evidence: 

## Phase 4 — Workout, Diet, Progress, PT, Portal (28)
- [ ] RBAC-08 — Member sees only own records (enforced in RLS via `members.user_id = auth.uid()`). → evidence: 
- [ ] AUTH-10 — Member portal invite: staff sends portal invite to a member with email; links `members.use → evidence: 
- [ ] PROF-04 — Workout, Diet, Progress, PT tabs complete. → evidence: 
- [ ] QR-04 — Member sees own QR in portal. → evidence: 
- [ ] TRN-03 — Trainer dashboard: assigned members, today's sessions, upcoming sessions, pending workout → evidence: 
- [ ] WO-01 — Plan: name, goal, level, duration, trainer, member, start, end. Reusable templates + assig → evidence: 
- [ ] WO-02 — Weekly structure Monday–Sunday (rest days allowed). → evidence: 
- [ ] WO-03 — Exercise library (gym-level): name, muscle group, default video URL, image. → evidence: 
- [ ] WO-04 — Plan exercise fields: sets, reps, weight, rest, tempo, notes, order. → evidence: 
- [ ] WO-05 — Member marks exercises completed/skipped; `workout_logs`. → evidence: 
- [ ] WO-06 — Stats: completed, skipped, streak, history. → evidence: 
- [ ] DIET-01 — Targets: calories, protein, carbs, fat, water. → evidence: 
- [ ] DIET-02 — Meals: breakfast, mid-morning, lunch, evening snack, dinner, pre-workout, post-workout. → evidence: 
- [ ] DIET-03 — Food items with quantity, calories, protein, carbs, fat, notes; totals auto-calculated vs → evidence: 
- [ ] DIET-04 — Member marks meals completed; `diet_logs`. → evidence: 
- [ ] DIET-05 — Diet templates reusable across members. → evidence: 
- [ ] PRG-01 — Measurements: weight, height, BMI (auto), body fat, chest, waist, arms, thighs, shoulders, → evidence: 
- [ ] PRG-02 — Photos: front, side, back; private storage; signed URLs. → evidence: 
- [ ] PRG-03 — Charts: weight, waist, body fat over time. → evidence: 
- [ ] PRG-04 — Before/after comparison (choose two dates, side by side). → evidence: 
- [ ] PT-01 — PT packages: name, sessions, price, validity, trainer. → evidence: 
- [ ] PT-02 — Member PT package: total, used, remaining sessions (auto-updated). → evidence: 
- [ ] PT-03 — Sessions: trainer, member, date/time, duration, status (scheduled, completed, cancelled, n → evidence: 
- [ ] PT-04 — Trainer clash prevention (no overlapping sessions). → evidence: 
- [ ] PT-05 — PT revenue shown separately in reports and trainer commission calculation. → evidence: 
- [ ] PORT-01 — Mobile-first `/portal`: membership status, days remaining, today's workout, today's diet, → evidence: 
- [ ] PORT-02 — Member can edit limited profile fields (photo, phone, emergency contact) only. → evidence: 
- [ ] RPT-02 — Reports: PT, workout adherence, progress. → evidence: 

## Phase 9 — SaaS Readiness (5)
- [ ] TEN-06 — Super-admin area (`/admin`) to view gyms, suspend a gym, view subscription; all actions au → evidence: 
- [ ] SUB-01 — `subscription_plans` (Free, Basic, Pro, Enterprise) with limits: members, branches, staff, → evidence: 
- [ ] SUB-02 — `subscriptions` per gym + `usage_counters`; limit checks in server actions (`checkLimit()` → evidence: 
- [ ] SUB-03 — `BillingProvider` interface (Razorpay/Stripe adapters later). No fake checkout. Plan chang → evidence: 
- [ ] FUT-01 — Clean extension points documented in `docs/ARCHITECTURE.md` for: WhatsApp Business API, Ra → evidence: 

## Phase 5 — Notifications, Reminders, Automation (26)
- [ ] PROF-05 — Notifications tab complete. → evidence: 
- [ ] INV-04 — Send invoice by email (when email provider configured). → evidence: 
- [ ] REM-01 — Membership: expiry in 30/15/7/3/1 days, expired. → evidence: 
- [ ] REM-02 — Payments: due, overdue, partial pending. → evidence: 
- [ ] REM-03 — Attendance: inactive 3/7/14/30 days. → evidence: 
- [ ] REM-04 — Workout: reminder, plan expired, review due. Diet: meal reminder, review due. → evidence: 
- [ ] REM-05 — PT: session reminder, follow-up. Progress: monthly measurement, photo reminder. → evidence: 
- [ ] REM-07 — Marketing: birthday, gym anniversary (joining date), festival campaign (date-based), renew → evidence: 
- [ ] AUTO-01 — Builder: WHEN (trigger) → CONDITION (field, operator, value; AND/OR groups) → THEN (one or → evidence: 
- [ ] AUTO-02 — Triggers: membership expires, payment due, member inactive, birthday, PT session, progress → evidence: 
- [ ] AUTO-03 — Actions: in-app notification, create task (staff task list), email, WhatsApp, SMS, push. C → evidence: 
- [ ] AUTO-04 — Custom message templates per action, enable/disable, schedule (time of day in gym tz, quie → evidence: 
- [ ] AUTO-05 — "Test automation": dry-run preview showing matched members and rendered messages without s → evidence: 
- [ ] AUTO-06 — Engine runs per DEC-16, idempotent per DEC-17, logs each attempt with status (sent/skipped → evidence: 
- [ ] AUTO-07 — Staff task list (`tasks` table): assignee, due date, status, related entity. → evidence: 
- [ ] AUTO-08 — Tests: each trigger fires on correct day in gym tz, not twice, respects disabled automatio → evidence: 
- [ ] NOTI-01 — Notification center with types: payment, membership, attendance, workout, diet, PT, progre → evidence: 
- [ ] NOTI-02 — Read/unread, timestamp, priority, related entity link, mark all read, bell with unread cou → evidence: 
- [ ] NOTI-03 — Manual "send notification" to a member, a filtered segment, or all members (permission `no → evidence: 
- [ ] CHN-01 — Provider interface `NotificationChannel { send(message): Result }` with implementations: i → evidence: 
- [ ] CHN-02 — Provider keys only in server env / encrypted settings; never sent to client. → evidence: 
- [ ] CHN-03 — Member communication preferences & opt-out per channel (marketing opt-out respected). → evidence: 
- [ ] TPL-01 — Templates: welcome, membership expiry, payment reminder, payment received, birthday, inact → evidence: 
- [ ] TPL-02 — Variables: `{{member_name}} {{gym_name}} {{membership_name}} {{expiry_date}} {{amount_due} → evidence: 
- [ ] CHURN-01 — "Attention Required" list with rule-based score from: reduced attendance vs member's own a → evidence: 
- [ ] CHURN-02 — Wording never claims certainty ("Potential follow-up needed"). Action buttons: create task → evidence: 

## Phase 6 — Inventory, Equipment (8)
- [ ] STK-01 — Products: name, SKU (unique per gym), category, cost, selling price, stock, reorder level, → evidence: 
- [ ] STK-02 — Transactions: stock in, stock out, sale (creates payment), purchase (creates expense optio → evidence: 
- [ ] STK-03 — Low-stock and expiry alerts (feed into notifications). → evidence: 
- [ ] EQP-01 — Fields: name, brand, model, purchase date, cost, warranty expiry, last service date, next → evidence: 
- [ ] EQP-02 — Maintenance logs (date, work done, cost → optional expense, vendor). → evidence: 
- [ ] EQP-03 — Maintenance & warranty reminders. → evidence: 
- [ ] REM-06 — Operations: equipment maintenance, warranty expiry, staff review, document/license expiry. → evidence: 
- [ ] RPT-03 — Reports: inventory, equipment maintenance. → evidence: 

## Phase 8 — Testing, Seed, Docs, Deployment, Acceptance (42)
- [ ] DB-05 — `DATABASE.md` with ERD (Mermaid) and table descriptions. → evidence: 
- [ ] DEP-01 — Deployable GitHub → Vercel → Supabase with no custom domain. → evidence: 
- [ ] DEP-03 — Supabase Auth redirect URLs & site URL configured for Vercel URL (documented). → evidence: 
- [ ] DEP-04 — CI (GitHub Actions): install, typecheck, lint, unit tests, build on every PR. → evidence: 
- [ ] DEP-05 — Notes on free-tier limits (Supabase free projects can pause after inactivity; email rate l → evidence: 
- [ ] SEED-01 — Seed script: 1 demo gym (clearly named "Demo Gym (Sample Data)"), 2 branches, 10 members ( → evidence: 
- [ ] SEED-02 — All seed rows marked `is_demo = true` and removable via a "Clear demo data" action/script. → evidence: 
- [ ] DEMO-01 — Demo accounts: owner, manager, receptionist, trainer, member. Emails/passwords read from e → evidence: 
- [ ] TEST-01 — Unit: money, tax, dates, membership calculations, reminder matching, template rendering, p → evidence: 
- [ ] TEST-02 — RLS/SQL tests: tenant isolation for every table, role permissions, member self-access. → evidence: 
- [ ] TEST-03 — E2E (Playwright): signup → onboarding, add member, assign membership, QR/manual attendance → evidence: 
- [ ] TEST-04 — Both success and failure cases for each module. Coverage summary in `TESTING.md`. → evidence: 
- [ ] DOC-01 — README.md, SETUP.md, DATABASE.md, DEPLOYMENT.md, SECURITY.md, ENVIRONMENT.md, API.md (serv → evidence: 
- [ ] DOC-02 — Exact instructions: local setup, Supabase setup (CLI + cloud), env vars, migrations, seed, → evidence: 
- [ ] ACC-01 — Owner can create a gym. → evidence: 
- [ ] ACC-02 — Owner can create branches. → evidence: 
- [ ] ACC-03 — Owner can create staff. → evidence: 
- [ ] ACC-04 — Owner can create membership plans. → evidence: 
- [ ] ACC-05 — Owner can register a member. → evidence: 
- [ ] ACC-06 — Member can receive a membership. → evidence: 
- [ ] ACC-07 — Receptionist can record attendance. → evidence: 
- [ ] ACC-08 — QR attendance works. → evidence: 
- [ ] ACC-09 — Trainer can be assigned to a member. → evidence: 
- [ ] ACC-10 — Trainer can assign workout plans. → evidence: 
- [ ] ACC-11 — Trainer can create diet plans. → evidence: 
- [ ] ACC-12 — Member can view workout and diet. → evidence: 
- [ ] ACC-13 — Member progress can be tracked. → evidence: 
- [ ] ACC-14 — Payments can be recorded. → evidence: 
- [ ] ACC-15 — Invoices can be generated. → evidence: 
- [ ] ACC-16 — Pending payments are visible. → evidence: 
- [ ] ACC-17 — Membership expiry is calculated correctly. → evidence: 
- [ ] ACC-18 — Automated reminders can be configured. → evidence: 
- [ ] ACC-19 — Notifications appear in the application. → evidence: 
- [ ] ACC-20 — Reports can be filtered. → evidence: 
- [ ] ACC-21 — Data is isolated between gyms. → evidence: 
- [ ] ACC-22 — Unauthorized users cannot access restricted pages. → evidence: 
- [ ] ACC-23 — Application is responsive. → evidence: 
- [ ] ACC-24 — Application can be installed as a PWA. → evidence: 
- [ ] ACC-25 — Application can be deployed without a custom domain. → evidence: 
- [ ] ACC-26 — Secrets are not exposed. → evidence: 
- [ ] ACC-27 — Database schema is documented. → evidence: 
- [ ] ACC-28 — Deployment steps are documented. → evidence: 

## Known gaps
(ID — reason — plan)

## Bug log
(date — bug — cause — fix — test)

## Session summary
(updated at end of every session: done / in progress / exact next step)
