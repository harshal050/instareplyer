import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'InstaReplyer AI - Instagram Comment Automation',
  description:
    'Automatically send personalized DMs when users comment on your Instagram posts. Convert comments to conversations and grow your business on autopilot.',
  keywords: [
    'instagram automation',
    'instagram dms',
    'comment to dm',
    'instagram marketing',
    'social media automation',
  ],
  openGraph: {
    title: 'InstaReplyer AI - Instagram Comment Automation',
    description: 'Convert Instagram comments to DMs automatically. Grow your business on autopilot.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0b',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} bg-background`}>
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
