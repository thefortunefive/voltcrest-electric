'use client';

import { useRef, useState } from 'react';
import { useFadeUp } from '@/lib/animations';
import { SITE } from '@/lib/site-config';

const FIELD =
  'mt-2 w-full rounded-lg border border-white/15 bg-night px-4 py-3 text-white placeholder:text-white/30 focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber/50';
const LABEL = 'block text-xs font-bold uppercase tracking-[0.2em] text-white/50';

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  useFadeUp(ref);
  const [sent, setSent] = useState(false);

  // DEMO — static site, no backend. A real deployment wires this to a
  // Cloudflare Pages Function (see the fifth-ave-ai sister project) or a
  // form service. For the portfolio demo we show the success state locally.
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section ref={ref} id="contact" className="scroll-mt-20 bg-night px-4 py-20 md:px-6 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-2">
        {/* Left — pitch + phone */}
        <div>
          <p data-reveal className="font-display text-sm font-bold uppercase tracking-[0.3em] text-amber">
            Get Started
          </p>
          <h2 data-reveal className="mt-3 font-display text-4xl font-extrabold text-white md:text-5xl">
            Ready When You Are — Day or Night
          </h2>
          <p data-reveal className="mt-5 max-w-md text-lg text-white/60">
            Get fast, friendly service from a team that shows up. Call now or
            request your free estimate below.
          </p>
          <a
            data-reveal
            href={SITE.phoneHref}
            className="mt-8 inline-flex min-h-[52px] items-center gap-3 rounded-full bg-amber px-8 font-display text-lg font-bold text-night transition-colors hover:bg-amber-light"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z" />
            </svg>
            {SITE.phone}
          </a>
          <div data-reveal className="mt-10 space-y-1 text-white/50">
            <p>{SITE.hours.weekday}</p>
            <p>{SITE.hours.saturday}</p>
            <p className="font-medium text-amber-light">{SITE.hours.emergency}</p>
          </div>
        </div>

        {/* Right — quote form */}
        <div data-reveal className="rounded-2xl border border-white/10 bg-night-3 p-8 md:p-10">
          {sent ? (
            <div role="status" className="flex h-full flex-col items-center justify-center py-12 text-center">
              <p className="font-display text-3xl font-extrabold text-white">Request received.</p>
              <p className="mt-4 max-w-sm text-white/60">
                Thanks — we&apos;ll get back to you fast. Need help sooner? Call{' '}
                <a href={SITE.phoneHref} className="font-bold text-amber-light underline">
                  {SITE.phone}
                </a>
                .
              </p>
              <p className="mt-6 text-xs uppercase tracking-widest text-white/30">
                Demo site — no message was actually sent
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h3 className="font-display text-2xl font-extrabold text-white">
                Request a Free Estimate
              </h3>
              <div>
                <label htmlFor="name" className={LABEL}>Name</label>
                <input id="name" name="name" type="text" required autoComplete="name" className={FIELD} placeholder="Your name" />
              </div>
              <div>
                <label htmlFor="phone" className={LABEL}>Phone</label>
                <input id="phone" name="phone" type="tel" required autoComplete="tel" className={FIELD} placeholder="(555) 555-5555" />
              </div>
              <div>
                <label htmlFor="email" className={LABEL}>Email</label>
                <input id="email" name="email" type="email" autoComplete="email" className={FIELD} placeholder="you@email.com" />
              </div>
              <div>
                <label htmlFor="service" className={LABEL}>Service Needed</label>
                <select id="service" name="service" required className={`${FIELD} appearance-none`} defaultValue="Repair">
                  {['Panel Upgrade', 'EV Charger', 'Rewiring', 'Lighting', 'Generator / Backup', 'Repair', 'Emergency'].map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="message" className={LABEL}>How can we help?</label>
                <textarea id="message" name="message" rows={4} className={`${FIELD} resize-none`} placeholder="Breaker keeps tripping, outlet stopped working, planning an EV charger…" />
              </div>
              <button
                type="submit"
                className="w-full min-h-[52px] rounded-full bg-amber font-display text-lg font-bold text-night transition-colors hover:bg-amber-light"
              >
                Request My Free Estimate
              </button>
              <p className="text-center text-sm text-white/40">
                We respond fast — usually within the hour during business hours,
                and around the clock for emergencies.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
