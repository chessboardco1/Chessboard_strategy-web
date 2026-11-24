'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { TLink } from '@/components/motion/BoardTransition';
import { SceneBoundary } from '@/components/three/SceneBoundary';
import { useCanRender3D, useInView } from '@/components/three/shared';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';

const KnightsScene = dynamic(() => import('@/components/three/KnightsScene'), { ssr: false });

export function Hero() {
  const section = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const can3D = useCanRender3D();
  const nearby = useInView(section, '120px 0px');
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: no-preference)');
    const update = () => setMotionAllowed(motion.matches);
    update();
    motion.addEventListener('change', update);
    return () => motion.removeEventListener('change', update);
  }, []);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      ScrollTrigger.create({
        trigger: section.current,
        start: 'top top',
        end: 'bottom top',
        onUpdate: (self) => (progress.current = self.progress),
      });
    });
    return () => media.revert();
  }, { scope: section });

  const showScene = can3D && motionAllowed;
  const sceneReady = showScene && ready;

  return (
    <section
      ref={section}
      data-tone="light"
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-box lg:min-h-[max(600px,100svh)] md:landscape:min-h-[max(580px,100svh)]"
    >
      <div className="wrap relative z-10 pt-28 lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:py-28 md:landscape:flex md:landscape:flex-1 md:landscape:flex-col md:landscape:justify-center md:landscape:py-28">
        <div className="lg:max-w-[53%] md:landscape:max-w-[54%]">
          <h1 className="hero-enter display max-w-[13ch] text-balance text-[clamp(34px,10.5vw,68px)] leading-[0.98] text-ebony md:landscape:text-[clamp(48px,6.2vw,124px)] lg:text-[clamp(54px,6.5vw,124px)]">
            Growth, planned like a game of chess
          </h1>
          <p className="hero-enter mt-6 max-w-[31rem] text-pretty text-base leading-relaxed text-ink-2 [--hero-delay:90ms] md:text-lg lg:text-xl">
            Marketing, advertising, your website and sales follow-up, played as one connected game, so every move sets up the next.
          </p>
          <div className="hero-enter mt-8 flex flex-wrap items-center gap-x-6 gap-y-4 [--hero-delay:180ms]">
            <TLink href="/contact" className="btn-move btn-dark max-md:btn-compact">
              <span className="sq" aria-hidden="true" />
              <span className="relative">Get in touch</span>
            </TLink>
            <TLink href="/work" className="link-line font-medium">See our work</TLink>
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="relative min-h-[285px] flex-1 lg:absolute lg:inset-y-0 lg:right-0 lg:w-[48%] md:landscape:absolute md:landscape:inset-y-0 md:landscape:right-0 md:landscape:w-[46%]">
        <div className="pointer-events-none absolute left-1/2 top-1/2 aspect-[766/940] w-[min(115%,380px)] -translate-x-1/2 -translate-y-1/2 md:landscape:w-[min(115%,94svh)] lg:w-[min(115%,94svh)]">
          {/* The still uses the same camera crop as the first WebGL frame. */}
          <img src="/brand/knights-preview.webp" alt="" width={728} height={729} fetchPriority="high" className="absolute left-[12%] top-[20%] h-[62%] w-[76%]" />
          {showScene && (
            <div className={`absolute inset-0 bg-box ${sceneReady ? 'opacity-100 transition-opacity duration-200' : 'opacity-0'}`}>
              <SceneBoundary onError={() => setReady(false)}>
                <KnightsScene progress={progress} running={nearby} onReadyChange={setReady} />
              </SceneBoundary>
            </div>
          )}
        </div>
      </div>

      <p className="hero-enter wrap pointer-events-none absolute inset-x-0 bottom-6 hidden items-center gap-3 text-[13px] text-ink-3 [--hero-delay:240ms] lg:flex md:landscape:flex [@media(max-height:700px)]:hidden">
        <span aria-hidden="true" className="block h-px w-8 bg-ink-3" />
        Based in Surat, working with brands across India and abroad
      </p>
    </section>
  );
}
