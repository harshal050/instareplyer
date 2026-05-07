'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle, Zap, Users } from 'lucide-react';

const stats = [
  { value: '10M+', label: 'DMs Sent' },
  { value: '50K+', label: 'Active Users' },
  { value: '98%', label: 'Delivery Rate' },
  { value: '3x', label: 'More Conversions' },
];

const clientUrl = process.env.NEXT_PUBLIC_CLIENT_URL || 'http://localhost:3000';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32">
      {/* Background Gradient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[800px] rounded-full bg-primary/20 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
              <Zap className="h-4 w-4" />
              Now with AI-powered message personalization
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-8 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-7xl"
          >
            <span className="block">Turn Instagram comments</span>
            <span className="mt-2 block text-gradient">into conversations</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground lg:text-xl"
          >
            Automatically send personalized DMs when users comment specific keywords 
            on your posts. Convert engagement into sales on autopilot.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href={`${clientUrl}/register`}
              className="group flex items-center gap-2 rounded-lg bg-foreground px-6 py-3 text-base font-medium text-background transition-all hover:bg-foreground/90"
            >
              Start Free Trial
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="#how-it-works"
              className="flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-base font-medium text-foreground transition-colors hover:bg-card"
            >
              Watch Demo
            </Link>
          </motion.div>

          {/* Social Proof */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 text-sm text-muted-foreground"
          >
            No credit card required. Free 14-day trial.
          </motion.p>
        </div>

        {/* Product Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="relative mx-auto mt-16 max-w-5xl"
        >
          <div className="glass glow rounded-2xl p-2">
            <div className="relative overflow-hidden rounded-xl bg-card">
              {/* Mock Dashboard */}
              <div className="flex h-[400px] lg:h-[500px]">
                {/* Sidebar */}
                <div className="hidden w-64 border-r border-border p-4 md:block">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-lg bg-primary/20" />
                    <div>
                      <div className="h-3 w-20 rounded bg-foreground/20" />
                      <div className="mt-1 h-2 w-16 rounded bg-muted/40" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    {['Dashboard', 'Campaigns', 'Analytics', 'Settings'].map((item) => (
                      <div key={item} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground">
                        <div className="h-4 w-4 rounded bg-muted/40" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Main Content */}
                <div className="flex-1 p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <div className="h-4 w-32 rounded bg-foreground/20" />
                      <div className="mt-2 h-3 w-48 rounded bg-muted/40" />
                    </div>
                    <div className="flex gap-2">
                      <div className="h-9 w-24 rounded-lg bg-primary/20" />
                    </div>
                  </div>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {[
                      { icon: MessageCircle, label: 'DMs Sent', value: '1,234' },
                      { icon: Users, label: 'New Leads', value: '892' },
                      { icon: Zap, label: 'Active Campaigns', value: '12' },
                      { icon: ArrowRight, label: 'Conversion', value: '24%' },
                    ].map((stat) => (
                      <div key={stat.label} className="rounded-xl border border-border bg-background/50 p-4">
                        <stat.icon className="h-5 w-5 text-primary" />
                        <div className="mt-3 text-2xl font-semibold text-foreground">{stat.value}</div>
                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Chart Placeholder */}
                  <div className="mt-6 rounded-xl border border-border bg-background/50 p-4">
                    <div className="h-4 w-24 rounded bg-foreground/20" />
                    <div className="mt-4 flex items-end gap-2 h-32">
                      {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-t bg-gradient-to-t from-primary/50 to-primary"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-16 grid grid-cols-2 gap-8 lg:grid-cols-4"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-foreground lg:text-4xl">{stat.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
