'use client';

import { motion } from 'motion/react';
import { clients } from '@/lib/content';

/** 1 when the square at index i is a dark square in a grid of `cols` columns */
const shade = (i: number, cols: number) => ((Math.floor(i / cols) + (i % cols)) % 2 ? 1 : 0);

/** Equal visual area for every logo: width grows with the square root of its width-to-height ratio */
const logoWidth = (ratio: number) => `${Math.min(70, 26 * Math.sqrt(ratio)).toFixed(1)}%`;

/** Client logos, set out like pieces: each square appears in turn across the grid. */
export function Clients({ title = 'Brands we have played with' }: { title?: string }) {
  return (
    <section data-tone="light" aria-labelledby="clients-title" className="section-y bg-box">
      <div className="wrap">
        <h2 id="clients-title" className="display t-m max-w-[16ch] text-ebony">{title}</h2>
        <motion.ul
          className="logo-grid mt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '0px 0px -15% 0px' }}
          variants={{ show: { transition: { staggerChildren: 0.06 } } }}
        >
          {clients.map((c, i) => (
            <motion.li
              key={c.name}
              data-c2={shade(i, 2)}
              data-c3={shade(i, 3)}
              data-c5={shade(i, 5)}
              className="flex aspect-[5/3] items-center justify-center"
              variants={{ hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } } }}
            >
              <img src={c.logo} alt={c.name} loading="lazy" style={{ width: logoWidth(c.ratio) }} className="h-auto max-h-[62%] object-contain opacity-80 mix-blend-multiply grayscale transition-[filter,opacity] duration-500 hover:opacity-100 hover:grayscale-0" />
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
