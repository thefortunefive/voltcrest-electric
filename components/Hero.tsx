'use client';

/**
 * HERO — two-layer scroll-scrubbed blackout-to-glow sequence.
 *
 * Layer 1 (idle): hero-idle.mp4 — 9.67s direct-wrap loop cut from the
 *   flashlight-wandering phase (endpoints measured at 52.5 dB PSNR, i.e.
 *   more similar than ordinary consecutive frames). Autoplays at scroll-0.
 *   NOT scrubbed.
 * Layer 2 (scrub): hero-web.mp4 / hero-mobile.mp4 — 42.3s continuous master
 *   starting on a dark between-beam frame (same darkness as the idle loop,
 *   so the first-scroll cross-fade is dark-into-dark). Scroll drives
 *   currentTime: flashlights → darkest → first warm windows → full glow.
 *
 * Seek architecture (ported from the fifth-ave-ai elevator hero):
 *   ScrollTrigger.onUpdate → writes targetProgress only
 *   RAF loop → seeks when decoder idle + diff > threshold + range seekable
 *   seeked → clears lock, records rendered progress for catch-up
 *   Mobile: decoder priming on first touch, 854px asset, native scroll.
 *
 * Debug overlay: append ?debugHero=1 to the URL.
 */

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getLenis } from '@/lib/lenis';
import { SITE } from '@/lib/site-config';

gsap.registerPlugin(ScrollTrigger);

const IDLE_THRESHOLD = 0.005;

/**
 * BEATS — mapped to the trimmed scrub master (42.3s, source 15.375s→57.7s):
 *   0–34%    flashlight beams wandering the dark house
 *   34–49%   beams fade — the house at its darkest
 *   49–65%   first warm windows light up
 *   65–100%  the glow spreads until the whole house is lit (kept text-free
 *            from 88% so the payoff reads clean before content release)
 */
const BEATS: { start: number; end: number; lines: string[] }[] = [
  { start: 0.0,  end: 0.18, lines: [SITE.name, SITE.tagline] },
  { start: 0.23, end: 0.36, lines: ['When the lights go out…'] },
  { start: 0.40, end: 0.52, lines: ['…a flashlight only gets you so far.'] },
  { start: 0.56, end: 0.68, lines: ['One call. Power restored.'] },
  { start: 0.74, end: 0.88, lines: ['Licensed. Bonded. Bright.'] },
];

function beatOpacity(p: number, start: number, end: number, fade = 0.04): number {
  if (start === 0 && p <= 0) return 1;
  if (p < start || p >= end) return 0;
  const rampIn = start === 0 ? 1 : Math.min(1, (p - start) / fade);
  const rampOut = Math.min(1, (end - p) / fade);
  return Math.min(rampIn, rampOut);
}

/** Phone-class: short side ≤ 600px. Does NOT include iPads with coarse pointer. */
function isPhoneClass(): boolean {
  return typeof screen !== 'undefined' && Math.min(screen.width, screen.height) <= 600;
}

export default function Hero() {
  const sectionRef  = useRef<HTMLElement>(null);
  const scrubRef    = useRef<HTMLVideoElement>(null);
  const idleRef     = useRef<HTMLVideoElement>(null);
  const beatRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const hintRef     = useRef<HTMLDivElement>(null);
  const debugRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const scrubEl = scrubRef.current;
    const idleEl  = idleRef.current;
    if (!section || !scrubEl || !idleEl) return;

    // ── Device detection ────────────────────────────────────────────────────
    const mobile        = isPhoneClass();
    const coarse        = window.matchMedia('(pointer: coarse)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const debugMode     = new URLSearchParams(window.location.search).get('debugHero') === '1';

    ScrollTrigger.config({ ignoreMobileResize: true });

    // ── Select scrub video asset ────────────────────────────────────────────
    const scrubSrc = mobile ? '/hero-mobile.mp4' : '/hero-web.mp4';
    if (!scrubEl.src || !scrubEl.src.endsWith(scrubSrc.replace('/', ''))) {
      scrubEl.src = scrubSrc;
      scrubEl.load();
    }

    // ── Mutable RAF state ───────────────────────────────────────────────────
    let targetProgress   = 0;
    let renderedProgress = -1;
    let isSeeking        = false;
    let parallaxOn       = false;
    let idleActive: boolean | null = null;
    let idlePauseTimer: ReturnType<typeof setTimeout> | undefined;
    let primed           = false;
    let fallbackMode     = reducedMotion;
    let rafId: number | null = null;

    const SEEK_THRESH_S = coarse ? 0.02 : 0.008;

    if (debugMode && debugRef.current) {
      debugRef.current.style.display = 'block';
    }

    const refreshDebug = () => {
      if (!debugMode || !debugRef.current) return;
      const sk  = scrubEl.seekable;
      const end = sk.length > 0 ? sk.end(sk.length - 1) : 0;
      const dur = scrubEl.duration || 0;
      debugRef.current.innerHTML = [
        '<b>HERO DEBUG</b>',
        `Mobile: ${mobile} | Coarse: ${coarse} | ReducedMotion: ${reducedMotion}`,
        `Progress → target: ${targetProgress.toFixed(4)} | rendered: ${renderedProgress.toFixed(4)}`,
        `Video time → target: ${(targetProgress * dur).toFixed(3)}s | currentTime: ${scrubEl.currentTime.toFixed(3)}s`,
        `dur: ${dur.toFixed(3)}s | seeking: ${isSeeking} | readyState: ${scrubEl.readyState}`,
        `seekable end: ${end.toFixed(3)}s | Lenis: ${getLenis() ? 'active' : 'native scroll'}`,
        `Asset: ${scrubSrc} | primed: ${primed} | fallback: ${fallbackMode}`,
      ].join('<br/>');
    };

    // ── Idle management — the handoff ───────────────────────────────────────
    // Both idle endpoints and scrub frame 0 are dark between-beam frames, so
    // this opacity cross-fade is dark-into-dark and reads as nothing at all.
    const setIdle = (on: boolean) => {
      if (idleActive === on) return;
      idleActive = on;
      clearTimeout(idlePauseTimer);
      idleEl.style.opacity = on ? '1' : '0';
      if (on) {
        idleEl.play().catch(() => {});
      } else {
        idlePauseTimer = setTimeout(() => {
          if (!idleActive) idleEl.pause();
        }, 560);
      }
    };

    // Restart the idle loop if a decoder hiccup silently pauses it.
    const onIdleStall = () => {
      if (idleActive) idleEl.play().catch(() => {});
    };
    idleEl.addEventListener('pause', onIdleStall);
    idleEl.addEventListener('ended', onIdleStall);

    const canSeekTo = (t: number): boolean => {
      const dur = scrubEl.duration;
      if (!dur || !isFinite(dur)) return false;
      const sk = scrubEl.seekable;
      if (sk.length === 0) return false;
      return sk.end(sk.length - 1) >= t;
    };

    // ── Text beats + hint ───────────────────────────────────────────────────
    const renderBeats = (p: number) => {
      BEATS.forEach((beat, idx) => {
        const el = beatRefs.current[idx];
        if (!el) return;
        const o = beatOpacity(p, beat.start, beat.end);
        el.style.opacity = o.toFixed(3);
        el.style.visibility = o > 0 ? 'visible' : 'hidden';
        if (parallaxOn) {
          const span  = beat.end - beat.start;
          const local = gsap.utils.clamp(0, 1, (p - beat.start) / Math.max(span, 0.001));
          el.style.transform = `translateY(${(0.5 - local) * 40}px)`;
        } else {
          el.style.transform = 'none';
        }
      });
      if (hintRef.current) {
        hintRef.current.style.opacity = String(Math.max(0, 1 - p / 0.08));
      }
    };

    // ── RAF render loop ─────────────────────────────────────────────────────
    const rafLoop = () => {
      rafId = requestAnimationFrame(rafLoop);

      renderBeats(targetProgress);
      if (debugMode) refreshDebug();

      if (fallbackMode || isSeeking) return;

      const dur = scrubEl.duration;
      if (!dur || !isFinite(dur)) return;

      const progressDiff = Math.abs(targetProgress - renderedProgress);
      if (progressDiff < SEEK_THRESH_S / dur) return;

      const targetTime = Math.min(targetProgress * dur, dur - 0.04);
      if (!canSeekTo(targetTime)) return;

      isSeeking = true;
      scrubEl.currentTime = targetTime;
    };

    const onSeeked = () => {
      isSeeking = false;
      const dur = scrubEl.duration;
      renderedProgress = dur > 0 ? scrubEl.currentTime / dur : 0;
    };
    scrubEl.addEventListener('seeked', onSeeked);

    const onVideoProgress = () => {
      if (isSeeking) return;
      const dur = scrubEl.duration;
      if (!dur || !isFinite(dur)) return;
      const targetTime = Math.min(targetProgress * dur, dur - 0.04);
      if (canSeekTo(targetTime) && Math.abs(scrubEl.currentTime - targetTime) > SEEK_THRESH_S) {
        isSeeking = true;
        scrubEl.currentTime = targetTime;
      }
    };
    scrubEl.addEventListener('progress', onVideoProgress);

    const onScrubError = () => {
      if (mobile && scrubEl.src.includes('hero-mobile')) {
        console.warn('[Hero] hero-mobile.mp4 unavailable, falling back to hero-web.mp4');
        scrubEl.src = '/hero-web.mp4';
        scrubEl.load();
      } else {
        console.error('[Hero] Scrub video failed — entering poster fallback');
        fallbackMode = true;
      }
    };
    scrubEl.addEventListener('error', onScrubError);

    // ── ScrollTrigger: only writes targetProgress ───────────────────────────
    const onScrollUpdate = (p: number) => {
      targetProgress = p;
      setIdle(p <= IDLE_THRESHOLD);
    };

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      invalidateOnRefresh: true,
      onUpdate:  (self) => onScrollUpdate(self.progress),
      onRefresh: (self) => onScrollUpdate(self.progress),
    });

    const mm = gsap.matchMedia();
    mm.add('(min-width: 768px)', () => {
      parallaxOn = true;
      return () => { parallaxOn = false; };
    });

    onScrollUpdate(0);

    // ── Mobile: prime the decoder on first user interaction ─────────────────
    const primeScrub = async () => {
      if (primed || fallbackMode) return;
      try {
        await scrubEl.play();
        scrubEl.pause();
        primed = true;
      } catch {
        console.warn('[Hero] Mobile video prime rejected — entering poster fallback');
        fallbackMode = true;
      }
    };

    if (coarse) {
      document.addEventListener('touchstart',  () => primeScrub(), { passive: true, once: true });
      document.addEventListener('pointerdown', () => primeScrub(), { passive: true, once: true });
    }

    // ── Refresh triggers ────────────────────────────────────────────────────
    const onLoadedMetadata = () => ScrollTrigger.refresh();
    scrubEl.addEventListener('loadedmetadata', onLoadedMetadata);

    const onOrientationChange = () => setTimeout(() => ScrollTrigger.refresh(), 200);
    window.addEventListener('orientationchange', onOrientationChange);

    let lastWidth = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth !== lastWidth) {
        lastWidth = window.innerWidth;
        ScrollTrigger.refresh();
      }
    };
    window.addEventListener('resize', onResize, { passive: true });

    rafId = requestAnimationFrame(rafLoop);

    const t1 = setTimeout(() => ScrollTrigger.refresh(), 300);
    const t2 = setTimeout(() => ScrollTrigger.refresh(), 1000);
    document.fonts?.ready?.then(() => ScrollTrigger.refresh());

    return () => {
      clearTimeout(idlePauseTimer);
      clearTimeout(t1);
      clearTimeout(t2);
      if (rafId !== null) cancelAnimationFrame(rafId);
      idleEl.removeEventListener('pause',            onIdleStall);
      idleEl.removeEventListener('ended',            onIdleStall);
      scrubEl.removeEventListener('seeked',          onSeeked);
      scrubEl.removeEventListener('progress',        onVideoProgress);
      scrubEl.removeEventListener('error',           onScrubError);
      scrubEl.removeEventListener('loadedmetadata',  onLoadedMetadata);
      window.removeEventListener('orientationchange', onOrientationChange);
      window.removeEventListener('resize',            onResize);
      idleEl.pause();
      scrubEl.pause();
      st.kill();
      mm.revert();
    };
  }, []);

  return (
    // 460vh runway for the 42.3s scrub — same feel as the proven 460vh/42.2s sister hero
    <section ref={sectionRef} className="relative h-[460vh] bg-night" aria-label="Intro">
      <div
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{ height: '100svh' }}
      >
        {/* Scrub layer — paused; currentTime driven by RAF loop */}
        <video
          ref={scrubRef}
          src="/hero-web.mp4"
          poster="/hero-poster.jpg"
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Idle layer — flashlight loop at scroll 0; fades out on first scroll */}
        <video
          ref={idleRef}
          src="/hero-idle.mp4"
          poster="/hero-poster.jpg"
          muted
          loop
          autoPlay
          playsInline
          preload="auto"
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out"
          style={{ opacity: 1 }}
        />

        {/* Legibility scrim */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-night/50 via-transparent to-night/70" />

        {/* Bottom fade into the page base */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[28vh]"
          style={{ background: 'linear-gradient(to bottom, rgba(5,11,22,0) 0%, #050B16 92%)' }}
        />

        {/* Text beats */}
        {BEATS.map((beat, idx) => (
          <div
            key={idx}
            ref={(el) => { beatRefs.current[idx] = el; }}
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
            style={{ opacity: 0, visibility: 'hidden', willChange: 'opacity, transform' }}
          >
            {idx === 0 ? (
              <>
                <h1 className="font-display text-5xl font-extrabold leading-tight tracking-tight text-white md:text-7xl lg:text-8xl">
                  {beat.lines[0]}
                </h1>
                <p className="mt-5 max-w-2xl text-lg font-light uppercase tracking-[0.3em] text-amber-light md:text-xl">
                  {beat.lines[1]}
                </p>
              </>
            ) : (
              <p className="font-display max-w-4xl text-4xl font-bold leading-snug text-white md:text-6xl">
                {beat.lines[0]}
              </p>
            )}
          </div>
        ))}

        {/* Scroll hint */}
        <div
          ref={hintRef}
          className="pointer-events-none absolute inset-x-0 bottom-8 flex flex-col items-center gap-3"
        >
          <span className="text-[11px] uppercase tracking-[0.35em] text-white/60">Scroll</span>
          <span className="h-10 w-px animate-pulse bg-gradient-to-b from-amber to-transparent" />
        </div>

        {/* Debug overlay — ?debugHero=1 */}
        <div
          ref={debugRef}
          className="fixed left-2 top-16 z-[200] max-w-xs rounded bg-black/85 p-2 font-mono text-[10px] leading-relaxed text-green-400"
          style={{ display: 'none', pointerEvents: 'none' }}
          aria-hidden
        />
      </div>
    </section>
  );
}
