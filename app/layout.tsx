import type { Metadata } from 'next';
import { Barlow, Inter } from 'next/font/google';
import { SITE } from '@/lib/site-config';
import SmoothScroll from '@/components/SmoothScroll';
import './globals.css';

const display = Barlow({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-display',
});

const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: `${SITE.legalName} — ${SITE.tagline}`,
  description: SITE.description,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
