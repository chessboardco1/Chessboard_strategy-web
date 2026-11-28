'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { TLink } from '@/components/motion/BoardTransition';
import { RevealLines } from '@/components/motion/Text';
import { SceneBoundary } from '@/components/three/SceneBoundary';
import { useCanRender3D, useInView } from '@/components/three/visibility';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { team, type PieceType } from '@/lib/content';

const TeamBoardScene = dynamic(() => import('@/components/three/TeamBoardScene'), { ssr: false });
const symbols: Record<PieceType, string> = {
  king: '♚',
  queen: '♛',
  rook: '♜',
  bishop: '♝',
  knight: '♞',
  pawn: '♟',
};

export function TeamBoard() {
  const board = useRef<HTMLDivElement>(null);
  const progress = useRef(0.62);
  const [active, setActive] = useState<number | null>(0);
  const can3D = useCanRender3D();
  const near = useInView(board, '180px 0px');
  const [mounted, setMounted] = useState(false);
  const [wide, setWide] = useState(false);
  const [failed, setFailed] = useState(false);
  const showBoard = wide && can3D === true && !failed;

  useEffect(() => { if (near) setMounted(true); }, [near]);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 64rem)');
    const update = () => setWide(desktop.matches);
    update();
    desktop.addEventListener('change', update);
    return () => desktop.removeEventListener('change', update);
  }, []);
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(min-width: 64rem) and (prefers-reduced-motion: no-preference)', () => {
      ScrollTrigger.create({
        trigger: board.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => (progress.current = self.progress),
      });
      return () => { progress.current = 0.62; };
    });
    return () => media.revert();
  }, { scope: board, dependencies: [showBoard], revertOnUpdate: true });

  return (
    <section data-tone="dark" aria-labelledby="team-title" className="section-y bg-ebony text-chalk">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <RevealLines id="team-title" className="display t-l">The board room</RevealLines>
            <p className="lede mt-5 max-w-[30rem] text-chalk-2">Meet the studio and see what each role brings to the board.</p>
          </div>
          <TLink href="/about" className="link-line font-medium">About the studio</TLink>
        </div>

        <div className={`mt-10 grid items-start gap-8 lg:mt-12 ${showBoard ? 'lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]' : ''}`}>
          <div ref={board} aria-hidden="true" className={`relative aspect-[4/3] overflow-hidden border border-chalk/10 bg-[#0b0b0b] ${showBoard ? 'hidden lg:block' : 'hidden'}`}>
            {showBoard && mounted && (
              <SceneBoundary onError={() => setFailed(true)}>
                <TeamBoardScene progress={progress} team={team} active={active} onPick={setActive} running={near} />
              </SceneBoundary>
            )}
          </div>

          <ul className="divide-y divide-chalk/15 border-y border-chalk/15">
            {team.map((item, i) => {
              const selected = active === i;
              const detailId = `team-role-${item.square}`;

              return (
                <li key={item.square} className={selected ? 'bg-chalk/[0.04]' : undefined}>
                  <button
                    type="button"
                    aria-expanded={selected}
                    aria-controls={detailId}
                    onClick={() => setActive((current) => current === i ? null : i)}
                    className="group grid min-h-16 w-full grid-cols-[40px_minmax(0,1fr)_16px] items-center gap-3 px-3 py-3 text-left sm:px-4"
                  >
                    <span aria-hidden="true" className={`grid size-10 place-items-center font-serif text-[24px] leading-none transition-colors ${selected ? 'bg-move text-ebony' : 'bg-chalk/10 text-chalk group-hover:bg-chalk/20'}`}>{symbols[item.piece]}</span>
                    <span className="min-w-0">
                      {item.name && <span className="block font-medium text-chalk">{item.name}</span>}
                      <span className={item.name ? 'block text-[14px] text-chalk-2' : 'block font-medium text-chalk'}>{item.role}</span>
                    </span>
                    <span aria-hidden="true" className="text-center text-lg text-chalk-2">{selected ? '−' : '+'}</span>
                  </button>
                  <p id={detailId} hidden={!selected} className="pb-4 pl-[64px] pr-5 text-[15px] leading-relaxed text-chalk-2 sm:pl-[68px]">
                    {item.line}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
