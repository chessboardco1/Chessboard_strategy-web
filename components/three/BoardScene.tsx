'use client';

import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Suspense, useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import { clamp01, damp, easeInOut, easeOut } from './shared';
import { GROWTH_BOARD_MODEL, PIECE_HEIGHT } from './models';
import type { PieceType } from '@/lib/content';

type Progress = MutableRefObject<number>;
const MOVE = new THREE.Color('#9966ff');

type Entering = { piece: THREE.Group; square: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial> };
type Spot = { color: 'white' | 'black'; type: PieceType; file: number; x: number; z: number };
type BoardLayout = { spots: Spot[]; squareSize: number; boardBottom: number };

function BoardSet({ progress, order, onReady }: { progress: Progress; order: PieceType[]; onReady?: () => void }) {
  const { scene } = useGLTF(GROWTH_BOARD_MODEL, false);
  const revealFrame = useRef<number | null>(null);
  const { camera, size } = useThree();
  const look = useRef(new THREE.Vector3());
  const lookTarget = useRef(new THREE.Vector3());

  const built = useMemo(() => {
    const { spots, squareSize, boardBottom } = scene.userData as BoardLayout;
    const board = scene.getObjectByName('board')!.clone(true) as THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>;
    board.material = new THREE.MeshStandardMaterial({ map: board.material.map, color: '#fff4e4', roughness: 0.53 });
    const library = scene.getObjectByName('piece-library')!;
    const boxwood = new THREE.MeshStandardMaterial({ color: '#ffe3bb', roughness: 0.42 });
    const ebony = new THREE.MeshStandardMaterial({ color: '#29221e', roughness: 0.36 });
    const army = new THREE.Group();
    const squares = new THREE.Group();
    const squareGeometry = new THREE.PlaneGeometry(squareSize * 0.94, squareSize * 0.94);
    const pick = (type: PieceType) => spots.find((p) => p.color === 'white' && p.type === type && (p.file === 4 || p.file === 3))
      ?? spots.find((p) => p.color === 'white' && p.type === type);
    const story = order.map(pick);
    const entering: Entering[] = [];

    for (const spot of spots) {
      const isWhite = spot.color === 'white';
      const storyIndex = isWhite ? story.indexOf(spot) : -1;
      if (isWhite && storyIndex < 0) continue;
      const template = library.getObjectByName(spot.type)!.clone(true);
      template.traverse((node) => {
        if (node instanceof THREE.Mesh) node.material = isWhite ? boxwood : ebony;
      });
      const piece = new THREE.Group();
      piece.add(template);
      piece.scale.setScalar(PIECE_HEIGHT[spot.type] * squareSize);
      piece.position.set(spot.x, 0, spot.z);
      piece.rotation.y = isWhite ? Math.PI : 0;
      army.add(piece);
      if (storyIndex >= 0) {
        const square = new THREE.Mesh(
          squareGeometry,
          new THREE.MeshBasicMaterial({ color: MOVE, transparent: true, opacity: 0, depthWrite: false, toneMapped: false }),
        );
        square.rotation.x = -Math.PI / 2;
        square.position.set(spot.x, 0.004, spot.z);
        squares.add(square);
        entering[storyIndex] = { piece, square };
      }
    }
    return { board, army, squares, entering: entering.filter(Boolean), boardBottom };
  }, [scene, order]);

  const path = useMemo(
    () => new THREE.CatmullRomCurve3([
      new THREE.Vector3(5.2, 1.3, 6.4),
      new THREE.Vector3(-1.6, 2.1, 7.4),
      new THREE.Vector3(-6.6, 3.4, 3.4),
      new THREE.Vector3(-4.6, 6.8, 3.2),
      new THREE.Vector3(0.0, 9.4, 1.9),
    ]),
    [],
  );

  // keep the board in the right-hand part of the frame when the text sits over its left side (wide canvases),
  // centred when the board has the upper part of the screen to itself (phones, portrait tablets)
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    if (size.width >= 768 && size.width / size.height > 1.2) cam.setViewOffset(size.width, size.height, -size.width * 0.17, 0, size.width, size.height);
    else cam.setViewOffset(size.width, size.height, 0, -size.height * 0.12, size.width, size.height);
    cam.updateProjectionMatrix();
    return () => cam.clearViewOffset();
  }, [camera, size.width, size.height]);

  useEffect(() => () => {
    if (revealFrame.current !== null) cancelAnimationFrame(revealFrame.current);
    revealFrame.current = null;
  }, []);

  useFrame((_, dt) => {
    const firstFrame = revealFrame.current === null;
    const p = progress.current;
    const n = built.entering.length;
    const steps = p * (n + 0.6);
    built.entering.forEach((e, i) => {
      const t = i === 0 ? 1 : clamp01(steps - i);
      const placed = easeOut(clamp01(t * 1.6));
      e.piece.visible = t > 0;
      e.piece.position.y = (1 - placed) * 1.6;
      const current = Math.min(Math.floor(steps), n - 1) === i && t > 0;
      const mat = e.square.material;
      mat.opacity = firstFrame ? (current ? 0.92 : 0) : damp(mat.opacity, current ? 0.92 : 0, 6, dt);
      e.square.visible = mat.opacity > 0.01;
    });
    const cp = path.getPointAt(easeInOut(clamp01(p)));
    const blend = firstFrame ? 1 : 1 - Math.exp(-dt * 5);
    camera.position.lerp(cp, blend);
    look.current.lerp(lookTarget.current.set(0, 0.25 * (1 - p), 0.4 * (1 - p)), blend);
    camera.lookAt(look.current);
    if (firstFrame) revealFrame.current = requestAnimationFrame(() => onReady?.());
  });

  return (
    <>
      <primitive object={built.board} />
      <primitive object={built.army} />
      <primitive object={built.squares} />
      <mesh rotation-x={-Math.PI / 2} position={[0, built.boardBottom - 0.001, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#14120f" roughness={0.9} />
      </mesh>
    </>
  );
}
export default function BoardScene({ progress, order, active = true, onReady }: { progress: Progress; order: PieceType[]; active?: boolean; onReady?: () => void }) {
  const maxDpr = typeof window !== 'undefined' && window.innerWidth < 768 ? 1.15 : 1.35;
  return (
    <Canvas
      frameloop={active ? 'always' : 'demand'}
      dpr={[1, maxDpr]}
      camera={{ position: [5.2, 1.3, 6.4], fov: 32 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
    >
      <fog attach="fog" args={['#0b0b0b', 9, 20]} />
      <Suspense fallback={null}>
        <hemisphereLight args={['#fff2df', '#5b4950', 1.15]} />
        <directionalLight position={[-4, 8, 5]} intensity={2.2} color="#ffe6c4" />
        <directionalLight position={[4, 5, -6]} intensity={1.2} color="#e3dcff" />
        <BoardSet progress={progress} order={order} onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
