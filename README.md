# InstaReplyer AI

A SaaS platform for automating Instagram comment-to-DM workflows. When users comment specific keywords on your posts, the system automatically sends personalized direct messages.

## Architecture

This is a **Turborepo monorepo** with the following structure:

```
├── apps/
│   ├── landing/      # Marketing landing page (Next.js)
│   ├── client/       # User dashboard (Next.js)
│   ├── cms/          # Admin CMS panel (Next.js) - TODO
│   └── backend/      # Express.js API server
│
├── packages/
│   ├── types/        # Shared TypeScript types
│   ├── utils/        # Shared utility functions
│   ├── database/     # MongoDB schemas & connections
│   └── config/       # Shared configuration
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+
- MongoDB (local or Atlas)
- Redis (local or Upstash)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

4. Configure your `.env` file with your credentials

5. Start the development servers:
   ```bash
   pnpm dev
   ```

### Running Individual Apps

```bash
# Landing page (port 3002)
pnpm dev --filter=@instareplyer/landing

# Client dashboard (port 3000)
pnpm dev --filter=@instareplyer/client

# Backend API (port 5000)
pnpm dev --filter=@instareplyer/backend
```

## Features

- **Keyword-triggered DMs**: Automatically send DMs when users comment specific keywords
- **Multiple Instagram accounts**: Connect and manage multiple business accounts
- **Campaign management**: Create, pause, and monitor automation campaigns
- **Analytics dashboard**: Track DMs sent, conversion rates, and engagement
- **AI-powered messages**: Use AI to generate personalized message templates
- **Rate limiting**: Built-in protection against API limits
- **Real-time processing**: Queue-based architecture for reliable message delivery

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS, Zustand
- **Backend**: Express.js, TypeScript
- **Database**: MongoDB with Mongoose
- **Cache/Queue**: Redis with BullMQ
- **Auth**: JWT (access + refresh tokens)
- **Payments**: Stripe

## License

MIT
