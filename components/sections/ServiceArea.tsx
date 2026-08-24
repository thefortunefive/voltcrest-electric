'use client';

import { useRef } from 'react';
import { useFadeUp } from '@/lib/animations';
import { SITE } from '@/lib/site-config';

export default function ServiceArea() {
  const ref = useRef<HTMLElement>(null);
  useFadeUp(ref);

  return (
    <section ref={ref} id="service-area" className="scroll-mt-20 bg-night-2 px-4 py-20 md:px-6 md:py-28">
      <div className="mx-auto max-w-6xl">
        <p data-reveal className="font-display text-sm font-bold uppercase tracking-[0.3em] text-amber">
          Where We Work
        </p>
        <h2 data-reveal className="mt-3 max-w-2xl font-display text-4xl font-extrabold text-white md:text-5xl">
          {SITE.serviceArea.headline}
        </h2>
        <p data-reveal className="mt-5 max-w-2xl text-lg text-white/60">
          Fast, local service across {SITE.serviceArea.city} and the surrounding
          communities.
        </p>
        <p data-reveal className="mt-4 max-w-2xl text-white/60">
          {SITE.name} provides electrical service throughout {SITE.serviceArea.city}{' '}
          and nearby areas including{' '}
          {SITE.serviceArea.towns.slice(0, -1).join(', ')}, and{' '}
          {SITE.serviceArea.towns[SITE.serviceArea.towns.length - 1]}.
        </p>
        <div data-reveal className="mt-10 flex flex-wrap gap-3">
          {[SITE.serviceArea.city, ...SITE.serviceArea.towns].map((t) => (
            <span
              key={t}
              className="inline-flex min-h-[44px] items-center rounded-full border border-white/15 bg-white/5 px-6 font-medium text-white/85"
            >
              {t}
            </span>
          ))}
        </div>
        <p data-reveal className="mt-8 text-white/50">
          {SITE.serviceArea.radiusNote}
        </p>
      </div>
    </section>
  );
}
