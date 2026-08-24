'use client';

import { useRef } from 'react';
import { useFadeUp } from '@/lib/animations';
import { SITE } from '@/lib/site-config';

const ICON_PROPS = {
  width: 28,
  height: 28,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

const SERVICES = [
  {
    title: 'Panel Upgrades',
    icon: (
      <svg {...ICON_PROPS} aria-hidden="true">
        <rect x="5" y="3" width="14" height="18" rx="2" />
        <path d="M9 7h6M9 11h6M9 15h3" />
      </svg>
    ),
    body: 'Modern 200-amp panels that end tripped breakers and make room for everything your home runs today — and tomorrow.',
  },
  {
    title: 'EV Chargers',
    icon: (
      <svg {...ICON_PROPS} aria-hidden="true">
        <path d="M13 2 L6 13 L11 13 L9.5 22 L18 10 L12.5 10 Z" />
      </svg>
    ),
    body: 'Level 2 home charging installed right: correct circuit sizing, clean mounting, permits handled. Wake up to a full battery every morning.',
  },
  {
    title: 'Rewiring',
    icon: (
      <svg {...ICON_PROPS} aria-hidden="true">
        <path d="M4 18c4 0 4-12 8-12s4 12 8 12" />
        <circle cx="4" cy="18" r="1.6" />
        <circle cx="20" cy="18" r="1.6" />
      </svg>
    ),
    body: 'Aluminum, knob-and-tube, or just tired wiring — replaced safely with minimal wall damage. Peace of mind behind every outlet.',
  },
  {
    title: 'Lighting Design',
    icon: (
      <svg {...ICON_PROPS} aria-hidden="true">
        <path d="M12 3a6 6 0 0 0-3.5 10.9c.8.6 1.5 1.7 1.5 2.6h4c0-.9.7-2 1.5-2.6A6 6 0 0 0 12 3z" />
        <path d="M10 20h4" />
      </svg>
    ),
    body: 'Recessed, under-cabinet, landscape, and smart lighting that transforms how your home looks and feels — inside and out.',
  },
  {
    title: 'Generators & Backup',
    icon: (
      <svg {...ICON_PROPS} aria-hidden="true">
        <rect x="3" y="8" width="18" height="10" rx="2" />
        <path d="M7 8V5h10v3M9 13h2l1-2 2 4 1-2h2" />
      </svg>
    ),
    body: 'Whole-home standby generators and transfer switches, sized and installed so the next outage is something you read about, not sit through.',
  },
  {
    title: '24/7 Emergency',
    icon: (
      <svg {...ICON_PROPS} aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" />
      </svg>
    ),
    body: `No power, burning smell, sparking outlet? Call ${SITE.phone} any hour — a licensed electrician answers, every day of the year.`,
  },
];

export default function Services() {
  const ref = useRef<HTMLElement>(null);
  useFadeUp(ref);

  return (
    <section ref={ref} id="services" className="scroll-mt-20 bg-night px-4 py-20 md:px-6 md:py-28">
      <div className="mx-auto max-w-6xl">
        <p data-reveal className="font-display text-sm font-bold uppercase tracking-[0.3em] text-amber">
          What We Do
        </p>
        <h2 data-reveal className="mt-3 max-w-2xl font-display text-4xl font-extrabold text-white md:text-5xl">
          Every Wire. Every Watt. Done Right.
        </h2>
        <p data-reveal className="mt-5 max-w-2xl text-lg text-white/60">
          From a single dead outlet to a whole-home rewire, {SITE.name} handles
          it with licensed pros and clean workmanship.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <div key={s.title} data-reveal data-reveal-group="services" className="card">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-amber/15 text-amber-light">
                {s.icon}
              </div>
              <h3 className="mt-5 font-display text-2xl font-bold text-white">{s.title}</h3>
              <p className="mt-3 leading-relaxed text-white/60">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
