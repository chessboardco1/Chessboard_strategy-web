'use client';

import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, useGLTF } from '@react-three/drei';
import { Suspense, useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import { Studio, damp, usePointer } from './shared';
import { usePieceMaterials } from './pieces';

type Progress = MutableRefObject<number>;
const canvasResize = { offsetSize: true };

function Knights({ progress, onReadyChange }: { progress: Progress; onReadyChange: (ready: boolean) => void }) {
  const { scene } = useGLTF('/models/knights.glb');
  const materials = usePieceMaterials();
  const group = useRef<THREE.Group>(null);
  const pointer = usePointer();
  const frames = useRef(0);
  const handoffTime = useRef(0);
  const { camera, gl, size } = useThree();
  // the pair needs about this width-to-height ratio to fit; narrower canvases pull the camera back
  const fit = Math.max(1, 1.05 / Math.max(0.2, size.width / Math.max(1, size.height)));

  const model = useMemo(() => {
    const root = scene.clone(true);
    root.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      m.castShadow = true;
      m.material = /black/i.test(m.name) || /black/i.test((m.material as THREE.Material).name) ? materials.ebony : materials.boxwood;
    });
    // normalise: stand on y = 0, about 2.4 units tall, centred
    const box = new THREE.Box3().setFromObject(root);
    const size = box.getSize(new THREE.Vector3());
    const s = 2.4 / size.y;
    root.scale.setScalar(s);
    box.setFromObject(root);
    const c = box.getCenter(new THREE.Vector3());
    root.position.set(-c.x, -box.min.y, -c.z);
    return root;
  }, [scene, materials]);

  useEffect(() => {
    const canvas = gl.domElement;
    const onContextLost = () => {
      frames.current = 0;
      handoffTime.current = 0;
      onReadyChange(false);
    };
    canvas.addEventListener('webglcontextlost', onContextLost);
    return () => canvas.removeEventListener('webglcontextlost', onContextLost);
  }, [gl, onReadyChange]);

  useFrame((_, dt) => {
    if (!group.current) return;
    if (frames.current < 2) {
      if (gl.getContext().isContextLost()) return;
      frames.current += 1;
      if (frames.current === 2) onReadyChange(true);
    }

    // Keep the camera and model on the still's pose while the canvas fades in.
    if (handoffTime.current < 0.85) {
      handoffTime.current += Math.min(dt, 0.05);
      camera.position.set(0, 0.6, 7.2 * fit);
      camera.lookAt(0, 0, 0);
      group.current.rotation.set(0, -0.35, 0);
      group.current.position.y = -1.25;
      return;
    }

    const p = progress.current;
    const targetY = -0.35 + pointer.current.x * 0.22 + p * 1.1;
    const targetX = pointer.current.y * 0.05;
    group.current.rotation.y = damp(group.current.rotation.y, targetY, 3.2, dt);
    group.current.rotation.x = damp(group.current.rotation.x, targetX, 3.2, dt);
    group.current.position.y = damp(group.current.position.y, -1.25 + p * 0.5, 3.2, dt);
    camera.position.z = damp(camera.position.z, (7.2 - p * 1.6) * fit, 3, dt);
    camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={group} position={[0, -1.25, 0]} rotation-y={-0.35}>
      <primitive object={model} />
      {/* a tight, dark contact right under the bases, softening outward */}
      <ContactShadows position={[0, 0.002, 0]} opacity={0.75} scale={4.6} blur={1.6} far={1.4} resolution={256} frames={1} color="#5e554a" />
    </group>
  );
}

export default function KnightsScene({ progress, onReadyChange, running }: { progress: Progress; onReadyChange: (ready: boolean) => void; running: boolean }) {
  return (
    <Canvas
      resize={canvasResize}
      frameloop={running ? 'always' : 'demand'}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.6, 7.2], fov: 30 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <Studio />
        <Knights progress={progress} onReadyChange={onReadyChange} />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload('/models/knights.glb');
