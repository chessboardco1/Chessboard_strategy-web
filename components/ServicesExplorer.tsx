'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { TLink } from '@/components/motion/BoardTransition';
import { PieceStage } from '@/components/PieceStage';
import { pieces, services } from '@/lib/content';

/** Services list beside a sticky 3D piece. Pointing at a service sets its piece on the stand. */
export function ServicesExplorer() {
  const [active, setActive] = useState(0);
  const svc = services[active];
  const piece = pieces.find((p) => p.type === svc.piece)!;
  return (
    <div className="grid gap-12 lg:grid-cols-12">
      <ul className="lg:col-span-7">
        {services.map((s, i) => {
          const on = active === i;
          return (
            <li key={s.slug} className="border-t border-ink/10 last:border-b">
              <TLink
                href={`/services/${s.slug}`}
                onPointerEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className="grid grid-cols-[28px_1fr] items-start gap-x-4 py-9 md:py-11"
              >
                <span className="relative mt-[0.45em] block size-3.5">
                  {on && <motion.span layoutId="explorer-move" className="absolute inset-0 bg-move" transition={{ type: 'spring', stiffness: 420, damping: 36 }} />}
                </span>
                <span>
                  <span className={`display block text-[clamp(32px,3.8vw,56px)] leading-[1.05] transition-colors duration-500 ${on ? 'text-ebony' : 'text-ink/40'}`}>{s.name}</span>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.span
                        className="block overflow-hidden"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <span className="block max-w-[34rem] pt-4 text-[17px] text-ink-2">{s.intro}</span>
                        <span className="link-line mt-5 inline-block font-medium text-ebony">How we run it</span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              </TLink>
            </li>
          );
        })}
      </ul>
      <div className="hidden lg:col-span-5 lg:block">
        <div className="sticky top-28">
          <div className="relative aspect-[4/5] bg-ebony">
            <PieceStage type={svc.piece} tone="boxwood" className="absolute inset-0" />
            <div className="absolute inset-x-0 bottom-0 flex items-baseline justify-between p-6 text-chalk">
              <AnimatePresence mode="wait">
                <motion.span key={piece.type} className="display text-[28px]" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>
                  {piece.name}, {piece.title.toLowerCase()}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
