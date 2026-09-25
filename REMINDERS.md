# REMINDERS.md — GymFlow Automation & Reminder Engine

GymFlow provides an automated **WHEN-CONDITION-THEN** reminder engine designed to automate gym member retention, payment collection, attendance follow-ups, and operational alerts.

---

## 📋 Complete Reminder Types Directory

### 1. Membership Expiry Reminders
- `membership_expires_30_days`: Expiry in 30 days early awareness
- `membership_expires_15_days`: Expiry in 15 days renewal prompt
- `membership_expires_7_days`: Expiry in 7 days urgent notice
- `membership_expires_3_days`: Expiry in 3 days high priority alert
- `membership_expires_tomorrow`: Expiry tomorrow final day warning
- `membership_expired`: Membership expired notice & grace offer

### 2. Payments & Invoice Dues
- `payment_due`: Subscription payment due today
- `payment_overdue`: Unpaid fee reminder after due date
- `partial_payment_pending`: Outstanding partial balance due notice

### 3. Attendance & Member Inactivity
- `member_absent_3_days`: 3 days absent gentle check-in
- `member_absent_7_days`: 7 days absent trainer follow-up alert
- `member_absent_14_days`: 14 days absent retention risk warning
- `member_absent_30_days`: 30 days inactive win-back campaign

### 4. Workouts & Diet Nutrition
- `workout_reminder`: Today workout plan exercise checklist
- `workout_plan_expired`: Workout routine update due
- `meal_reminder`: Pre/post workout nutrition timing alert
- `diet_review_due`: Weekly macro evaluation notice

### 5. Personal Training (PT)
- `pt_session_reminder`: 1 hour before scheduled PT session
- `pt_session_followup`: Post session feedback & rating request

### 6. Progress & Body Measurements
- `monthly_measurement_due`: Weight & waist measurement check-in
- `progress_photo_reminder`: Transformation progress photo due

### 7. Gym Equipment & Operational Maintenance
- `equipment_maintenance_due`: Machinery service alert
- `warranty_expiry`: Equipment warranty ending notice
- `license_expiry`: Gym trade/GST license renewal alert

### 8. Marketing & Celebrations
- `member_birthday`: Automated birthday wish + free pass
- `gym_anniversary`: Gym milestone promo campaign
- `festival_campaign`: Renewal discount campaign

---

## ⚡ Action Channels
- **WhatsApp**: Direct message template integration
- **Email**: HTML receipt & newsletter alerts
- **In-App**: System notification bell alerts
- **SMS**: Short text notification

---

## 🔤 Dynamic Template Variables

| Variable | Description |
|---|---|
| `{{member_name}}` | Full name of the gym member |
| `{{gym_name}}` | Business name of the gym |
| `{{membership_name}}` | Name of assigned subscription plan |
| `{{expiry_date}}` | Membership expiry date |
| `{{amount_due}}` | Pending balance in INR |
| `{{trainer_name}}` | Assigned personal trainer name |
| `{{gym_phone}}` | Official gym contact phone |
