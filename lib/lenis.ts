'use client';

import type Lenis from 'lenis';

/**
 * Module-level handle on the single Lenis instance created in SmoothScroll,
 * so any component can drive smooth scrolling without prop-drilling or a
 * window global. Set on mount, cleared on unmount.
 */
let instance: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  instance = l;
};

export const getLenis = () => instance;

/**
 * Smooth-scroll to an element by id using Lenis (falls back to native
 * smooth scrolling if Lenis isn't mounted, e.g. reduced-motion or SSR edge).
 */
export function scrollToId(id: string, offset = 0) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(el, { offset, duration: 1.2 });
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
