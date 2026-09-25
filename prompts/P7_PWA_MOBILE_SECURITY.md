# PHASE 7 — PWA, Mobile Optimization, Global Search, Settings, Landing Page, Security Hardening

Read `AGENTS.md`, `PROGRESS.md`, and every `[P7]` ID in `docs/SPEC.md`. Implement ALL of them.

Includes: PWA-01..04, UI-06, RESP-01, SRCH-01, SET-02, BRAND-03, RBAC-10, AUD-03, SEC-06, SEC-07, LAND-01.

Key rules:
- Service worker must not cache PII API responses; offline page for no network.
- Lighthouse PWA/installability check passes on the Vercel URL; document results.
- Playwright screenshots at 360/390/768/1024/1440 for every main page; fix overflow and tap targets (≥44px).
- Global search is permission-filtered and uses trigram indexes.
- Security review: go through every server action and route → confirm permission check + zod + RLS; grep repo for secrets; record in SECURITY.md.

Exit criteria: all `[P7]` IDs ticked with evidence; checks pass. Then run `prompts/GAP_AUDIT.md` for P7.
