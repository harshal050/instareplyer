'use client';

import { motion } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Connect Your Account',
    description:
      'Link your Instagram Business or Creator account in just a few clicks. We use the official Instagram API to keep your account safe.',
  },
  {
    number: '02',
    title: 'Create Your Campaign',
    description:
      'Select your posts, set up keyword triggers, and craft personalized DM templates. Use our AI to generate high-converting messages.',
  },
  {
    number: '03',
    title: 'Watch Leads Roll In',
    description:
      'Sit back as InstaReplyer automatically engages with commenters. Track performance in real-time and optimize for better results.',
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative py-20 lg:py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-medium uppercase tracking-wider text-primary"
          >
            How It Works
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl"
          >
            Get started in minutes
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground"
          >
            Three simple steps to automate your Instagram engagement
          </motion.p>
        </div>

        {/* Steps */}
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="absolute top-12 left-full hidden h-0.5 w-full bg-gradient-to-r from-primary/50 to-transparent lg:block" />
              )}

              <div className="relative rounded-2xl border border-border bg-card p-8">
                <span className="text-5xl font-bold text-primary/20">{step.number}</span>
                <h3 className="mt-4 text-xl font-semibold text-foreground">{step.title}</h3>
                <p className="mt-3 text-muted-foreground">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Demo Video Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mx-auto mt-16 max-w-4xl"
        >
          <div className="glass rounded-2xl p-2">
            <div className="relative aspect-video overflow-hidden rounded-xl bg-card">
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  type="button"
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-110"
                  aria-label="Play demo video"
                >
                  <svg className="h-6 w-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="h-1 w-full rounded-full bg-muted/40">
                  <div className="h-1 w-1/3 rounded-full bg-primary" />
                </div>
              </div>
            </div>
          </div>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Watch how InstaReplyer helped @fashionista grow their email list by 300%
          </p>
        </motion.div>
      </div>
    </section>
  );
}
