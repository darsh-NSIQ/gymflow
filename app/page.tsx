'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Dumbbell,
  Users,
  QrCode,
  CreditCard,
  Zap,
  CheckCircle,
  Shield,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Building2,
  Smartphone,
  Star,
  Activity,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useApp } from '@/lib/context'
import { HyperBackground } from '@/components/ui/hyper-background'

export default function LandingPage() {
  const { gym } = useApp()

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans relative overflow-x-hidden">
      {/* Interactive Particle Canvas & Mouse Spotlight */}
      <HyperBackground />

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-card/75 backdrop-blur-md border-b border-border/80 shadow-soft-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-10 w-10 rounded-xl bg-card border border-border p-1 shadow-soft-xs flex items-center justify-center group-hover:scale-105 transition-transform duration-fast">
              <img src={gym.logo_url || '/logo.png'} alt={gym.name} className="h-full w-full object-contain" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-foreground">{gym.name}</span>
              <span className="text-xs text-primary font-bold block -mt-1">Gym Management SaaS</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-muted-foreground">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-primary transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline" size="sm" className="font-semibold">Log In</Button>
            </Link>
            <Link href="/app/dashboard">
              <Button size="sm" className="gap-1.5 shadow-soft-md font-semibold">
                <span>Enter Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 px-4 sm:px-6 max-w-7xl mx-auto text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-soft text-primary-softText text-xs font-bold mb-8 border border-primary/20 shadow-soft-xs"
        >
          <Sparkles className="h-4 w-4 text-primary animate-spin" style={{ animationDuration: '6s' }} />
          <span>Next-Gen Multi-Tenant Gym Management Platform</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-7xl font-extrabold text-foreground tracking-tight max-w-5xl mx-auto leading-[1.15]"
        >
          Manage Your Gym Operations From <span className="gradient-text">A to Z</span> With Power
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          Automate member registration, instant QR attendance scanning, GST billing, workout & diet plans, personal training schedules, and retention alerts.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/app/dashboard">
            <Button size="lg" className="w-full sm:w-auto text-base px-8 py-6 rounded-xl shadow-soft-md gap-2 font-bold hover:scale-105 transition-transform">
              <span>Start Managing Your Gym Free</span>
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/onboarding">
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-base px-8 py-6 rounded-xl font-bold glass-card">
              Launch Gym Onboarding Wizard
            </Button>
          </Link>
        </motion.div>

        {/* Interactive Glowing Hero Dashboard Mockup Card */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-16 relative mx-auto max-w-5xl rounded-3xl border border-border/80 glass-card shadow-soft-xl overflow-hidden p-4 sm:p-8 text-left"
        >
          <div className="flex items-center justify-between pb-4 border-b border-border/80 mb-6">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-rose-400" />
              <div className="h-3 w-3 rounded-full bg-amber-400" />
              <div className="h-3 w-3 rounded-full bg-emerald-400" />
              <span className="text-xs text-muted-foreground font-mono ml-2">gymflow.vercel.app/app/dashboard</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold bg-emerald-100/80 text-emerald-800 px-3.5 py-1 rounded-full border border-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              Live System Status: 100% Active
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div whileHover={{ scale: 1.03 }} className="p-4 rounded-2xl bg-card/80 border border-border/80 shadow-soft-xs">
              <span className="text-xs text-muted-foreground block font-medium">Active Members</span>
              <span className="text-2xl font-extrabold text-foreground mt-1 block">1,248</span>
              <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-flex items-center gap-0.5">
                <TrendingUp className="h-3 w-3" /> +12% this month
              </span>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} className="p-4 rounded-2xl bg-card/80 border border-border/80 shadow-soft-xs">
              <span className="text-xs text-muted-foreground block font-medium">Today's Check-ins</span>
              <span className="text-2xl font-extrabold text-foreground mt-1 block">184</span>
              <span className="text-[11px] text-primary font-semibold mt-1 inline-block">Peak: 7 AM - 9 AM</span>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} className="p-4 rounded-2xl bg-card/80 border border-border/80 shadow-soft-xs">
              <span className="text-xs text-muted-foreground block font-medium">Monthly Revenue</span>
              <span className="text-2xl font-extrabold text-foreground mt-1 block">₹4,85,000</span>
              <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-block">100% Tax Compliant</span>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} className="p-4 rounded-2xl bg-card/80 border border-border/80 shadow-soft-xs">
              <span className="text-xs text-muted-foreground block font-medium">PT Sessions Today</span>
              <span className="text-2xl font-extrabold text-foreground mt-1 block">28</span>
              <span className="text-[11px] text-indigo-600 font-semibold mt-1 inline-block">3 Trainers active</span>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-card/40 border-y border-border/80 px-4 sm:px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">Everything You Need To Grow Your Fitness SaaS</h2>
            <p className="mt-3 text-muted-foreground text-base">
              Built with modern React, Next.js, Framer Motion, Supabase, and Tailwind CSS.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div whileHover={{ y: -6 }} className="p-7 rounded-3xl glass-card border border-border shadow-soft-sm space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-primary-soft text-primary flex items-center justify-center shadow-soft-xs">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Member & Plan Management</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Full lifecycle member tracking with plan creation, upgrades, automated freeze logic, renewals, and phone verification.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -6 }} className="p-7 rounded-3xl glass-card border border-border shadow-soft-sm space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-soft-xs">
                <QrCode className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Instant QR Attendance</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Opaque tokenized QR ID cards, reception webcam scanner, instant membership validation, grace access rules, and peak hours analytics.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -6 }} className="p-7 rounded-3xl glass-card border border-border shadow-soft-sm space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shadow-soft-xs">
                <CreditCard className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">GST Invoicing & Payments</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Record UPI, Cash, Card & NetBanking payments. Generate GST invoices (CGST/SGST/IGST) with sequential financial year numbering.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -6 }} className="p-7 rounded-3xl glass-card border border-border shadow-soft-sm space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-soft-xs">
                <Dumbbell className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Workouts & Diet Plans</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Interactive weekly workout plan builder, exercise video references, calorie & macro target calculators, and meal plan templates.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -6 }} className="p-7 rounded-3xl glass-card border border-border shadow-soft-sm space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shadow-soft-xs">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Automated Reminders</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                WHEN-CONDITION-THEN automation rules for expiry alerts, payment overdue notices, inactive member check-ins, and WhatsApp templates.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -6 }} className="p-7 rounded-3xl glass-card border border-border shadow-soft-sm space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shadow-soft-xs">
                <Building2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Multi-Branch SaaS</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Scale seamlessly from single gym to multi-branch franchise with branch-level permission scoping and consolidated reporting.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto w-full relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Subscription Plans for Every Gym</h2>
          <p className="mt-3 text-muted-foreground text-base">Start free on local or Vercel subdomain, then scale as your member base grows.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div whileHover={{ y: -6 }} className="rounded-3xl glass-card p-8 shadow-soft-sm space-y-6">
            <h3 className="text-xl font-bold text-foreground">Starter Plan</h3>
            <p className="text-3xl font-extrabold text-foreground">Free <span className="text-sm font-normal text-muted-foreground">forever</span></p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Up to 100 Members</li>
              <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> 1 Gym Branch</li>
              <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> QR Attendance Scanner</li>
              <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> In-App Notifications</li>
            </ul>
            <Link href="/app/dashboard" className="block">
              <Button variant="outline" className="w-full rounded-xl font-semibold">Get Started</Button>
            </Link>
          </motion.div>

          <motion.div whileHover={{ y: -6 }} className="rounded-3xl glass-card border-2 border-primary p-8 shadow-soft-md space-y-6 relative">
            <div className="absolute -top-3.5 right-6 bg-primary text-white text-xs font-bold px-3.5 py-1 rounded-full shadow-soft-xs">POPULAR</div>
            <h3 className="text-xl font-bold text-foreground">Pro Gym Plan</h3>
            <p className="text-3xl font-extrabold text-foreground">₹2,499 <span className="text-sm font-normal text-muted-foreground">/ month</span></p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Unlimited Members</li>
              <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Up to 3 Branches</li>
              <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> GST Invoicing & Reports</li>
              <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Workout & Diet Builder</li>
              <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> WhatsApp & Email Reminders</li>
            </ul>
            <Link href="/app/dashboard" className="block">
              <Button className="w-full shadow-soft-md rounded-xl font-bold">Start 14-Day Free Trial</Button>
            </Link>
          </motion.div>

          <motion.div whileHover={{ y: -6 }} className="rounded-3xl glass-card p-8 shadow-soft-sm space-y-6">
            <h3 className="text-xl font-bold text-foreground">Enterprise Franchise</h3>
            <p className="text-3xl font-extrabold text-foreground">Custom <span className="text-sm font-normal text-muted-foreground">pricing</span></p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Unlimited Branches & Staff</li>
              <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> White-label Branding & Custom Domain</li>
              <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Dedicated Account Manager</li>
              <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Custom API & Biometric Devices</li>
            </ul>
            <Link href="/app/dashboard" className="block">
              <Button variant="outline" className="w-full rounded-xl font-semibold">Contact Sales</Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-card border-t border-border py-8 px-4 sm:px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <img src={gym.logo_url || '/logo.png'} alt={gym.name} className="h-6 w-6 object-contain" />
            <span className="font-semibold text-foreground">{gym.name} SaaS Platform</span>
            <span>© {new Date().getFullYear()} All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 font-medium">
            <Link href="/app/dashboard" className="hover:text-foreground">App Dashboard</Link>
            <Link href="/portal" className="hover:text-foreground">Member Portal</Link>
            <Link href="/onboarding" className="hover:text-foreground">Onboarding</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
