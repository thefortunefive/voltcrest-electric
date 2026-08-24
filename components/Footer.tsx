import { SITE } from '@/lib/site-config';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-night px-4 py-14 md:px-6">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 32 32" aria-hidden="true">
              <path d="M18 3 L8 18 L14.5 18 L12.5 29 L24 13 L17 13 Z" fill="#C58935" stroke="#E2A94F" strokeWidth="1" strokeLinejoin="round" />
            </svg>
            <span className="font-display text-lg font-bold text-white">{SITE.legalName}</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">
            {SITE.tagline}. {SITE.license}.
          </p>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-amber">Hours</h3>
          <ul className="mt-4 space-y-2 text-sm text-white/60">
            <li>{SITE.hours.weekday}</li>
            <li>{SITE.hours.saturday}</li>
            <li className="text-amber-light">{SITE.hours.emergency}</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-amber">Contact</h3>
          <ul className="mt-4 space-y-2 text-sm text-white/60">
            <li>
              <a href={SITE.phoneHref} className="flex min-h-[44px] items-center transition-colors hover:text-amber-light">
                {SITE.phone}
              </a>
            </li>
            <li>{SITE.serviceArea.headline}</li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl flex-col gap-4 border-t border-white/10 pt-6 text-center md:flex-row md:items-center md:justify-between md:text-left">
        <p className="text-xs uppercase tracking-[0.2em] text-white/30">
          &copy; {new Date().getFullYear()} {SITE.legalName} · Demo site — fictional business
        </p>
        <a
          href={SITE.credit.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[44px] items-center justify-center text-xs text-white/40 transition-colors hover:text-amber-light md:justify-end"
        >
          {SITE.credit.text}
        </a>
      </div>
    </footer>
  );
}
