'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Dumbbell,
  QrCode,
  CreditCard,
  ArrowRight,
  Clock,
  MapPin,
  Phone,
  Mail,
  Apple,
  Droplets,
  UserCheck,
  Menu,
  X,
  Building2,
  Snowflake,
  ChevronDown,
  Smartphone,
  Receipt,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useApp } from '@/lib/context'
import { formatCurrency } from '@/lib/money'
import { HyperBackground } from '@/components/ui/hyper-background'
import type { MembershipPlan } from '@/lib/types'

const NAV_LINKS = [
  { label: 'Facilities', href: '#facilities' },
  { label: 'Membership', href: '#membership' },
  { label: 'Trainers', href: '#trainers' },
  { label: 'Contact', href: '#contact' },
]

function durationLabel(plan: MembershipPlan) {
  const unit =
    plan.duration_value === 1 ? plan.duration_unit.replace(/s$/, '') : plan.duration_unit
  return `${plan.duration_value} ${unit}`
}

function monthsOf(plan: MembershipPlan) {
  if (plan.duration_unit === 'months') return plan.duration_value
  if (plan.duration_unit === 'years') return plan.duration_value * 12
  return plan.duration_value / 30
}

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.45 },
}

export default function LandingPage() {
  const { gym, branches, plans, trainers } = useApp()
  const [menuOpen, setMenuOpen] = useState(false)

  const activePlans = useMemo(() => plans.filter((p) => p.status === 'active'), [plans])
  const activeTrainers = useMemo(() => trainers.filter((t) => t.status === 'active'), [trainers])
  const bestValueId = useMemo(() => {
    const candidates = activePlans.filter((p) => !p.name.toLowerCase().includes('personal training'))
    if (candidates.length === 0) return null
    return candidates.reduce((best, p) =>
      p.price_paise / monthsOf(p) < best.price_paise / monthsOf(best) ? p : best
    ).id
  }, [activePlans])
  const freezePlans = activePlans.filter((p) => p.freeze_allowed)
  const multiBranchPlans = activePlans.filter((p) => /branch/i.test(p.description))
  const ptPlans = activePlans.filter((p) => p.pt_included)
  const branchName = (id: string) => branches.find((b) => b.id === id)?.name ?? ''

  const facilities = [
    { icon: Dumbbell, title: 'Strength & cardio floor', text: 'Free weights, racks, machines and a dedicated cardio zone.' },
    { icon: UserCheck, title: 'Personal training', text: `One-on-one sessions with ${activeTrainers.length} certified trainers.` },
    { icon: Apple, title: 'Diet consultation', text: 'Meal plans and calorie targets set with our nutrition team.' },
    { icon: Droplets, title: 'Lockers & steam bath', text: 'Locker facilities on every plan; steam bath on longer plans.' },
    { icon: QrCode, title: 'QR check-in', text: 'Scan your member card at reception. No registers, no waiting.' },
    { icon: Receipt, title: 'Digital invoices', text: 'Every payment gets an invoice and a reminder before renewal.' },
  ]

  const steps = [
    { n: '1', title: 'Join at reception', text: 'Pick a plan, pay by cash, UPI, card or bank transfer and get your invoice.' },
    { n: '2', title: 'Get your QR member card', text: 'Your card is issued the same day and works at the reception scanner.' },
    { n: '3', title: 'Track everything in the portal', text: 'Plan validity, attendance, workouts, diet and payments on your phone.' },
  ]

  const faqs = [
    {
      q: 'Can I freeze my membership?',
      a:
        freezePlans.length > 0
          ? `Yes, on ${freezePlans.map((p) => `${p.name} (up to ${p.freeze_days} days)`).join(', ')}. Ask at reception before the freeze starts.`
          : 'Freeze is not available on the current plans. Ask at reception for options.',
    },
    {
      q: 'What happens when my plan expires?',
      a: `You get ${gym.grace_days} grace ${gym.grace_days === 1 ? 'day' : 'days'} to renew. After that the scanner blocks check-in until the plan is renewed.`,
    },
    {
      q: 'Do I get a GST invoice?',
      a: gym.gst_registered
        ? `Yes. Every payment is invoiced with CGST ${gym.cgst_rate}% and SGST ${gym.sgst_rate}%${gym.gstin ? ` under GSTIN ${gym.gstin}` : ''}.`
        : 'Yes. Every payment gets a numbered invoice you can download from the portal.',
    },
    {
      q: 'Can I train at both branches?',
      a:
        multiBranchPlans.length > 0
          ? `${multiBranchPlans.map((p) => p.name).join(' and ')} ${multiBranchPlans.length === 1 ? 'includes' : 'include'} access to every branch. Other plans are valid at the branch you joined.`
          : 'Plans are valid at the branch you joined. Ask at reception about multi-branch access.',
    },
    {
      q: 'How do personal training sessions work?',
      a:
        ptPlans.length > 0
          ? `${ptPlans.map((p) => `${p.name} includes ${p.pt_sessions_count} sessions`).join('; ')}. Sessions are scheduled with your trainer and tracked in the portal.`
          : 'Personal training is booked directly with a trainer at reception.',
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans relative overflow-x-hidden">
      <HyperBackground />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2.5 min-w-0">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-black border border-primary/40 p-1 flex items-center justify-center">
              <img src={gym.logo_url || '/logo.png'} alt={gym.name} className="h-full w-full object-contain" />
            </div>
            <div className="min-w-0">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-foreground block truncate">{gym.name}</span>
              <span className="text-[11px] text-muted-foreground font-medium block -mt-0.5 truncate">
                {gym.city}, {gym.state}
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-muted-foreground">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="hover:text-primary transition-colors">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/portal" className="hidden sm:block">
              <Button variant="outline" size="sm" className="font-semibold">Member Portal</Button>
            </Link>
            <Link href="/login">
              <Button size="sm" className="gap-1.5 font-semibold">
                <span>Staff Login</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <button
              type="button"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden h-10 w-10 inline-flex items-center justify-center rounded-xl border border-border text-foreground"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-border bg-card px-4 py-3 space-y-1">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-3 rounded-xl text-sm font-semibold text-foreground hover:bg-accent"
              >
                {l.label}
              </a>
            ))}
            <Link
              href="/portal"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-semibold text-primary hover:bg-accent"
            >
              <Smartphone className="h-4 w-4" /> Member Portal
            </Link>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative pt-14 sm:pt-20 pb-16 sm:pb-24 px-4 sm:px-6 max-w-7xl mx-auto text-center z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-soft text-primary-softText text-xs font-bold mb-6 border border-primary/20 max-w-full"
        >
          <Clock className="h-4 w-4 text-primary shrink-0" />
          <span className="truncate">Open {gym.opening_hours}</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.15]"
        >
          Strength, cardio and real coaching in <span className="gradient-text">{gym.city}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          {gym.name} runs {branches.length} {branches.length === 1 ? 'branch' : 'branches'} with a full strength and cardio floor,
          certified trainers, personal training and diet consultation. Check in with your QR member card and manage your plan from your phone.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3"
        >
          <a href="#membership" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto rounded-xl gap-2 font-bold">
              <span>View membership plans</span>
              <ArrowRight className="h-5 w-5" />
            </Button>
          </a>
          <Link href="/portal" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-xl font-bold glass-card gap-2">
              <Smartphone className="h-5 w-5" /> Member Portal
            </Button>
          </Link>
        </motion.div>

        {/* Facts strip */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 sm:mt-16 mx-auto max-w-5xl rounded-2xl sm:rounded-3xl glass-card p-4 sm:p-6 text-left"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-xl bg-card/80 border border-border/80">
              <span className="text-xs text-muted-foreground block font-medium">Branches</span>
              <span className="text-2xl font-extrabold mt-1 block">{branches.length}</span>
              <span className="text-[11px] text-muted-foreground mt-1 block truncate">{gym.city}, {gym.state}</span>
            </div>
            <div className="p-4 rounded-xl bg-card/80 border border-border/80">
              <span className="text-xs text-muted-foreground block font-medium">Certified trainers</span>
              <span className="text-2xl font-extrabold mt-1 block">{activeTrainers.length}</span>
              <span className="text-[11px] text-muted-foreground mt-1 block">Strength, weight loss, calisthenics</span>
            </div>
            <div className="p-4 rounded-xl bg-card/80 border border-border/80">
              <span className="text-xs text-muted-foreground block font-medium">Membership options</span>
              <span className="text-2xl font-extrabold mt-1 block">{activePlans.length}</span>
              <span className="text-[11px] text-muted-foreground mt-1 block">Monthly to annual, plus PT</span>
            </div>
            <div className="p-4 rounded-xl bg-card/80 border border-border/80">
              <span className="text-xs text-muted-foreground block font-medium">Hours</span>
              <span className="text-sm font-extrabold mt-2 block leading-snug">{gym.opening_hours}</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {branches.map((b) => (
              <div key={b.id} className="flex items-start gap-3 p-4 rounded-xl border border-border/80 bg-card/60">
                <Building2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-foreground">{b.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 break-words">{b.address}</p>
                  <a href={`tel:${b.phone.replace(/\s+/g, '')}`} className="text-xs font-semibold text-primary mt-1 inline-block">
                    {b.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Facilities */}
      <section id="facilities" className="py-16 sm:py-24 bg-card/40 border-y border-border/80 px-4 sm:px-6 relative z-10 scroll-mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">What you get as a member</h2>
            <p className="mt-3 text-muted-foreground text-sm sm:text-base">
              Everything below is available today at both branches unless your plan says otherwise.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {facilities.map((f) => {
              const Icon = f.icon
              return (
                <motion.div key={f.title} {...fadeUp} className="p-5 sm:p-6 rounded-2xl glass-card space-y-3">
                  <div className="h-11 w-11 rounded-xl bg-primary-soft text-primary flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.text}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto w-full relative z-10">
        <div className="max-w-2xl mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">How joining works</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {steps.map((s) => (
            <motion.div key={s.n} {...fadeUp} className="p-5 sm:p-6 rounded-2xl border border-border bg-card/70 flex gap-4">
              <div className="h-10 w-10 shrink-0 rounded-full brand-btn-gradient text-white font-extrabold flex items-center justify-center">
                {s.n}
              </div>
              <div>
                <h3 className="font-bold text-base">{s.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{s.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Membership plans */}
      <section id="membership" className="py-16 sm:py-24 bg-card/40 border-y border-border/80 px-4 sm:px-6 relative z-10 scroll-mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">Membership plans</h2>
            <p className="mt-3 text-muted-foreground text-sm sm:text-base">
              Prices are {gym.gst_registered ? 'before GST' : 'all-inclusive'}. Pay at reception by cash, UPI, card or bank transfer.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {activePlans.map((p) => {
              const best = p.id === bestValueId
              return (
                <motion.div
                  key={p.id}
                  {...fadeUp}
                  className={`relative rounded-2xl glass-card p-5 sm:p-6 flex flex-col gap-4 ${best ? 'border-2 border-primary' : ''}`}
                >
                  {best && (
                    <span className="absolute -top-3 right-5 bg-primary text-white text-[11px] font-bold px-3 py-1 rounded-full">
                      BEST VALUE
                    </span>
                  )}
                  <div>
                    <h3 className="text-base sm:text-lg font-bold leading-snug pr-16">{p.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{durationLabel(p)}</p>
                  </div>
                  <p className="text-2xl sm:text-3xl font-extrabold whitespace-nowrap">
                    {formatCurrency(p.price_paise)}
                    <span className="text-xs font-normal text-muted-foreground ml-1.5">/ {durationLabel(p)}</span>
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">{p.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {p.pt_included && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-success text-success-text">
                        <UserCheck className="h-3 w-3" /> {p.pt_sessions_count} PT sessions
                      </span>
                    )}
                    {p.freeze_allowed && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-info text-info-text">
                        <Snowflake className="h-3 w-3" /> Freeze up to {p.freeze_days} days
                      </span>
                    )}
                    {/branch/i.test(p.description) && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-warning text-warning-text">
                        <Building2 className="h-3 w-3" /> All branches
                      </span>
                    )}
                  </div>
                  <a href={`tel:${gym.phone.replace(/\s+/g, '')}`} className="block">
                    <Button variant={best ? 'default' : 'outline'} className="w-full rounded-xl font-semibold gap-2">
                      <Phone className="h-4 w-4" /> Call to join
                    </Button>
                  </a>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Trainers */}
      <section id="trainers" className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto w-full relative z-10 scroll-mt-16">
        <div className="max-w-2xl mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">Trainers</h2>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base">
            Ask for any of them at reception. Personal training slots are booked directly with the trainer.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {activeTrainers.map((t) => (
            <motion.div key={t.id} {...fadeUp} className="p-5 rounded-2xl glass-card flex items-center gap-4">
              <div className="h-14 w-14 shrink-0 rounded-full overflow-hidden border border-primary/40 bg-muted">
                {t.photo_url ? (
                  <img src={t.photo_url} alt={t.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-lg font-bold text-primary">
                    {t.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-base truncate">{t.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5 break-words">{t.specialization}</p>
                <p className="text-[11px] text-primary font-semibold mt-1 truncate">
                  {t.experience_years} yrs · {branchName(t.branch_id)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 sm:py-24 bg-card/40 border-y border-border/80 px-4 sm:px-6 relative z-10 scroll-mt-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-8 sm:mb-10">Common questions</h2>
          <div className="space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="group rounded-2xl border border-border bg-card/70 open:border-primary/40">
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-4 sm:px-5 py-4 min-h-[52px] font-semibold text-sm sm:text-base">
                  <span>{f.q}</span>
                  <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <p className="px-4 sm:px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / footer */}
      <footer id="contact" className="mt-auto bg-card border-t border-border py-10 sm:py-14 px-4 sm:px-6 relative z-10 scroll-mt-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <img src={gym.logo_url || '/logo.png'} alt={gym.name} className="h-8 w-8 object-contain" />
              <span className="font-extrabold text-base">{gym.name}</span>
            </div>
            <p className="text-sm text-muted-foreground flex items-start gap-2">
              <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
              <span>{gym.address}, {gym.city}, {gym.state} {gym.zip_code}</span>
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0 text-primary" /> {gym.opening_hours}
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">Reach us</h4>
            <a href={`tel:${gym.phone.replace(/\s+/g, '')}`} className="flex items-center gap-2 text-sm font-semibold hover:text-primary min-h-[44px]">
              <Phone className="h-4 w-4 text-primary" /> {gym.phone}
            </a>
            <a href={`mailto:${gym.email}`} className="flex items-center gap-2 text-sm font-semibold hover:text-primary min-h-[44px] break-all">
              <Mail className="h-4 w-4 text-primary shrink-0" /> {gym.email}
            </a>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">Sign in</h4>
            <Link href="/portal" className="flex items-center gap-2 text-sm font-semibold hover:text-primary min-h-[44px]">
              <Smartphone className="h-4 w-4 text-primary" /> Member Portal
            </Link>
            <Link href="/login" className="flex items-center gap-2 text-sm font-semibold hover:text-primary min-h-[44px]">
              <CreditCard className="h-4 w-4 text-primary" /> Staff Login
            </Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-border text-xs text-muted-foreground">
          © {new Date().getFullYear()} {gym.name}. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
