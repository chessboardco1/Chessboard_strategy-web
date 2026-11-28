'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { preload } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ChessDiagram } from '@/components/ChessDiagram';
import { SceneBoundary } from '@/components/three/SceneBoundary';
import { GROWTH_BOARD_MODEL } from '@/components/three/models';
import { pieces } from '@/lib/content';
import { useCanRender3D, useInView } from '@/components/three/visibility';
import { ScrollTrigger, useGSAP, prefersReducedMotion } from '@/lib/gsap';

const BoardScene = dynamic(() => import('@/components/three/BoardScene'), { ssr: false });
const ease = [0.22, 1, 0.36, 1] as const;
const order = pieces.map((p) => p.type);
const boardPosition = 'Ke1 Qd1 Ra1 Bc1 Nb1 Pd2 ra8 nb8 bc8 qd8 ke8 bf8 ng8 rh8 pa7 pb7 pc7 pd7 pe7 pf7 pg7 ph7';
const pieceSquares = ['e1', 'd1', 'a1', 'c1', 'b1', 'd2'];

/** Pinned scene: the six pieces are set on the board one by one as you scroll. */
export function Growth() {
  const section = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const [active, setActive] = useState(0);
  const can3D = useCanRender3D();
  const approaching = useInView(section, '1400px 0px');
  const visible = useInView(section, '0px');
  const [mounted, setMounted] = useState(false);
  const [boardReady, setBoardReady] = useState(false);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(preference.matches);
    update();
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!approaching || !can3D || reduced) return;
    preload(GROWTH_BOARD_MODEL, { as: 'fetch', crossOrigin: 'anonymous', fetchPriority: 'low' });
    setMounted(true);
  }, [approaching, can3D, reduced]);

  useGSAP(
    () => {
      if (reduced || prefersReducedMotion()) return;
      ScrollTrigger.create({
        trigger: section.current,
        start: 'top top',
        end: () => `+=${window.innerHeight * 5}`,
        pin: true,
        scrub: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          progress.current = self.progress;
          const i = Math.min(pieces.length - 1, Math.floor(self.progress * (pieces.length + 0.6)));
          setActive((a) => (a === i ? a : i));
        },
      });
    },
    { scope: section, dependencies: [reduced], revertOnUpdate: true },
  );

  const piece = pieces[active];

  if (reduced) {
    return (
      <section data-tone="dark" aria-labelledby="growth-title" className="section-y bg-ebony text-chalk">
        <div className="wrap">
          <div className="grid items-center gap-8 sm:grid-cols-2">
            <h2 id="growth-title" className="display t-l">Six pieces, one system</h2>
            <ChessDiagram position={boardPosition} highlight={[pieceSquares[0]]} tone="dark" className="max-w-72 border border-chalk/15 sm:justify-self-end" />
          </div>
          <ol className="mt-12 grid gap-10 md:grid-cols-2">
            {pieces.map((p) => (
              <li key={p.type}><span className="text-chalk-3">{p.name}</span><p className="display t-m mt-2">{p.title}</p><p className="mt-2 text-chalk-2">{p.text}</p></li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  // Phones and portrait tablets: the board fills the upper part of the screen and the text sits in a solid card below it.
  // From 1024 px (and on landscape tablets) the board fills the section and the text is laid over its left side.
  return (
    <section ref={section} data-tone="dark" aria-labelledby="growth-title" className="relative flex h-[100svh] flex-col overflow-hidden bg-ebony text-chalk lg:block md:landscape:block">
      <div aria-hidden="true" className="relative min-h-0 flex-1 lg:absolute md:landscape:absolute lg:inset-0 md:landscape:inset-0">
        <div data-growth-preview className={`absolute inset-x-0 bottom-4 top-24 grid place-items-center transition-opacity duration-300 md:landscape:inset-y-0 md:landscape:left-[39%] lg:inset-y-0 lg:left-[39%] ${boardReady ? 'opacity-0' : 'opacity-100'}`}>
          <ChessDiagram position={boardPosition} highlight={[pieceSquares[active]]} tone="dark" className="h-full max-h-[min(100%,58svh)] max-w-[78%] drop-shadow-[0_20px_36px_#0008]" />
        </div>
        <div className={`absolute inset-0 transition-opacity duration-300 ease-out ${boardReady ? 'opacity-100' : 'opacity-0'}`}>
          {can3D && mounted && (
            <SceneBoundary onError={() => setBoardReady(false)}>
              <BoardScene progress={progress} order={order} active={visible} onReady={() => setBoardReady(true)} />
            </SceneBoundary>
          )}
        </div>
      </div>
      <div className="wrap pointer-events-none absolute inset-x-0 top-0 z-10 pt-[84px] lg:pt-[120px] md:landscape:pt-[120px]">
        <h2 id="growth-title" className="display text-[clamp(30px,8.4vw,40px)] leading-[1.05] lg:max-w-[9ch] md:landscape:max-w-[9ch] lg:text-[clamp(36px,4.4vw,68px)] md:landscape:text-[clamp(36px,4.4vw,68px)]">Six pieces, one system</h2>
        <p className="mt-5 hidden max-w-[24rem] text-chalk-2 lg:block md:landscape:block">Every piece on the board has a job. So does every part of your growth, and none of them wins alone</p>
      </div>
      <div className="relative z-10 border-t border-chalk/10 bg-ebony-2 lg:absolute md:landscape:absolute lg:inset-x-0 md:landscape:inset-x-0 lg:bottom-0 md:landscape:bottom-0 lg:border-0 md:landscape:border-0 lg:bg-transparent md:landscape:bg-transparent">
        <div className="wrap pb-7 pt-6 lg:pb-16 md:landscape:pb-16 lg:pt-0 md:landscape:pt-0">
          <div className="max-w-[30rem]">
            <div className="mb-5 flex gap-2 lg:mb-8 md:landscape:mb-8" aria-hidden="true">
              {pieces.map((p, i) => (
                <span key={p.type} className={`block size-2.5 transition-colors duration-500 ${i === active ? 'bg-move' : i < active ? 'bg-chalk' : 'bg-chalk/15'}`} />
              ))}
            </div>
            <div className="relative min-h-[178px] lg:min-h-[210px] md:landscape:min-h-[210px]" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.div key={piece.type} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.55, ease }}>
                  <p className="text-[15px] text-chalk-3">{piece.name}</p>
                  <p className="display mt-2 text-[clamp(32px,4.6vw,72px)] leading-none">{piece.title}</p>
                  <p className="mt-3 text-[16px] leading-relaxed text-chalk-2 lg:mt-5 md:landscape:mt-5 lg:text-[18px] md:landscape:text-[18px]">{piece.text}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
