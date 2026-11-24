'use client';

import { useRef, type CSSProperties } from 'react';
import { TLink } from '@/components/motion/BoardTransition';
import { CaseCue } from '@/components/work/CaseCue';
import { Film } from '@/components/work/Film';
import { work, type Work } from '@/lib/content';
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap';

// Every tile is one height, worked out from the screen: the full height less the header, the caption
// and the margins. Width follows from the 9:14 films. Phones use a fixed width instead.
const TILE = 'w-[74vw] max-w-[340px] md:w-[calc(var(--tile-h)*9/14)] md:max-w-none';
const FRAME = 'relative aspect-[9/14] overflow-hidden md:aspect-auto md:h-[var(--tile-h)]';

function Tile({ w }: { w: Work }) {
  return (
    <TLink
      href={`/work/${w.slug}`}
      data-tile
      className={`group flex shrink-0 snap-start flex-col gap-4 ${TILE}`}
    >
      <div className={`${FRAME} bg-ebony`}>
        <Film src={w.video} poster={w.poster} label={`${w.client}: ${w.kind}`} className="h-full w-full object-cover transition-transform duration-[1.4s] ease-[var(--ease-move)] group-hover:scale-[1.04]" />
        <CaseCue />
      </div>
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-medium">{w.client}</span>
        <span className="text-[15px] text-ink-2">{w.kind}</span>
      </div>
    </TLink>
  );
}

/** The last card: same size as the films, so the reel ends on it with nothing after. */
function EndCard() {
  return (
    <TLink href="/work" data-tile className={`group flex shrink-0 snap-start flex-col gap-4 ${TILE}`}>
      <div className={`${FRAME} flex flex-col justify-between bg-ebony p-7 text-chalk`}>
        <span aria-hidden="true" className="relative block h-3">
          <span className="absolute left-0 top-0 block size-3 bg-move transition-[left] duration-700 ease-[var(--ease-move)] group-hover:left-[calc(100%-12px)]" />
        </span>
        <span className="display text-[clamp(34px,3.2vw,56px)] leading-[1.02]">See every case</span>
      </div>
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-medium">All projects</span>
        <span className="text-[15px] text-ink-2">{work.length} films and campaigns</span>
      </div>
    </TLink>
  );
}

function Intro({ className = '', id }: { className?: string; id?: string }) {
  return (
    <div className={className}>
      <h2 id={id} className="display t-xl text-ebony">Selected work</h2>
      <p className="lede mt-6 max-w-[26rem] text-ink-2">Films, campaigns and launches made for the brands we plan with</p>
      <TLink href="/work" className="link-line mt-8 inline-block font-medium">All projects</TLink>
    </div>
  );
}

/** Pinned horizontal reel of case films from 768 px; a swipe carousel that snaps on phones. */
export function WorkReel() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const mm = gsap.matchMedia();
      mm.add('(min-width: 768px)', () => {
        const el = track.current!;
        // the track ends at the last card plus the page margin, so the reel stops on that card
        const distance = () => Math.max(0, el.scrollWidth - window.innerWidth);
        gsap.to(el, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: { trigger: section.current, start: 'top top', end: () => `+=${distance()}`, pin: true, scrub: 0.8, invalidateOnRefresh: true },
        });
        gsap.from('[data-tile]', { opacity: 0, y: 60, stagger: 0.1, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: section.current, start: 'top 70%', once: true } });
      });
      return () => mm.revert();
    },
    { scope: section },
  );

  return (
    <section
      ref={section}
      id="work"
      data-tone="light"
      aria-labelledby="work-title"
      style={{ '--tile-h': 'clamp(300px, calc(100svh - 250px), 720px)' } as CSSProperties}
      className="section-y relative overflow-hidden bg-box md:flex md:h-[100svh] md:items-center md:pb-0 md:pt-16"
    >
      <Intro id="work-title" className="wrap md:hidden" />
      <div
        ref={track}
        className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-[clamp(20px,4vw,64px)] pb-2 [scroll-padding-inline:clamp(20px,4vw,64px)] [scrollbar-width:none] md:mt-0 md:snap-none md:items-center md:gap-[4vw] md:overflow-visible md:pb-0 [&::-webkit-scrollbar]:hidden"
      >
        {/* the same intro inside the reel from 768 px; the phone copy above carries the id */}
        <Intro className="hidden w-[30vw] shrink-0 md:block" />
        {work.map((w) => (
          <Tile key={w.slug} w={w} />
        ))}
        <EndCard />
      </div>
    </section>
  );
}
