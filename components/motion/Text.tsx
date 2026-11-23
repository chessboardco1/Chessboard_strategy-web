'use client';

import { useRef, type ElementType, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { gsap, SplitText, useGSAP, prefersReducedMotion } from '@/lib/gsap';

type Props = { as?: ElementType; className?: string; children: ReactNode; id?: string };

/** Lines rise out of a mask when the heading enters the viewport (or on load with `onLoad`). */
export function RevealLines({ as: Tag = 'h2', className, children, id, onLoad = false, delay = 0 }: Props & { onLoad?: boolean; delay?: number }) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (!ref.current || prefersReducedMotion()) return;
      SplitText.create(ref.current, {
        type: 'lines',
        mask: 'lines',
        autoSplit: true,
        linesClass: 'split-line',
        onSplit(self) {
          return gsap.from(self.lines, {
            yPercent: 105,
            duration: 1.25,
            ease: 'expo.out',
            stagger: 0.09,
            delay,
            scrollTrigger: onLoad ? undefined : { trigger: ref.current, start: 'top 88%', once: true },
          });
        },
      });
    },
    { scope: ref },
  );
  return (
    <Tag ref={ref} id={id} className={className}>
      {children}
    </Tag>
  );
}

/** Words go from muted to full colour, tied to scroll position, as you read. */
export function ScrubWords({ as: Tag = 'p', className, children, from = '#4a453e' }: Props & { from?: string }) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (!ref.current || prefersReducedMotion()) return;
      const split = SplitText.create(ref.current, { type: 'words' });
      gsap.from(split.words, {
        color: from,
        ease: 'none',
        stagger: 0.1,
        scrollTrigger: { trigger: ref.current, start: 'top 78%', end: 'bottom 45%', scrub: 0.6 },
      });
      return () => split.revert();
    },
    { scope: ref },
  );
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/** A short fade and rise for blocks of content. */
export function FadeUp({ children, className, delay = 0, as = 'div' }: { children: ReactNode; className?: string; delay?: number; as?: 'div' | 'li' | 'section' | 'figure' | 'p' }) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </Comp>
  );
}

/** Image or video that opens from a narrow slit as it enters, with a slow counter-scale. */
export function ClipReveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (!ref.current || prefersReducedMotion()) return;
      const inner = ref.current.firstElementChild;
      gsap.fromTo(ref.current, { clipPath: 'inset(40% 30% 40% 30%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut', scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true } });
      if (inner) gsap.fromTo(inner, { scale: 1.35 }, { scale: 1, duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true } });
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={`overflow-hidden ${className ?? ''}`}>
      {children}
    </div>
  );
}
