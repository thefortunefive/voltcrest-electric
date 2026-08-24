'use client';

import { useEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * SHARED ANIMATION SPEC — defined once, reused everywhere.
 * Fade-up 30px, 0.8s, power2.out, stagger 0.15s, triggered when the
 * element enters the bottom 20% of the viewport.
 */
export const FADE_UP = {
  y: 30,
  duration: 0.8,
  ease: 'power2.out',
  stagger: 0.15,
  start: 'top 80%', // 20% of viewport
} as const;

/**
 * Hook: animates every `[data-reveal]` descendant of `scope` with the shared
 * fade-up spec. Elements sharing the same `data-reveal-group` value stagger
 * together and trigger off the first element in the group; ungrouped elements
 * trigger individually.
 */
export function useFadeUp(scope: RefObject<HTMLElement>) {
  useEffect(() => {
    const el = scope.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const all = Array.from(el.querySelectorAll<HTMLElement>('[data-reveal]'));
      const groups = new Map<string, HTMLElement[]>();
      const singles: HTMLElement[] = [];

      for (const node of all) {
        const g = node.dataset.revealGroup;
        if (g) {
          if (!groups.has(g)) groups.set(g, []);
          groups.get(g)!.push(node);
        } else {
          singles.push(node);
        }
      }

      const animate = (targets: HTMLElement[], trigger: HTMLElement) =>
        gsap.from(targets, {
          y: FADE_UP.y,
          opacity: 0,
          duration: FADE_UP.duration,
          ease: FADE_UP.ease,
          stagger: FADE_UP.stagger,
          scrollTrigger: {
            trigger,
            start: FADE_UP.start,
            toggleActions: 'play none none none',
          },
        });

      singles.forEach((node) => animate([node], node));
      groups.forEach((nodes) => animate(nodes, nodes[0]));
    }, el);

    return () => ctx.revert();
  }, [scope]);
}
