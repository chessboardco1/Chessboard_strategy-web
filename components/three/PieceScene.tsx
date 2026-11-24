'use client';

import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import { Suspense, useRef, type MutableRefObject } from 'react';
import { Studio, damp, easeOut, usePointer } from './shared';
import { usePieceGeometries, usePieceMaterials } from './pieces';
import type { PieceType } from '@/lib/content';

const HEIGHT = 2.6;

// A single piece from the site's set, standing in studio light: turns with scroll, leans toward the pointer.
function Piece({ type, tone, progress }: { type: PieceType; tone: 'ebony' | 'boxwood'; progress: MutableRefObject<number> }) {
  const geometries = usePieceGeometries();
  const materials = usePieceMaterials();
  const group = useRef<THREE.Group>(null);
  const pointer = usePointer();
  const born = useRef<number | null>(null);

  useFrame((state, dt) => {
    if (!group.current) return;
    if (born.current === null) born.current = state.clock.elapsedTime;
    const intro = easeOut(Math.min(1, (state.clock.elapsedTime - born.current) / 2));
    group.current.rotation.y = damp(group.current.rotation.y, (1 - intro) * -1.4 + progress.current * Math.PI * 1.2 + pointer.current.x * 0.3, 3, dt);
    group.current.rotation.z = damp(group.current.rotation.z, -pointer.current.x * 0.04, 3, dt);
    group.current.position.y = damp(group.current.position.y, -1.3 + (1 - intro) * 0.8, 3, dt);
  });

  return (
    <group ref={group} position={[0, -1.3, 0]}>
      <mesh geometry={geometries[type]} material={tone === 'ebony' ? materials.ebony : materials.boxwood} scale={HEIGHT} castShadow />
      <ContactShadows position={[0, 0.002, 0]} opacity={0.55} scale={5} blur={2.4} far={2} color={tone === 'ebony' ? '#3b352d' : '#2a2520'} />
    </group>
  );
}

export default function PieceScene({ type, tone = 'ebony', progress }: { type: PieceType; tone?: 'ebony' | 'boxwood'; progress: MutableRefObject<number> }) {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0.4, 7], fov: 30 }} gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}>
      <Suspense fallback={null}>
        <Studio intensity={tone === 'ebony' ? 1.2 : 1} />
        <Piece key={`${type}-${tone}`} type={type} tone={tone} progress={progress} />
      </Suspense>
    </Canvas>
  );
}
