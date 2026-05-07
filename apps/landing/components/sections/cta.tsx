'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function CTASection() {
  return (
    <section className="relative py-20 lg:py-32">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[400px] w-[600px] rounded-full bg-primary/30 blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-8 lg:p-12"
        >
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Ready to automate your
            <span className="block text-gradient">Instagram growth?</span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            Join thousands of creators and businesses who are already using 
            InstaReplyer to convert comments into customers.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="group flex items-center gap-2 rounded-lg bg-primary px-8 py-4 text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90"
            >
              Start Your Free Trial
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="#pricing"
              className="rounded-lg border border-border px-8 py-4 text-base font-semibold text-foreground transition-colors hover:bg-card"
            >
              View Pricing
            </Link>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            No credit card required. Free 14-day trial on all plans.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
