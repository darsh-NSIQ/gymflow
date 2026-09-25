export type UserRole =
  | 'super_admin'
  | 'owner'
  | 'branch_manager'
  | 'receptionist'
  | 'trainer'
  | 'nutritionist'
  | 'accountant'
  | 'member'

export type MemberStatus =
  | 'active'
  | 'inactive'
  | 'frozen'
  | 'suspended'
  | 'expired'
  | 'archived'

export type MembershipStatus =
  | 'upcoming'
  | 'active'
  | 'frozen'
  | 'expired'
  | 'cancelled'

export type PaymentStatus = 'paid' | 'partial' | 'pending' | 'failed' | 'refunded'

export type PaymentMethod = 'cash' | 'upi' | 'card' | 'bank_transfer' | 'online'

export type AttendanceMethod = 'qr_scan' | 'member_code' | 'phone_search' | 'manual'

export type EquipmentStatus = 'active' | 'maintenance' | 'broken' | 'retired'

export type PTSessionStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show'

export interface Gym {
  id: string
  name: string
  logo_url: string
  address: string
  city: string
  state: string
  zip_code: string
  phone: string
  email: string
  opening_hours: string
  currency: string
  timezone: string
  gst_registered: boolean
  gstin?: string
  cgst_rate: number // e.g. 9 for 9%
  sgst_rate: number // e.g. 9 for 9%
  primary_color: string
  invoice_prefix: string
  member_prefix: string
  grace_days: number
  created_at: string
}

export interface Branch {
  id: string
  gym_id: string
  name: string
  address: string
  phone: string
  is_main: boolean
}

export interface UserProfile {
  id: string
  email: string
  full_name: string
  phone?: string
  avatar_url?: string
  role: UserRole
  gym_id: string
  branch_id?: string
}

export interface Member {
  id: string
  gym_id: string
  branch_id: string
  member_code: string
  full_name: string
  photo_url?: string
  gender: 'male' | 'female' | 'other'
  dob: string
  phone: string
  email?: string
  address?: string
  emergency_name: string
  emergency_phone: string
  joining_date: string
  source: string
  assigned_trainer_id?: string
  assigned_trainer_name?: string
  notes?: string
  status: MemberStatus
  health_notes?: string
  fitness_goals?: string[]
  preferred_workout_time?: string
  qr_token: string
  user_id?: string
  created_at: string
}

export interface MembershipPlan {
  id: string
  gym_id: string
  name: string
  duration_value: number
  duration_unit: 'days' | 'months' | 'years'
  price_paise: number // minor units
  description: string
  pt_included: boolean
  pt_sessions_count: number
  freeze_allowed: boolean
  freeze_days: number
  status: 'active' | 'inactive'
}

export interface MemberMembership {
  id: string
  gym_id: string
  member_id: string
  member_name: string
  plan_id: string
  plan_name: string
  start_date: string
  end_date: string
  price_paise: number
  discount_paise: number
  tax_paise: number
  final_amount_paise: number
  payment_status: PaymentStatus
  status: MembershipStatus
  created_at: string
}

export interface AttendanceRecord {
  id: string
  gym_id: string
  branch_id: string
  member_id: string
  member_name: string
  member_code: string
  member_photo?: string
  check_in: string
  check_out?: string
  method: AttendanceMethod
  is_grace: boolean
  auto_closed: boolean
  date: string
}

export interface PaymentRecord {
  id: string
  gym_id: string
  branch_id: string
  invoice_number: string
  member_id: string
  member_name: string
  membership_id?: string
  amount_paise: number
  discount_paise: number
  tax_paise: number
  final_paise: number
  paid_paise: number
  due_paise: number
  payment_method: PaymentMethod
  transaction_ref?: string
  payment_date: string
  collected_by: string
  status: PaymentStatus
  notes?: string
}

export interface ExpenseRecord {
  id: string
  gym_id: string
  branch_id: string
  category: string
  amount_paise: number
  date: string
  vendor: string
  notes?: string
}

export interface Trainer {
  id: string
  gym_id: string
  branch_id: string
  name: string
  photo_url?: string
  phone: string
  email: string
  specialization: string
  experience_years: number
  joining_date: string
  salary_paise: number
  commission_pct: number
  assigned_members_count: number
  status: 'active' | 'inactive'
}

export interface Exercise {
  id: string
  name: string
  muscle_group: string
  sets: number
  reps: string
  weight_kg?: number
  rest_sec: number
  tempo?: string
  notes?: string
  video_url?: string
}

export interface WorkoutPlan {
  id: string
  gym_id: string
  member_id: string
  member_name: string
  trainer_id: string
  trainer_name: string
  name: string
  goal: string
  level: 'beginner' | 'intermediate' | 'advanced'
  start_date: string
  end_date: string
  exercises: { day: string; list: Exercise[] }[]
  streak_days: number
}

export interface DietPlan {
  id: string
  gym_id: string
  member_id: string
  member_name: string
  calories_target: number
  protein_g: number
  carbs_g: number
  fat_g: number
  water_liters: number
  meals: {
    name: string
    time: string
    items: string[]
    calories: number
    completed?: boolean
  }[]
}

export interface ProgressRecord {
  id: string
  gym_id: string
  member_id: string
  date: string
  weight_kg: number
  height_cm: number
  bmi: number
  body_fat_pct?: number
  chest_cm?: number
  waist_cm?: number
  arms_cm?: number
  thighs_cm?: number
  photo_front?: string
  photo_side?: string
  photo_back?: string
}

export interface PTSession {
  id: string
  gym_id: string
  member_id: string
  member_name: string
  trainer_id: string
  trainer_name: string
  date: string
  time_slot: string
  duration_mins: number
  status: PTSessionStatus
}

export interface InventoryItem {
  id: string
  gym_id: string
  name: string
  sku: string
  category: string
  cost_paise: number
  selling_price_paise: number
  stock_quantity: number
  reorder_level: number
  supplier: string
}

export interface EquipmentItem {
  id: string
  gym_id: string
  name: string
  brand: string
  model: string
  purchase_date: string
  cost_paise: number
  warranty_expiry: string
  next_maintenance: string
  status: EquipmentStatus
  location: string
}

export interface NotificationItem {
  id: string
  gym_id: string
  user_id?: string
  member_id?: string
  title: string
  message: string
  type: 'payment' | 'membership' | 'attendance' | 'workout' | 'diet' | 'pt' | 'system'
  read: boolean
  created_at: string
  priority: 'low' | 'medium' | 'high'
}

export interface AutomationRule {
  id: string
  gym_id: string
  name: string
  trigger: string // e.g. 'membership_expires_3_days'
  condition: string
  action_channel: 'in_app' | 'email' | 'whatsapp' | 'sms'
  template: string
  enabled: boolean
}

export interface AuditLog {
  id: string
  gym_id: string
  user_name: string
  action: string
  entity: string
  entity_id: string
  timestamp: string
  details?: string
}
