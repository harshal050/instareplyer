'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@instareplyer/utils';

const faqs = [
  {
    question: 'Is InstaReplyer safe for my Instagram account?',
    answer:
      'Yes, absolutely. We use Instagram\'s official Graph API and Messenger API, which means we\'re fully compliant with their terms of service. We also implement smart rate limiting to ensure your account stays in good standing.',
  },
  {
    question: 'What type of Instagram account do I need?',
    answer:
      'You\'ll need an Instagram Business or Creator account connected to a Facebook Page. This is required to access Instagram\'s official API. Converting your account is free and takes just a few minutes.',
  },
  {
    question: 'Can I customize the messages for different campaigns?',
    answer:
      'Yes! Each campaign can have its own unique DM templates. You can use personalization tokens like the commenter\'s username, the original comment text, and more. Our AI can also help you generate high-converting message templates.',
  },
  {
    question: 'How fast are the DMs sent after someone comments?',
    answer:
      'Typically within 30-60 seconds. You can also configure custom delays to make the interaction feel more natural. Our smart scheduling system ensures messages are sent at optimal times.',
  },
  {
    question: 'What happens if I reach my monthly DM limit?',
    answer:
      'You\'ll receive a notification when you\'re approaching your limit. You can upgrade your plan at any time to get more DMs, and the upgrade takes effect immediately.',
  },
  {
    question: 'Can I try InstaReplyer before committing to a paid plan?',
    answer:
      'Yes! All plans come with a 14-day free trial, no credit card required. You can test all features and see results before deciding to subscribe.',
  },
  {
    question: 'Do you offer refunds?',
    answer:
      'We offer a 30-day money-back guarantee. If you\'re not satisfied with InstaReplyer for any reason, contact our support team within 30 days of your purchase for a full refund.',
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 lg:py-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-medium uppercase tracking-wider text-primary"
          >
            FAQ
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl"
          >
            Frequently asked questions
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 text-lg text-muted-foreground"
          >
            Everything you need to know about InstaReplyer
          </motion.p>
        </div>

        {/* FAQ List */}
        <div className="mt-12 space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="rounded-xl border border-border bg-card"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between px-6 py-4 text-left"
              >
                <span className="font-medium text-foreground">{faq.question}</span>
                <ChevronDown
                  className={cn(
                    'h-5 w-5 shrink-0 text-muted-foreground transition-transform',
                    openIndex === index && 'rotate-180'
                  )}
                />
              </button>
              <div
                className={cn(
                  'overflow-hidden transition-all duration-200',
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                )}
              >
                <p className="px-6 pb-4 text-muted-foreground">{faq.answer}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground">
            Still have questions?{' '}
            <a href="mailto:support@instareplyer.com" className="font-medium text-primary hover:underline">
              Contact our support team
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
