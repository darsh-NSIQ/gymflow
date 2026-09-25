# ROLE_PERMISSIONS.md — Role-Based Access Control (RBAC) Matrix

## Overview

GymFlow enforces authorization across 3 layers:
1. **Database Row Level Security (RLS)** as the single source of truth.
2. **Server-Side Authorization** via `hasPermission(role, permissionKey)` in Server Actions and queries.
3. **UI Element Visibility** as cosmetic guidance.

---

## Role Definitions

| Role | Scope | Description |
|---|---|---|
| `super_admin` | Global Platform | SaaS super admin managing gyms & subscriptions |
| `owner` | Gym Level | Full access to gym settings, finances, staff, branches |
| `branch_manager` | Branch Level | Manages daily operations, members, staff, payments |
| `receptionist` | Branch Level | Member registration, attendance check-in, invoices |
| `trainer` | Assigned Trainees | Workout plans, diet plans, PT sessions, progress |
| `nutritionist` | Assigned Trainees | Diet plans, macro targets, progress photos |
| `accountant` | Gym Level | Payments, invoices, expenses, revenue reports |
| `member` | Own Profile | View own pass, workout, diet, payments, attendance |

---

## Permission Matrix

| Permission Key | Owner | Manager | Receptionist | Trainer | Accountant | Member |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| `members.view` | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| `members.create` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `memberships.manage` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `attendance.manage` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `payments.create` | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| `workout.manage` | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| `diet.manage` | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| `reports.view` | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| `settings.manage` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
