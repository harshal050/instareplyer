'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@instareplyer/utils';

const plans = [
  {
    name: 'Starter',
    description: 'Perfect for creators just getting started',
    price: { monthly: '₹2,610.00', yearly: '₹2,088.00' },
    features: [
      '1 Instagram account',
      '5 active campaigns',
      '1,000 DMs per month',
      'Basic analytics',
      'Email support',
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Pro',
    description: 'For growing businesses and influencers',
    price: { monthly: '₹7,436.02', yearly: '₹5,948.82' },
    features: [
      '5 Instagram accounts',
      '20 active campaigns',
      '10,000 DMs per month',
      'Advanced analytics',
      'AI message generation',
      'Priority support',
      'Custom branding',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    description: 'For agencies and large teams',
    price: { monthly: '₹18,730.04', yearly: '₹14,984.03' },
    features: [
      'Unlimited Instagram accounts',
      'Unlimited campaigns',
      'Unlimited DMs',
      'White-label solution',
      'API access',
      'Dedicated account manager',
      'Custom integrations',
      'SLA guarantee',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

const clientUrl = process.env.NEXT_PUBLIC_CLIENT_URL || 'http://localhost:3000';

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-medium uppercase tracking-wider text-primary"
          >
            Pricing
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl"
          >
            Simple, transparent pricing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground"
          >
            Start free and scale as you grow. No hidden fees, cancel anytime.
          </motion.p>
        </div>

        {/* Pricing Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-10 flex items-center justify-center gap-4"
        >
          <span className="text-sm text-foreground">Monthly</span>
          <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary">
            Save 20% yearly
          </span>
        </motion.div>

        {/* Pricing Cards */}
        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                'relative rounded-2xl border p-8',
                plan.popular
                  ? 'border-primary bg-gradient-to-b from-primary/10 to-transparent'
                  : 'border-border bg-card'
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                    Most Popular
                  </span>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <div className="mt-6">
                <span className="text-4xl font-bold text-foreground">{plan.price.monthly}</span>
                <span className="text-muted-foreground">/month</span>
              </div>

              <ul className="mt-8 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="h-5 w-5 shrink-0 text-primary" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.cta === 'Contact Sales' ? `${clientUrl}/register?plan=enterprise` : `${clientUrl}/register`}
                className={cn(
                  'mt-8 block w-full rounded-lg py-3 text-center text-sm font-medium transition-colors',
                  plan.popular
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'bg-foreground text-background hover:bg-foreground/90'
                )}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Enterprise CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground">
            Need a custom solution?{' '}
            <Link href="/contact" className="font-medium text-primary hover:underline">
              Let&apos;s talk
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
