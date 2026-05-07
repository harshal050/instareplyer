'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    quote:
      'InstaReplyer completely transformed how we handle Instagram leads. We went from manually responding to hundreds of comments to having everything automated. Our conversion rate tripled in the first month.',
    author: 'Sarah Chen',
    role: 'Founder, StyleBox',
    avatar: '/avatars/avatar-1.jpg',
    rating: 5,
  },
  {
    quote:
      'As a content creator, I was spending hours every day responding to comments. Now InstaReplyer handles it all automatically while I focus on creating content. Best investment I\'ve made for my business.',
    author: 'Marcus Johnson',
    role: 'Content Creator, 500K followers',
    avatar: '/avatars/avatar-2.jpg',
    rating: 5,
  },
  {
    quote:
      'The keyword targeting is incredibly precise. We set up campaigns for different products and the right message goes to the right person every time. Our DM-to-sale conversion is now over 15%.',
    author: 'Elena Rodriguez',
    role: 'Marketing Director, Luxe Beauty',
    avatar: '/avatars/avatar-3.jpg',
    rating: 5,
  },
];

const logos = [
  { name: 'TechCrunch', opacity: 0.6 },
  { name: 'Forbes', opacity: 0.6 },
  { name: 'Product Hunt', opacity: 0.6 },
  { name: 'Entrepreneur', opacity: 0.6 },
  { name: 'Inc.', opacity: 0.6 },
];

export function TestimonialsSection() {
  return (
    <section className="relative py-20 lg:py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-medium uppercase tracking-wider text-primary"
          >
            Testimonials
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl"
          >
            Loved by creators & businesses
          </motion.h2>
        </div>

        {/* Testimonials Grid */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="rounded-2xl border border-border bg-card p-6"
            >
              {/* Rating */}
              <div className="flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>

              {/* Quote */}
              <p className="mt-4 text-muted-foreground">&quot;{testimonial.quote}&quot;</p>

              {/* Author */}
              <div className="mt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary" />
                <div>
                  <div className="font-medium text-foreground">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Social Proof Logos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-20"
        >
          <p className="text-center text-sm uppercase tracking-wider text-muted-foreground">
            Featured in
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-8 lg:gap-12">
            {logos.map((logo) => (
              <span
                key={logo.name}
                className="text-xl font-bold text-muted-foreground/60 lg:text-2xl"
                style={{ opacity: logo.opacity }}
              >
                {logo.name}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
