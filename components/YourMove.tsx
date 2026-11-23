'use client';

import { motion, useReducedMotion } from 'motion/react';
import { TLink } from '@/components/motion/BoardTransition';
import { site } from '@/lib/content';

/** Closing section on every page. The purple square makes a knight's move into place. */
export function YourMove({ line = 'Tell us where the business stands today. We will map the next moves with you' }: { line?: string }) {
  const reduced = useReducedMotion();
  return (
    <section data-tone="dark" aria-labelledby="your-move" className="overflow-hidden bg-ebony text-chalk">
      <div className="wrap pb-16 pt-[clamp(72px,10vw,128px)]">
        <h2 id="your-move" className="display flex items-end gap-[0.12em] text-[clamp(88px,17vw,280px)] leading-[0.9]">
          <motion.span
            initial={reduced ? false : { y: '40%', opacity: 0 }}
            whileInView={{ y: '0%', opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            Your move
          </motion.span>
          <motion.span
            aria-hidden="true"
            className="mb-[0.12em] block size-[0.26em] shrink-0 bg-move"
            initial={reduced ? false : { x: '100%', y: '-200%', opacity: 0 }}
            whileInView={reduced
              ? { x: '0%', y: '0%', opacity: 1 }
              : { x: ['100%', '100%', '100%', '0%'], y: ['-200%', '0%', '0%', '0%'], opacity: [0, 1, 1, 1] }}
            viewport={{ once: true }}
            transition={reduced ? { duration: 0 } : { duration: 0.85, times: [0, 0.55, 0.68, 1], ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
          />
        </h2>
        <div className="mt-14 flex flex-wrap items-end justify-between gap-10">
          <p className="lede max-w-[30rem] text-chalk-2">{line}</p>
          <div className="flex flex-wrap items-center gap-8">
            <TLink href="/contact" className="btn-move btn-light">
              <span className="sq" aria-hidden="true" />
              <span className="relative">Book a strategy call</span>
            </TLink>
            <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="link-line font-medium">Message on WhatsApp</a>
          </div>
        </div>
      </div>
    </section>
  );
}
