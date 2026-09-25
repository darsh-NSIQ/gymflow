# 🗄️ GymFlow Free Cloud Database Setup Guide

GymFlow supports **100% Free Permanent Data Storage** via **Supabase (PostgreSQL)** or **Neon.tech (PostgreSQL)**.

Currently, GymFlow is configured with **Automatic Browser LocalStorage Persistence**, meaning any member you add, payment you record, or attendance you check in is saved permanently in your browser even after page refreshes or server restarts!

To sync data across multiple devices (Laptops, Reception Tablets, Mobile Phones), follow the 100% FREE Supabase Cloud setup below.

---

## 🌟 Top 100% Free Database Options

| Provider | Type | Free Storage | Credit Card Req? | Best For |
| :--- | :--- | :--- | :--- | :--- |
| **Supabase** | PostgreSQL | **500 MB** (~500k members) | **NO** | 🌟 **Recommended #1** (Built-in Auth, Storage & Realtime) |
| **Neon.tech** | PostgreSQL | **512 MB** | **NO** | Serverless Postgres + Instant branching |
| **MongoDB Atlas** | NoSQL JSON | **512 MB** | **NO** | NoSQL Document storage |
| **Turso** | Edge SQLite | **9 GB** | **NO** | Super fast edge SQLite |

---

## ⚡ 1. Step-by-Step Supabase 100% Free Setup Guide

### Step 1: Create a Free Supabase Account
1. Visit [https://supabase.com](https://supabase.com) and click **"Start your project"**.
2. Sign in with GitHub or Email (No Credit Card required).
3. Click **"New Project"**, name it `gymflow-prod`, and choose a password & region (e.g. *Mumbai / Singapore*).

### Step 2: Get API Keys
1. In your Supabase Dashboard, go to **Project Settings -> API**.
2. Copy your **Project URL** (`https://xyz.supabase.co`) and **`anon` public key**.

### Step 3: Configure Environment Variables
Create or update `.env.local` in your `gymflow` project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

### Step 4: Run SQL Schema Creation Script
In Supabase Dashboard, open **SQL Editor**, paste the following script, and click **RUN**:

```sql
-- 1. Create Members Table
CREATE TABLE members (
  id TEXT PRIMARY KEY,
  gym_id TEXT NOT NULL,
  branch_id TEXT NOT NULL,
  member_code TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  photo_url TEXT,
  gender TEXT DEFAULT 'male',
  dob DATE,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT,
  emergency_name TEXT,
  emergency_phone TEXT,
  joining_date DATE DEFAULT CURRENT_DATE,
  source TEXT DEFAULT 'Walk-in',
  assigned_trainer_id TEXT,
  assigned_trainer_name TEXT,
  notes TEXT,
  status TEXT DEFAULT 'active',
  health_notes TEXT,
  fitness_goals TEXT[],
  preferred_workout_time TEXT,
  qr_token TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Memberships Table
CREATE TABLE memberships (
  id TEXT PRIMARY KEY,
  gym_id TEXT NOT NULL,
  member_id TEXT REFERENCES members(id) ON DELETE CASCADE,
  member_name TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  price_paise BIGINT NOT NULL,
  discount_paise BIGINT DEFAULT 0,
  tax_paise BIGINT DEFAULT 0,
  final_amount_paise BIGINT NOT NULL,
  payment_status TEXT DEFAULT 'paid',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Attendance Table
CREATE TABLE attendance (
  id TEXT PRIMARY KEY,
  gym_id TEXT NOT NULL,
  branch_id TEXT NOT NULL,
  member_id TEXT REFERENCES members(id) ON DELETE CASCADE,
  member_name TEXT NOT NULL,
  member_code TEXT NOT NULL,
  check_in TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  check_out TIMESTAMP WITH TIME ZONE,
  method TEXT DEFAULT 'qr_scan',
  is_grace BOOLEAN DEFAULT FALSE,
  date DATE DEFAULT CURRENT_DATE
);

-- 4. Create Payments Table
CREATE TABLE payments (
  id TEXT PRIMARY KEY,
  gym_id TEXT NOT NULL,
  branch_id TEXT NOT NULL,
  invoice_number TEXT UNIQUE NOT NULL,
  member_id TEXT REFERENCES members(id),
  member_name TEXT NOT NULL,
  amount_paise BIGINT NOT NULL,
  discount_paise BIGINT DEFAULT 0,
  tax_paise BIGINT DEFAULT 0,
  final_paise BIGINT NOT NULL,
  paid_paise BIGINT NOT NULL,
  due_paise BIGINT DEFAULT 0,
  payment_method TEXT DEFAULT 'upi',
  transaction_ref TEXT,
  payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  collected_by TEXT NOT NULL,
  status TEXT DEFAULT 'paid'
);

-- 5. Create Expenses Table
CREATE TABLE expenses (
  id TEXT PRIMARY KEY,
  gym_id TEXT NOT NULL,
  branch_id TEXT NOT NULL,
  category TEXT NOT NULL,
  amount_paise BIGINT NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  vendor TEXT NOT NULL,
  notes TEXT
);

-- Enable Row Level Security (RLS)
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Allow Public Access for Demo / Internal SaaS
CREATE POLICY "Public Read Access" ON members FOR SELECT USING (true);
CREATE POLICY "Public Write Access" ON members FOR ALL USING (true);
CREATE POLICY "Public Read Access" ON memberships FOR SELECT USING (true);
CREATE POLICY "Public Write Access" ON memberships FOR ALL USING (true);
CREATE POLICY "Public Read Access" ON attendance FOR SELECT USING (true);
CREATE POLICY "Public Write Access" ON attendance FOR ALL USING (true);
CREATE POLICY "Public Read Access" ON payments FOR SELECT USING (true);
CREATE POLICY "Public Write Access" ON payments FOR ALL USING (true);
CREATE POLICY "Public Read Access" ON expenses FOR SELECT USING (true);
CREATE POLICY "Public Write Access" ON expenses FOR ALL USING (true);
```

---

## 🔒 Data Backup & Export

You can export all GymFlow records to **CSV** or **JSON** at any time:
1. Go to `/app/members` -> Click **"Export CSV"**.
2. Go to `/app/reports` -> Click **"Export Financial Audit Log"**.
