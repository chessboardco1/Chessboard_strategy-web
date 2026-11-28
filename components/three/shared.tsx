'use client';

import * as THREE from 'three';
import { Environment, Lightformer } from '@react-three/drei';
import { useEffect, useRef } from 'react';

/** Studio light built from soft panels: one warm key, a cool rim, a low fill. No HDRI file. */
export function Studio({ intensity = 1, warm = '#fff0dc' }: { intensity?: number; warm?: string }) {
  return (
    <Environment resolution={256} frames={1}>
      <Lightformer form="rect" intensity={3.2 * intensity} color={warm} position={[-5, 4, 3]} scale={[4, 6, 1]} target={[0, 0, 0]} />
      <Lightformer form="rect" intensity={1.6 * intensity} color="#dfe6ff" position={[5, 3, -4]} scale={[2, 8, 1]} target={[0, 0, 0]} />
      <Lightformer form="rect" intensity={0.6 * intensity} color="#ffffff" position={[0, -3, 4]} scale={[10, 2, 1]} target={[0, 0, 0]} />
      <Lightformer form="ring" intensity={1.2 * intensity} color={warm} position={[2, 6, 6]} scale={2} target={[0, 0, 0]} />
    </Environment>
  );
}

export function usePointer() {
  const p = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const move = (e: PointerEvent) => {
      p.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      p.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);
  return p;
}

export const damp = THREE.MathUtils.damp;
export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);
