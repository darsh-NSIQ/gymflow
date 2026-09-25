# GymFlow Prompt Kit — Kaise Use Karein

Aapka original prompt accha tha, lekin ek hi lamba prompt IDE tool ko doge to woh beech ke features bhool jata hai (context limit + "done" bolne ki jaldi). Ye kit us problem ko 4 tareeke se solve karta hai:

1. **Har requirement ki unique ID** (281 IDs, jaise `MEM-04`, `ATT-07`) — `docs/SPEC.md` me. Tool kuch skip karega to ID se pakda jayega.
2. **PROGRESS.md checklist** — tool ko har ID tick karni padti hai *proof ke saath* (file path + test ka naam).
3. **Phase-wise prompts** — ek baar me ek phase, taaki tool overload na ho.
4. **GAP_AUDIT prompt** — har phase ke baad tool khud apna code check karta hai aur missing cheezein fix karta hai.

Saath me maine original prompt ki **ambiguities bhi fix ki hain** (SPEC ka Section 0): timezone, paise me money, membership expiry ka exact formula, freeze logic, GST (CGST/SGST/IGST), invoice numbering (financial year wise), QR security, duplicate attendance, member portal login, reminders do baar na jaayein, etc. Ye cheezein original prompt me nahi thi, aur yahi jagah AI tools galti karte hain.

---

## Files

| File | Kaam |
|---|---|
| `AGENTS.md` | Tool ke permanent rules (har session me padhega) |
| `docs/SPEC.md` | Poora product spec, har requirement ID ke saath |
| `PROGRESS.md` | Checklist — tool yahan tick karega |
| `prompts/P0_PLANNING.md` … `P9_SAAS_READINESS.md` | Har phase ka prompt |
| `prompts/GAP_AUDIT.md` | Har phase ke baad chalana hai |
| `prompts/RESUME_SESSION.md` | Naya chat/session shuru karte waqt |
| `prompts/FIX_BUG.md` | Koi bug mile to |

---

## Step-by-step

**1. Project folder banao** aur ye saari files usme daal do (folder structure same rakho).

**2. Rules file apne tool ke hisaab se copy karo** (tool ise automatically har baar padhta hai):
- **Claude Code** → `AGENTS.md` ko copy karke `CLAUDE.md` naam se bhi rakho
- **Cursor** → `.cursor/rules/gymflow.mdc` me content daalo (ya purana `.cursorrules`)
- **Windsurf** → `.windsurfrules`
- **GitHub Copilot** → `.github/copilot-instructions.md`
- Codex / baaki tools → `AGENTS.md` hi kaafi hai

(Tools apne rules-file naam badalte rehte hain — apne tool ka current docs ek baar check kar lena.)

**3. Pehle ye accounts bana lo** (sab free): GitHub, Supabase, Vercel. Local machine par Node.js (LTS), pnpm, Docker (Supabase local ke liye) aur Supabase CLI install karo.

**4. Pehla message tool ko:**
```
Read AGENTS.md, docs/SPEC.md and PROGRESS.md fully.
Then execute prompts/P0_PLANNING.md exactly.
```
Tool architecture docs banayega. **Padh ke check karo**, phir approve karo.

**5. Har phase ke liye yahi pattern:**
```
Execute prompts/P1_FOUNDATION.md
```
Jab tool bole "done", tab:
```
Execute prompts/GAP_AUDIT.md for phase P1
```
Jab tak "PHASE P1 COMPLETE — 0 gaps" na aaye, aage mat badho. Phir git commit karo, phir P2.

**6. Har naya chat/session** (context full ho jaye ya agle din):
```
Execute prompts/RESUME_SESSION.md
```

---

## Zaroori tips (inse hi quality aati hai)

- **Ek phase = ek ya zyada fresh session.** Ek hi chat me poora app mat banwao; lamba chat hone par tool purani baatein bhoolta hai.
- **Har phase ke baad git commit.** Kuch toot jaaye to wapas aa sakte ho.
- **Khud chala ke dekho.** `pnpm dev` karke app browser me kholo, mobile view (Chrome DevTools) me bhi. Tool ke "sab ho gaya" par bharosa mat karo — PROGRESS.md me evidence dekho.
- **Tool agar "TODO" ya "rest of code same" likhe** → bolo: "AGENTS.md hard rules violate ho rahe hain, poora code likho."
- **Supabase service role key** kabhi frontend ya GitHub par na jaaye. Sirf Vercel env variables me.
- **Free tier limits:** Supabase free project kuch din use na ho to pause ho sakta hai; Supabase ki built-in email ki limit kam hai — production me Resend jaisa email provider lagana. Vercel free plan par cron ki limits hain, isliye reminders ke liye pg_cron use kiya hai.
- `gymflow.vercel.app` naam shayad pehle se kisi ne le liya ho — koi bhi free `*.vercel.app` naam chalega; code me URL env variable se aata hai, to baad me custom domain lagana aasaan hai.
- **Realistic expectation:** 9 phases ka ye project bada hai. Achhe tool ke saath bhi har phase me kaafi back-and-forth hoga. Ye kit ensure karta hai ki kuch *chhoote* nahi, lekin testing aapko khud bhi karni hogi — khaaskar payments, GST aur attendance.

---

## Agar tool ek hi file accept karta ho (jaise normal chat)
To pehle `AGENTS.md` paste karo, phir `docs/SPEC.md`, phir `P0_PLANNING.md` — aur har phase ke liye naye chat me RESUME wala tareeka use karo, `PROGRESS.md` ka latest version paste karke.
