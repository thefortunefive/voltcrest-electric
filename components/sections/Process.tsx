'use client';

import { useRef } from 'react';
import { useFadeUp } from '@/lib/animations';

const STEPS = [
  {
    n: '01',
    title: 'Request',
    body: 'Call us or book online in under a minute. Tell us what’s going on and we’ll get you on the schedule fast.',
  },
  {
    n: '02',
    title: 'Estimate',
    body: 'A licensed electrician diagnoses the issue and gives you a clear, upfront price before any work begins.',
  },
  {
    n: '03',
    title: 'Fix',
    body: 'We complete the job right the first time — to code, with quality materials and workmanship you can count on.',
  },
  {
    n: '04',
    title: 'Powered Up',
    body: 'We don’t leave until everything is tested, safe, and working perfectly — and you’re completely satisfied.',
  },
];

export default function Process() {
  const ref = useRef<HTMLElement>(null);
  useFadeUp(ref);

  return (
    <section ref={ref} id="process" className="scroll-mt-20 bg-night px-4 py-20 md:px-6 md:py-28">
      <div className="mx-auto max-w-6xl">
        <p data-reveal className="font-display text-sm font-bold uppercase tracking-[0.3em] text-amber">
          How It Works
        </p>
        <h2 data-reveal className="mt-3 max-w-2xl font-display text-4xl font-extrabold text-white md:text-5xl">
          Power Restored in Four Simple Steps
        </h2>
        <p data-reveal className="mt-5 max-w-2xl text-lg text-white/60">
          We make getting the lights back on straightforward from the first
          call to the last switch.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.n} data-reveal data-reveal-group="steps" className="card relative">
              <span className="font-display text-5xl font-extrabold text-amber/30">{s.n}</span>
              <h3 className="mt-3 font-display text-2xl font-bold text-white">{s.title}</h3>
              <p className="mt-3 leading-relaxed text-white/60">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
