# SETUP.md — Local Setup & Development Guide

## Prerequisites

- **Node.js**: v18.0 or higher (v24 LTS recommended)
- **npm**: v9+ or **pnpm**
- **Browser**: Chrome / Edge / Safari with camera permissions for QR scanner

---

## Installation Steps

1. Navigate to project root:
   ```bash
   cd C:\Users\Admin\Downloads\gymflow
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create local environment file:
   ```bash
   copy .env.example .env.local
   ```

4. Launch local development server:
   ```bash
   npm run dev
   ```

5. Open browser at `http://localhost:3000`.

---

## Interactive Role Switcher

You can test all 7 user roles directly from the top navigation bar header dropdown:
- **Gym Owner**: Full system access, financial charts, branding settings
- **Branch Manager**: Members, attendance, memberships, payments, trainers, reports
- **Receptionist**: Member registration, QR attendance check-in, payment collection
- **Trainer**: Trainees, workout plans, diet plans, PT sessions
- **Nutritionist**: Trainee diet plans, calorie targets
- **Accountant**: Payments, invoices, expenses, revenue reports
- **Member**: Personal dashboard, QR entry pass, workout checklist, diet checklist
