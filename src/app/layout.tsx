import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VEDA-SAKTHI – Minister\'s Command View | Tamil Nadu Education Dashboard',
  description:
    'Interactive data dashboard for Tamil Nadu Government Schools. ' +
    'Explore attendance, infrastructure, NEET results, and more across all 38 districts.',
  keywords: 'Tamil Nadu, education, dashboard, government schools, NEET, attendance',
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
