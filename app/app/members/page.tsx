'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Users,
  Search,
  Filter,
  Download,
  UserPlus,
  Phone,
  Calendar,
  MoreVertical,
  QrCode,
  ShieldAlert,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { StatusBadge } from '@/components/ui/status-badge'
import { AddMemberAdvancedModal } from '@/components/ui/add-member-advanced-modal'
import { useApp } from '@/lib/context'
import { MemberStatus } from '@/lib/types'

export default function MembersPage() {
  const { members, trainers, addMember, archiveMember, showToast } = useApp()

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [trainerFilter, setTrainerFilter] = useState<string>('all')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // New member form
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male')
  const [assignedTrainer, setAssignedTrainer] = useState('')
  const [goals, setGoals] = useState('Muscle Gain')

  // Filter logic
  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.phone.includes(searchTerm) ||
      m.member_code.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || m.status === statusFilter
    const matchesTrainer = trainerFilter === 'all' || m.assigned_trainer_id === trainerFilter

    return matchesSearch && matchesStatus && matchesTrainer
  })

  const exportCSV = () => {
    const headers = 'Member Code,Full Name,Phone,Email,Status,Joining Date,Trainer\n'
    const rows = filteredMembers
      .map(
        (m) =>
          `"${m.member_code}","${m.full_name}","${m.phone}","${m.email || ''}","${m.status}","${m.joining_date}","${
            m.assigned_trainer_name || ''
          }"`
      )
      .join('\n')

    const blob = new Blob([headers + rows], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `gymflow_members_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    showToast('Exported member list to CSV.')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Member Management</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage member profiles, membership statuses, and trainer assignments ({filteredMembers.length} records)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportCSV} className="gap-1.5">
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </Button>
          <Button size="sm" onClick={() => setIsAddModalOpen(true)} className="gap-1.5 shadow-soft-sm">
            <UserPlus className="h-4 w-4" />
            <span>Register Member</span>
          </Button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, phone, or code..."
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-input bg-card text-xs font-semibold"
            >
              <option value="all">All Member Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="frozen">Frozen</option>
              <option value="suspended">Suspended</option>
              <option value="expired">Expired</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <select
              value={trainerFilter}
              onChange={(e) => setTrainerFilter(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-input bg-card text-xs font-semibold"
            >
              <option value="all">All Assigned Trainers</option>
              {trainers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Desktop Table Layout */}
      <div className="hidden md:block rounded-xl border border-border bg-card shadow-soft-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted text-muted-foreground font-semibold uppercase tracking-wider border-b border-border">
            <tr>
              <th className="px-4 py-3">Member</th>
              <th className="px-4 py-3">Member Code</th>
              <th className="px-4 py-3">Phone & Contact</th>
              <th className="px-4 py-3">Assigned Trainer</th>
              <th className="px-4 py-3">Joining Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredMembers.map((m) => (
              <tr key={m.id} className="hover:bg-accent/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={m.photo_url || 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150'}
                      alt={m.full_name}
                      className="h-9 w-9 rounded-full object-cover border border-border"
                    />
                    <div>
                      <Link href={`/app/members/${m.id}`} className="font-bold text-foreground hover:underline block">
                        {m.full_name}
                      </Link>
                      <span className="text-[11px] text-muted-foreground">{m.email || 'No email registered'}</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono font-semibold text-foreground">{m.member_code}</td>
                <td className="px-4 py-3 text-muted-foreground font-medium">{m.phone}</td>
                <td className="px-4 py-3 font-medium text-foreground">{m.assigned_trainer_name || 'Unassigned'}</td>
                <td className="px-4 py-3 text-muted-foreground">{m.joining_date}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={m.status} />
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <Link href={`/app/members/${m.id}`}>
                    <Button variant="outline" size="sm" className="h-7 px-2.5 text-[11px]">
                      View Profile
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List Layout */}
      <div className="md:hidden space-y-3">
        {filteredMembers.map((m) => (
          <Card key={m.id} hoverable>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={m.photo_url || 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150'}
                    alt={m.full_name}
                    className="h-10 w-10 rounded-full object-cover border border-border"
                  />
                  <div>
                    <Link href={`/app/members/${m.id}`} className="font-bold text-sm text-foreground hover:underline block">
                      {m.full_name}
                    </Link>
                    <span className="text-xs text-muted-foreground font-mono">{m.member_code}</span>
                  </div>
                </div>
                <StatusBadge status={m.status} />
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground border-t border-border pt-3">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-muted-foreground">Phone</span>
                  <span className="font-semibold text-foreground">{m.phone}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-muted-foreground">Trainer</span>
                  <span className="font-semibold text-foreground">{m.assigned_trainer_name || 'None'}</span>
                </div>
              </div>

              <div className="mt-3 pt-2 flex justify-end">
                <Link href={`/app/members/${m.id}`} className="w-full">
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    Open Member Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Member Advanced Modal */}
      <AddMemberAdvancedModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  )
}
