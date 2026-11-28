'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { TLink } from '@/components/motion/BoardTransition';
import { ChessDiagram } from '@/components/ChessDiagram';
import { diagrams, readingMinutes, type Insight } from '@/lib/content';

/**
 * Plays the note's move while the link is hovered or focused. On touch screens, where there is no
 * hover, it plays once when the note scrolls into view.
 */
function usePlay() {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduced = useReducedMotion();
  const [hover, setHover] = useState(false);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || !window.matchMedia('(hover: none)').matches) return;
    let start: number | undefined;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        start = window.setTimeout(() => setSeen(true), 500);
        io.disconnect();
      }
    }, { threshold: 0.6 });
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(start);
    };
  }, [reduced]);
  const bind = {
    ref,
    onPointerEnter: () => setHover(true),
    onPointerLeave: () => setHover(false),
    onFocus: () => setHover(true),
    onBlur: () => setHover(false),
  };
  return { play: !reduced && (hover || seen), bind, reduced };
}

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '0px 0px -10% 0px' },
};
const ease = [0.22, 1, 0.36, 1] as const;

function Featured({ post }: { post: Insight }) {
  const d = diagrams[post.slug];
  const { play, bind, reduced } = usePlay();
  return (
    <motion.div {...reveal} initial={reduced ? false : reveal.initial} transition={{ duration: 0.9, ease }} className="lg:col-span-7">
      <TLink href={`/insights/${post.slug}`} {...bind} className="group grid gap-8 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:grid-cols-1 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] xl:items-end">
        {d && <ChessDiagram position={d.position} moves={d.moves} play={play} className="max-w-[560px] border border-ink/10" />}
        <div>
          <p className="text-[15px] text-ink-3">{post.category}, {readingMinutes(post)} min read</p>
          <h3 className="display mt-4 text-[clamp(30px,3vw,48px)] leading-[1.06] text-ebony">{post.title}</h3>
          <p className="mt-4 max-w-[30rem] text-ink-2">{post.summary}</p>
          {d && <p className="mt-6 flex items-center gap-3 text-[15px] text-ink-2"><span aria-hidden="true" className="block size-2 bg-move" />{d.caption}</p>}
        </div>
      </TLink>
    </motion.div>
  );
}

function Small({ post, i }: { post: Insight; i: number }) {
  const d = diagrams[post.slug];
  const { play, bind, reduced } = usePlay();
  return (
    <motion.li {...reveal} initial={reduced ? false : reveal.initial} transition={{ duration: 0.9, ease, delay: 0.1 + i * 0.08 }} className="border-t border-ink/10 first:border-t-0 lg:first:border-t">
      <TLink href={`/insights/${post.slug}`} {...bind} className="group grid grid-cols-[96px_minmax(0,1fr)] gap-5 py-8 sm:grid-cols-[136px_minmax(0,1fr)] sm:gap-7">
        {d ? <ChessDiagram position={d.position} moves={d.moves} play={play} className="border border-ink/10" /> : <span />}
        <div>
          <p className="text-[14px] text-ink-3">{post.category}, {readingMinutes(post)} min read</p>
          <h3 className="display mt-2 text-[clamp(22px,1.8vw,28px)] leading-[1.12] text-ebony transition-colors duration-300 group-hover:text-move">{post.title}</h3>
          {d && <p className="mt-3 hidden text-[15px] text-ink-2 sm:block">{d.caption}</p>}
        </div>
      </TLink>
    </motion.li>
  );
}

/** Notes from the board: one featured note with a large position diagram, and two smaller ones. */
export function HomeNotes({ posts }: { posts: Insight[] }) {
  const [first, ...rest] = posts;
  if (!first) return null;
  return (
    <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
      <Featured post={first} />
      <ul className="flex flex-col lg:col-span-5 lg:col-start-8">
        {rest.slice(0, 2).map((p, i) => <Small key={p.slug} post={p} i={i} />)}
      </ul>
    </div>
  );
}
