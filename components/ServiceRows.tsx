'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { TLink } from '@/components/motion/BoardTransition';
import { services } from '@/lib/content';

/** The six services as large rows. One purple square slides to whichever row you point at. */
export function ServiceRows() {
  const [hover, setHover] = useState<number | null>(null);
  return (
    <ul className="flex flex-col" onPointerLeave={() => setHover(null)}>
      {services.map((s, i) => {
        const on = hover === i;
        return (
          <motion.li
            key={s.slug}
            className="border-t border-chalk/10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: i * 0.06 }}
          >
            <TLink
              href={`/services/${s.slug}`}
              onPointerEnter={() => setHover(i)}
              onFocus={() => setHover(i)}
              className="grid grid-cols-1 items-center gap-x-4 gap-y-2 py-6 md:grid-cols-[32px_minmax(0,1fr)_minmax(0,320px)] md:py-7"
            >
              <span className="relative hidden size-3 md:block">
                {on && <motion.span layoutId="svc-move-dark" className="absolute inset-0 bg-move" transition={{ type: 'spring', stiffness: 420, damping: 36 }} />}
              </span>
              <span
                className={`display text-[clamp(26px,calc(1.3vw+20px),44px)] leading-[1.1] transition-[color,transform] duration-500 ease-[var(--ease-move)] ${on ? 'translate-x-2' : ''} ${
                  hover === null || on ? 'text-chalk' : 'text-chalk/35'
                }`}
              >
                {s.name}
              </span>
              <span className="text-[15px] text-chalk-2 md:col-start-3">{s.line}</span>
            </TLink>
          </motion.li>
        );
      })}
    </ul>
  );
}
