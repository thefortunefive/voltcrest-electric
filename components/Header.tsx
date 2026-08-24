'use client';

import { useEffect, useState } from 'react';
import { SITE } from '@/lib/site-config';

const LINKS = [
  { href: '#services', label: 'Services' },
  { href: '#why-us', label: 'Why Us' },
  { href: '#process', label: 'Process' },
  { href: '#service-area', label: 'Service Area' },
  { href: '#contact', label: 'Contact' },
];

/** Lightning-bolt mark in the brand amber. */
function Bolt({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <path
        d="M18 3 L8 18 L14.5 18 L12.5 29 L24 13 L17 13 Z"
        fill="#C58935"
        stroke="#E2A94F"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open ? 'bg-night/95 shadow-lg backdrop-blur' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:h-20 md:px-6">
        <a href="#top" className="flex min-h-[44px] items-center gap-2">
          <Bolt />
          <span className="font-display text-xl font-bold tracking-tight text-white">
            {SITE.name}
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 md:flex" aria-label="Main">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="flex min-h-[44px] items-center text-sm font-medium text-white/80 transition-colors hover:text-amber-light"
            >
              {l.label}
            </a>
          ))}
          <a
            href={SITE.phoneHref}
            className="flex min-h-[44px] items-center rounded-full bg-amber px-5 font-display text-sm font-bold text-night transition-colors hover:bg-amber-light"
          >
            {SITE.phone}
          </a>
        </nav>

        {/* Mobile: call button + menu toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <a
            href={SITE.phoneHref}
            aria-label={`Call ${SITE.name} at ${SITE.phone}`}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-amber text-night"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z" />
            </svg>
          </a>
          <button
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label="Toggle navigation menu"
            className="flex h-11 w-11 items-center justify-center text-white"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="border-t border-white/10 bg-night/95 px-4 pb-4 backdrop-blur md:hidden" aria-label="Mobile">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="flex min-h-[44px] items-center text-base font-medium text-white/90 transition-colors hover:text-amber-light"
            >
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
