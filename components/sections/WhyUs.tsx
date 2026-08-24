'use client';

import { useRef } from 'react';
import { useFadeUp } from '@/lib/animations';
import { SITE } from '@/lib/site-config';

const POINTS = [
  {
    stat: 'Licensed',
    label: 'Bonded & Insured',
    body: `Fully licensed electrical contractor (License #${SITE.licenseNumber}). Your home and your investment are protected on every job.`,
  },
  {
    stat: `${SITE.yearsInBusiness}+ yrs`,
    label: 'In Business',
    body: 'Two decades of panels upgraded, homes rewired, and lights brought back on — a reputation built one satisfied customer at a time.',
  },
  {
    stat: '24/7',
    label: 'Emergency Service',
    body: 'Electrical emergencies don’t keep business hours. We answer the phone day or night, every day of the year.',
  },
  {
    stat: 'Upfront',
    label: 'Honest Pricing',
    body: 'You approve the price before we start. No surprises, no hidden fees, no pressure.',
  },
  {
    stat: `${SITE.reviewRating}★`,
    label: 'Star Rated',
    body: `${SITE.reviewCount} of five-star reviews from neighbors across the ${SITE.serviceArea.region}. See why they keep calling ${SITE.name}.`,
  },
  {
    stat: 'Safety',
    label: 'First, Always',
    body: 'Code-compliant work, permits pulled, inspections passed. We don’t cut corners on the thing that protects your family.',
  },
];

export default function WhyUs() {
  const ref = useRef<HTMLElement>(null);
  useFadeUp(ref);

  return (
    <section ref={ref} id="why-us" className="scroll-mt-20 bg-night-2 px-4 py-20 md:px-6 md:py-28">
      <div className="mx-auto max-w-6xl">
        <p data-reveal className="font-display text-sm font-bold uppercase tracking-[0.3em] text-amber">
          Why Choose Us
        </p>
        <h2 data-reveal className="mt-3 max-w-2xl font-display text-4xl font-extrabold text-white md:text-5xl">
          The Crew Your Neighbors Call First
        </h2>
        <p data-reveal className="mt-5 max-w-2xl text-lg text-white/60">
          Reliable service, honest pricing, and real people who treat your home
          like their own.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {POINTS.map((p) => (
            <div
              key={p.label}
              data-reveal
              data-reveal-group="why"
              className="rounded-2xl border border-white/10 bg-white/5 p-8"
            >
              <p className="font-display text-4xl font-extrabold text-amber-light">{p.stat}</p>
              <h3 className="mt-2 font-display text-xl font-bold text-white">{p.label}</h3>
              <p className="mt-3 leading-relaxed text-white/60">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
