'use client';

import dynamic from 'next/dynamic';
import { useRef } from 'react';
import { useCanRender3D, useInView } from '@/components/three/shared';
import { ScrollTrigger, useGSAP } from '@/lib/gsap';
import type { PieceType } from '@/lib/content';

const PieceScene = dynamic(() => import('@/components/three/PieceScene'), { ssr: false });

/** A 3D chess piece in a box; it turns as the box scrolls through the viewport. */
export function PieceStage({ type, tone = 'ebony', className }: { type: PieceType; tone?: 'ebony' | 'boxwood'; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const can3D = useCanRender3D();
  const near = useInView(box, '300px');
  useGSAP(
    () => {
      ScrollTrigger.create({ trigger: box.current, start: 'top bottom', end: 'bottom top', onUpdate: (s) => (progress.current = s.progress) });
    },
    { scope: box },
  );
  return (
    <div ref={box} className={className}>
      {can3D && near && <PieceScene type={type} tone={tone} progress={progress} />}
    </div>
  );
}
