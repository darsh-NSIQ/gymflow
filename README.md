# GymFlow — Production Gym Management SaaS

![GymFlow Banner](/logo.png)

**GymFlow** is a modern, responsive, multi-tenant Gym Management SaaS Web Application built with Next.js (App Router), TypeScript, Tailwind CSS, and Supabase.

Designed for complete A-to-Z gym operations: member registrations, instant QR attendance, GST invoicing, workout & diet builders, personal training, inventory, equipment maintenance, and automated WhatsApp/email reminders.

---

## 🚀 Key Features

- **Branding & Customization**: Dynamic gym name, logo, primary color, currency (INR/₹), and tax settings configurable from Admin Settings.
- **Multi-Tenant Architecture**: Complete `gym_id` and `branch_id` tenant isolation with RLS policies and multi-branch switcher.
- **Role-Based Access Control (RBAC)**: 8 roles (Super Admin, Gym Owner, Branch Manager, Receptionist, Trainer, Nutritionist, Accountant, Member) with 3-layer authorization.
- **Soft Energy Design System**: Soft pastel tints, `--radius: 14px`, brand-tinted soft shadows, accessible contrast (WCAG AA), micro-animations, desktop sidebar & mobile bottom navigation.
- **Instant QR Attendance Scanner**: Opaque tokenized QR ID cards, webcam scanner, grace access rules, and peak hours analytics.
- **100% GST-Compliant Invoices**: CGST/SGST splitting, financial year sequential numbering (`TPFZ/2026-27/0001`), cash/UPI/card payments, and printable PDF receipts.
- **Workout & Diet Builder**: Weekly workout split generator, exercise library, calorie/macro calculator, and meal checklist.
- **Member Retention & Churn Analytics**: Identifies members needing follow-up ("Potential follow-up needed").
- **PWA Capable**: Installable on Android & iOS (`manifest.json`, standalone mode).
- **Free Subdomain & Local Deployment**: Runs out-of-the-box on `http://localhost:3000` or free Vercel subdomain (`*.vercel.app`) without custom domain purchase.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS, Lucide Icons, Recharts, date-fns
- **Backend / Database**: Next.js App Router Server Actions + Supabase PostgreSQL & Auth
- **Design Tokens**: Soft Energy Light Theme (CSS Variables, HSL)
- **Deployment**: Vercel + Supabase Free Tier

---

## ⚡ Quick Start (Local Setup)

```bash
# 1. Clone or navigate to the project directory
cd C:\Users\Admin\Downloads\gymflow

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to launch the application.

---

## 📖 Documentation Index

- [`SETUP.md`](./SETUP.md): Local installation and deployment guide
- [`DATABASE.md`](./DATABASE.md): PostgreSQL schemas, foreign keys, and indexes
- [`DEPLOYMENT.md`](./DEPLOYMENT.md): Step-by-step Vercel + Supabase deployment
- [`SECURITY.md`](./SECURITY.md): Multi-tenant isolation and security architecture
- [`ROLE_PERMISSIONS.md`](./ROLE_PERMISSIONS.md): Detailed RBAC matrix
- [`REMINDERS.md`](./REMINDERS.md): Automation & reminder trigger engine specifications
- [`API.md`](./API.md): API routes and server action signatures
- [`TESTING.md`](./TESTING.md): Unit and integration test verification suite
