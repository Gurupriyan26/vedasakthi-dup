import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VEDA-SAKTHI – Minister\'s Command View | Tamil Nadu Education Dashboard',
  description:
    'Real-time analytics dashboard for Tamil Nadu Government Schools. ' +
    'Monitor attendance, infrastructure, NEET results, and more across all 38 districts.',
  keywords: 'Tamil Nadu, education, dashboard, government schools, analytics, NEET, attendance',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
