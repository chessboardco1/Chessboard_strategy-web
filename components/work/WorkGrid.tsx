'use client';

import { TLink } from '@/components/motion/BoardTransition';
import { ClipReveal } from '@/components/motion/Text';
import { CaseCue } from '@/components/work/CaseCue';
import { Film } from '@/components/work/Film';
import type { Work } from '@/lib/content';

function Card({ w, i, compact }: { w: Work; i: number; compact?: boolean }) {
  // staggered heights give the grid a rhythm instead of equal boxes
  const offset = !compact && i % 2 === 1 ? 'md:mt-40' : '';
  return (
    <TLink
      href={`/work/${w.slug}`}
      className={`group block ${offset}`}
    >
      <ClipReveal className="aspect-[4/5] bg-ebony">
        <div className="relative h-full">
          <Film src={w.video} poster={w.poster} label={`${w.client}: ${w.kind}`} className="h-full w-full object-cover transition-transform duration-[1.4s] ease-[var(--ease-move)] group-hover:scale-[1.04]" />
          <CaseCue />
        </div>
      </ClipReveal>
      <div className="mt-6 flex flex-wrap items-baseline justify-between gap-3">
        <span className="font-medium text-ebony">{w.client}</span>
        <span className="text-[15px] text-ink-3">{w.kind}</span>
      </div>
      {!compact && <p className="display mt-3 max-w-[22ch] text-[clamp(24px,2.2vw,34px)] leading-[1.15] text-ebony transition-colors group-hover:text-move">{w.title}</p>}
    </TLink>
  );
}

export function WorkGrid({ items, compact = false }: { items: Work[]; compact?: boolean }) {
  return (
    <div className={`grid gap-x-[6vw] gap-y-20 ${compact ? 'sm:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2'}`}>
      {items.map((w, i) => (
        <Card key={w.slug} w={w} i={i} compact={compact} />
      ))}
    </div>
  );
}
