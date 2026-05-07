'use client';

import { motion } from 'framer-motion';
import {
  MessageCircle,
  Target,
  Zap,
  BarChart3,
  Clock,
  Shield,
} from 'lucide-react';

const features = [
  {
    icon: Target,
    title: 'Keyword Triggers',
    description:
      'Set up custom keywords that trigger automated DMs. Use exact match, contains, or regex patterns for precise targeting.',
  },
  {
    icon: MessageCircle,
    title: 'Personalized Messages',
    description:
      'Create dynamic DM templates with personalization tokens. Include the commenter\'s name, comment text, and more.',
  },
  {
    icon: Zap,
    title: 'Instant Delivery',
    description:
      'Messages are sent within seconds of a comment being posted. Beat your competition to the conversation.',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description:
      'Track delivery rates, open rates, and conversions. Understand which campaigns drive the most results.',
  },
  {
    icon: Clock,
    title: 'Smart Scheduling',
    description:
      'Set active hours and rate limits to ensure your messages feel natural and comply with Instagram guidelines.',
  },
  {
    icon: Shield,
    title: 'Safe & Compliant',
    description:
      'Built with Instagram\'s official API. Your account stays safe with built-in rate limiting and compliance features.',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-medium uppercase tracking-wider text-primary"
          >
            Features
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl"
          >
            Everything you need to automate
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground"
          >
            Powerful features designed to help you convert Instagram engagement 
            into real conversations and sales.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
