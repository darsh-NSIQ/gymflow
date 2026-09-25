import type React from 'react'
import {
  LayoutDashboard,
  Users,
  CreditCard,
  CalendarCheck,
  QrCode,
  Dumbbell,
  Apple,
  TrendingUp,
  Receipt,
  FileText,
  DollarSign,
  Package,
  Wrench,
  Zap,
  Bell,
  BarChart3,
  Settings,
  ShieldCheck,
  UserCheck,
  Activity,
  Smartphone,
} from 'lucide-react'
import type { UserRole } from './types'
import { hasPermission, type PermissionKey } from './permissions'

export interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  permission?: PermissionKey
  badge?: string
}

export interface NavGroup {
  groupName: string
  items: NavItem[]
}

export const NAV_GROUPS: NavGroup[] = [
  {
    groupName: 'Core Operations',
    items: [
      { label: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
      { label: 'Members', href: '/app/members', icon: Users, permission: 'members.view' },
      { label: 'Memberships', href: '/app/memberships', icon: CreditCard, permission: 'memberships.view' },
      { label: 'Attendance', href: '/app/attendance', icon: CalendarCheck, permission: 'attendance.view' },
      { label: 'QR Scanner', href: '/app/qr-scanner', icon: QrCode, permission: 'attendance.manage', badge: 'Scanner' },
    ],
  },
  {
    groupName: 'Fitness & Coaching',
    items: [
      { label: 'Trainers & Staff', href: '/app/trainers', icon: UserCheck, permission: 'trainers.view' },
      { label: 'Trainer Portal', href: '/app/trainer-dashboard', icon: Activity, permission: 'workout.manage' },
      { label: 'Workout Plans', href: '/app/workouts', icon: Dumbbell, permission: 'workout.view' },
      { label: 'Diet & Nutrition', href: '/app/diet', icon: Apple, permission: 'diet.view' },
      { label: 'Progress Tracking', href: '/app/progress', icon: TrendingUp, permission: 'progress.view' },
      { label: 'Personal Training', href: '/app/personal-training', icon: Dumbbell, permission: 'pt.view' },
    ],
  },
  {
    groupName: 'Finance & Sales',
    items: [
      { label: 'Payments', href: '/app/payments', icon: DollarSign, permission: 'payments.view' },
      { label: 'Invoices & Receipts', href: '/app/invoices', icon: Receipt, permission: 'invoices.view' },
      { label: 'Expenses', href: '/app/expenses', icon: FileText, permission: 'expenses.view' },
    ],
  },
  {
    groupName: 'Management & Assets',
    items: [
      { label: 'Inventory', href: '/app/inventory', icon: Package, permission: 'inventory.manage' },
      { label: 'Equipment', href: '/app/equipment', icon: Wrench, permission: 'equipment.manage' },
      { label: 'Automations', href: '/app/automations', icon: Zap, permission: 'automations.manage' },
      { label: 'Notifications', href: '/app/notifications', icon: Bell },
      { label: 'Reports & Churn', href: '/app/reports', icon: BarChart3, permission: 'reports.view' },
    ],
  },
  {
    groupName: 'System',
    items: [
      { label: 'Member Portal View', href: '/portal', icon: Smartphone },
      { label: 'Admin Settings', href: '/app/settings', icon: Settings, permission: 'settings.manage' },
      { label: 'Audit Logs', href: '/app/audit-logs', icon: ShieldCheck, permission: 'audit.view' },
    ],
  },
]

/** Items pinned to the mobile bottom bar (in order). */
export const MOBILE_PRIMARY_HREFS: string[] = [
  '/app/dashboard',
  '/app/members',
  '/app/attendance',
  '/app/payments',
]

export const ROLE_OPTIONS: { role: UserRole; name: string }[] = [
  { role: 'owner', name: 'Gym Owner' },
  { role: 'branch_manager', name: 'Branch Manager' },
  { role: 'receptionist', name: 'Receptionist' },
  { role: 'trainer', name: 'Trainer' },
  { role: 'nutritionist', name: 'Nutritionist' },
  { role: 'accountant', name: 'Accountant' },
  { role: 'member', name: 'Member' },
]

export function canSeeNavItem(role: UserRole, item: NavItem): boolean {
  if (!item.permission) return true
  return hasPermission(role, item.permission)
}

/** Nav groups filtered to the items this role may open. Empty groups are dropped. */
export function getVisibleNavGroups(role: UserRole): NavGroup[] {
  return NAV_GROUPS.map((group) => ({
    groupName: group.groupName,
    items: group.items.filter((item) => canSeeNavItem(role, item)),
  })).filter((group) => group.items.length > 0)
}

/** Flat list of every nav item (all groups). */
export const ALL_NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((g) => g.items)

/** Active-route check that also matches nested routes (e.g. /app/members/[id]). */
export function isNavItemActive(pathname: string, href: string): boolean {
  if (pathname === href) return true
  if (href === '/app/dashboard') return false
  return pathname.startsWith(href + '/')
}
