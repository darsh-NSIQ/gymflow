import { UserRole } from './types'

export type PermissionKey =
  | 'members.view'
  | 'members.create'
  | 'members.update'
  | 'members.delete'
  | 'members.export'
  | 'plans.manage'
  | 'memberships.view'
  | 'memberships.manage'
  | 'attendance.view'
  | 'attendance.manage'
  | 'trainers.view'
  | 'trainers.manage'
  | 'staff.manage'
  | 'branches.manage'
  | 'payments.view'
  | 'payments.create'
  | 'payments.refund'
  | 'invoices.view'
  | 'invoices.create'
  | 'expenses.view'
  | 'expenses.manage'
  | 'reports.view'
  | 'reports.export'
  | 'workout.view'
  | 'workout.manage'
  | 'diet.view'
  | 'diet.manage'
  | 'progress.view'
  | 'progress.manage'
  | 'pt.view'
  | 'pt.manage'
  | 'inventory.manage'
  | 'equipment.manage'
  | 'notifications.send'
  | 'templates.manage'
  | 'automations.manage'
  | 'settings.manage'
  | 'audit.view'

export const ROLE_PERMISSIONS: Record<UserRole, PermissionKey[]> = {
  super_admin: [
    'members.view', 'members.create', 'members.update', 'members.delete', 'members.export',
    'plans.manage', 'memberships.view', 'memberships.manage', 'attendance.view', 'attendance.manage',
    'trainers.view', 'trainers.manage', 'staff.manage', 'branches.manage', 'payments.view', 'payments.create',
    'payments.refund', 'invoices.view', 'invoices.create', 'expenses.view', 'expenses.manage', 'reports.view',
    'reports.export', 'workout.view', 'workout.manage', 'diet.view', 'diet.manage', 'progress.view',
    'progress.manage', 'pt.view', 'pt.manage', 'inventory.manage', 'equipment.manage', 'notifications.send',
    'templates.manage', 'automations.manage', 'settings.manage', 'audit.view'
  ],
  owner: [
    'members.view', 'members.create', 'members.update', 'members.delete', 'members.export',
    'plans.manage', 'memberships.view', 'memberships.manage', 'attendance.view', 'attendance.manage',
    'trainers.view', 'trainers.manage', 'staff.manage', 'branches.manage', 'payments.view', 'payments.create',
    'payments.refund', 'invoices.view', 'invoices.create', 'expenses.view', 'expenses.manage', 'reports.view',
    'reports.export', 'workout.view', 'workout.manage', 'diet.view', 'diet.manage', 'progress.view',
    'progress.manage', 'pt.view', 'pt.manage', 'inventory.manage', 'equipment.manage', 'notifications.send',
    'templates.manage', 'automations.manage', 'settings.manage', 'audit.view'
  ],
  branch_manager: [
    'members.view', 'members.create', 'members.update', 'members.export',
    'plans.manage', 'memberships.view', 'memberships.manage', 'attendance.view', 'attendance.manage',
    'trainers.view', 'payments.view', 'payments.create', 'invoices.view', 'invoices.create',
    'reports.view', 'reports.export', 'workout.view', 'diet.view', 'progress.view', 'pt.view',
    'inventory.manage', 'equipment.manage', 'notifications.send'
  ],
  receptionist: [
    'members.view', 'members.create', 'members.update', 'memberships.view', 'memberships.manage',
    'attendance.view', 'attendance.manage', 'payments.view', 'payments.create', 'invoices.view',
    'invoices.create', 'pt.view', 'notifications.send'
  ],
  trainer: [
    'members.view', 'attendance.view', 'workout.view', 'workout.manage', 'diet.view',
    'diet.manage', 'progress.view', 'progress.manage', 'pt.view', 'pt.manage'
  ],
  nutritionist: [
    'members.view', 'diet.view', 'diet.manage', 'progress.view', 'progress.manage'
  ],
  accountant: [
    'members.view', 'payments.view', 'payments.create', 'payments.refund', 'invoices.view',
    'invoices.create', 'expenses.view', 'expenses.manage', 'reports.view', 'reports.export'
  ],
  member: [
    'memberships.view', 'attendance.view', 'payments.view', 'workout.view', 'diet.view',
    'progress.view', 'progress.manage', 'pt.view'
  ]
}

export function hasPermission(role: UserRole, permission: PermissionKey): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}
