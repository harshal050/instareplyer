"use client";

import { DashboardHeader } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Book,
  MessageCircle,
  Mail,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

const helpArticles = [
  {
    title: "Getting Started Guide",
    description: "Learn the basics of setting up your first campaign",
    href: "#",
  },
  {
    title: "Connecting Instagram",
    description: "Step-by-step guide to connect your business account",
    href: "#",
  },
  {
    title: "Creating Effective Campaigns",
    description: "Best practices for high-converting DM automations",
    href: "#",
  },
  {
    title: "Understanding Analytics",
    description: "How to interpret your campaign metrics",
    href: "#",
  },
];

export default function SupportPage() {
  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="Help & Support"
        description="Get help with InstaReplyer AI"
      />

      <div className="p-6">
        <div className="max-w-4xl">
          {/* Search */}
          <div className="rounded-xl border border-border bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 p-8">
            <h2 className="text-xl font-semibold text-foreground">
              How can we help you?
            </h2>
            <div className="mt-4 flex gap-2">
              <Input
                placeholder="Search for help articles..."
                className="flex-1"
              />
              <Button>Search</Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <button className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 text-left transition-colors hover:bg-muted">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10">
                <Book className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Documentation</p>
                <p className="text-sm text-muted-foreground">
                  Browse our guides
                </p>
              </div>
            </button>

            <button className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 text-left transition-colors hover:bg-muted">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-pink-500/10">
                <MessageCircle className="h-6 w-6 text-pink-500" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Live Chat</p>
                <p className="text-sm text-muted-foreground">Chat with us</p>
              </div>
            </button>

            <button className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 text-left transition-colors hover:bg-muted">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                <Mail className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Email Support</p>
                <p className="text-sm text-muted-foreground">
                  support@instareplyer.ai
                </p>
              </div>
            </button>
          </div>

          {/* Popular Articles */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-foreground">
              Popular Articles
            </h3>
            <div className="mt-4 divide-y divide-border rounded-xl border border-border bg-card">
              {helpArticles.map((article) => (
                <a
                  key={article.title}
                  href={article.href}
                  className="flex items-center justify-between p-4 transition-colors hover:bg-muted"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {article.title}
                    </p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {article.description}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </a>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="mt-8 rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground">
              Contact Support
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Can&apos;t find what you&apos;re looking for? Send us a message.
            </p>

            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Subject
                </label>
                <Input placeholder="What do you need help with?" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Message
                </label>
                <textarea
                  className="min-h-[120px] w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Describe your issue in detail..."
                />
              </div>
              <Button>Send Message</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
