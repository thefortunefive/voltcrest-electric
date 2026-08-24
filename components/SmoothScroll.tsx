'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { setLenis } from '@/lib/lenis';

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis smooth scroll wired into GSAP's ticker so ScrollTrigger and Lenis
 * share one clock. All ScrollTriggers in the app rely on this being mounted
 * once at the root.
 *
 * On phone-class devices (short side ≤ 600px) Lenis is disabled so native
 * scroll events drive ScrollTrigger directly. Lenis's lerp=0.1 introduces a
 * lag of ~3–4 frames between finger position and ScrollTrigger progress, which
 * makes video scrubbing appear frozen on mobile. Native scroll has no such lag.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Phone-class detection: short side ≤ 600px, does NOT include iPad
    const phoneClass = Math.min(screen.width, screen.height) <= 600;

    // Disable lag smoothing globally — matters both with and without Lenis
    gsap.ticker.lagSmoothing(0);

    if (phoneClass) {
      // Native scroll: ScrollTrigger listens to window scroll events directly.
      // setLenis(null) so scrollToId falls back to native smooth-scroll.
      setLenis(null);
      // Refresh after all page components have mounted so GSAP trigger positions
      // are calculated with the correct mobile layout (fonts, images, stacking).
      // Without this, deep-page elements like a second portfolio card can have
      // stale trigger offsets and never animate in.
      const id = setTimeout(() => ScrollTrigger.refresh(), 200);
      return () => clearTimeout(id);
    }

    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
    });

    lenis.on('scroll', ScrollTrigger.update);
    setLenis(lenis);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);

    return () => {
      gsap.ticker.remove(raf);
      setLenis(null);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
