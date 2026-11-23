'use client';

import * as THREE from 'three';
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { ContactShadows, useGLTF } from '@react-three/drei';
import { Suspense, useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import { Studio, clamp01, damp, easeInOut } from './shared';
import { PIECE_HEIGHT, usePieceGeometries, usePieceMaterials } from './pieces';
import type { TeamMember } from '@/lib/content';

type Progress = MutableRefObject<number>;

// The same board model as the home page board story: its hidden original pieces mark the squares.
const MODEL = '/models/set.glb';
const MOVE = new THREE.Color('#9966ff');

const TOP = new THREE.Vector3(0, 8.6, 0.01);
const LOW = new THREE.Vector3(0, 2.15, 4.5);

function Room({
  progress,
  team,
  active,
  onPick,
}: {
  progress: Progress;
  team: TeamMember[];
  active: number | null;
  onPick: (i: number | null) => void;
}) {
  const { scene } = useGLTF(MODEL);
  const geometries = usePieceGeometries();
  const materials = usePieceMaterials();
  const { camera, size } = useThree();
  const target = useRef(new THREE.Vector3());
  const look = useRef(new THREE.Vector3());

  const built = useMemo(() => {
    const root = scene.clone(true);
    const set = root.getObjectByName('set') ?? root;
    const board = root.getObjectByName('board');
    if (board) {
      const m = board as THREE.Mesh;
      const src = m.material as THREE.MeshStandardMaterial;
      if (src.map) src.map.colorSpace = THREE.SRGBColorSpace;
      m.material = new THREE.MeshPhysicalMaterial({ map: src.map, color: '#fff4e4', roughness: 0.34, clearcoat: 0.8, clearcoatRoughness: 0.15 });
      m.receiveShadow = true;
    }
    // board 4 units wide, centred, its top at y = 0 (as in the board story)
    root.updateMatrixWorld(true);
    const bbox = new THREE.Box3().setFromObject(board ?? root);
    const dims = bbox.getSize(new THREE.Vector3());
    root.scale.setScalar(4 / Math.max(dims.x, dims.z));
    root.updateMatrixWorld(true);
    bbox.setFromObject(board ?? root);
    const c = bbox.getCenter(new THREE.Vector3());
    root.position.set(-c.x, -bbox.max.y, -c.z);
    root.updateMatrixWorld(true);
    const boardBox = new THREE.Box3().setFromObject(board ?? root);
    const top = boardBox.max.y;

    // square grid from the original pieces: white pawns give the files, white's first two ranks the rank step
    const spots = set.children
      .filter((n) => /^(white|black)-/.test(n.name))
      .map((n) => {
        const [color, type] = n.name.split('-');
        const centre = new THREE.Box3().setFromObject(n).getCenter(new THREE.Vector3());
        n.visible = false;
        return { color, type, x: centre.x, z: centre.z };
      });
    const pawns = spots.filter((s) => s.color === 'white' && s.type === 'pawn');
    const files = pawns.map((p) => p.x).sort((a, b) => a - b);
    const rank2 = pawns.reduce((t, p) => t + p.z, 0) / Math.max(1, pawns.length);
    const backs = spots.filter((s) => s.color === 'white' && s.type !== 'pawn');
    const rank1 = backs.reduce((t, p) => t + p.z, 0) / Math.max(1, backs.length);
    const dz = rank2 - rank1;
    const sq = files.length > 1 ? (files[files.length - 1] - files[0]) / (files.length - 1) : 0.45;
    const at = (square: string) => ({ x: files[square.charCodeAt(0) - 97] ?? 0, z: rank1 + (Number(square[1]) - 1) * dz });

    const pieces = team.map((m) => {
      const { x, z } = at(m.square);
      const h = PIECE_HEIGHT[m.piece] * sq;
      const mesh = new THREE.Mesh(geometries[m.piece], materials.boxwood);
      mesh.castShadow = true;
      mesh.scale.setScalar(h);
      mesh.position.set(x, top, z);
      mesh.rotation.y = Math.PI; // facing the far side, like the board story's white pieces
      const square = new THREE.Mesh(
        new THREE.PlaneGeometry(sq * 0.94, sq * 0.94),
        new THREE.MeshBasicMaterial({ color: MOVE, transparent: true, opacity: 0, depthWrite: false, toneMapped: false }),
      );
      square.rotation.x = -Math.PI / 2;
      square.position.set(x, top + 0.004, z);
      // An invisible box keeps the full square easy to hover or tap.
      const hit = new THREE.Mesh(new THREE.BoxGeometry(sq * 0.9, PIECE_HEIGHT[m.piece] * sq, sq * 0.9), new THREE.MeshBasicMaterial({ visible: false }));
      hit.position.set(x, top + (PIECE_HEIGHT[m.piece] * sq) / 2, z);
      return { mesh, square, hit };
    });
    return { root, pieces, top, boardBottom: boardBox.min.y };
  }, [scene, geometries, materials, team]);

  useEffect(() => () => { document.body.style.cursor = ''; }, []);

  useFrame((_, dt) => {
    const p = progress.current;
    // tilt from straight down to a low angle while the window crosses the middle of the screen
    const tilt = easeInOut(clamp01((p - 0.12) / 0.5));
    // narrow screens see the board through a narrower view, so step back to keep it whole
    const fit = Math.max(1, 1.15 / Math.max(0.3, size.width / Math.max(1, size.height)));
    target.current.lerpVectors(TOP, LOW, tilt).multiplyScalar(fit);
    camera.position.lerp(target.current, 1 - Math.exp(-dt * 6));
    look.current.y = damp(look.current.y, 0.2 * tilt, 6, dt);
    camera.lookAt(look.current);

    built.pieces.forEach((piece, i) => {
      const lift = active === i ? 0.06 : 0;
      piece.mesh.position.y = damp(piece.mesh.position.y, built.top + lift, 9, dt);
      const mat = piece.square.material as THREE.MeshBasicMaterial;
      mat.opacity = damp(mat.opacity, active === i ? 0.92 : 0, 8, dt);
    });
  });

  const over = (i: number) => (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = 'pointer';
    onPick(i);
  };
  const out = () => { document.body.style.cursor = ''; };

  return (
    <>
      <primitive object={built.root} />
      {built.pieces.map((piece, i) => (
        <group key={i}>
          <primitive object={piece.mesh} />
          <primitive object={piece.square} />
          <primitive object={piece.hit} onPointerOver={over(i)} onPointerOut={out} onClick={(e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); onPick(i); }} />
        </group>
      ))}
      <mesh rotation-x={-Math.PI / 2} position={[0, built.boardBottom - 0.001, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#171512" roughness={0.9} />
      </mesh>
      <ContactShadows position={[0, built.boardBottom + 0.002, 0]} resolution={256} frames={1} opacity={0.85} scale={7} blur={2} far={1.2} color="#000000" />
    </>
  );
}

export default function TeamBoardScene({
  progress,
  team,
  active,
  onPick,
  running = true,
}: {
  progress: Progress;
  team: TeamMember[];
  active: number | null;
  onPick: (i: number | null) => void;
  running?: boolean;
}) {
  return (
    <Canvas
      frameloop={running ? 'always' : 'demand'}
      dpr={[1, 1.5]}
      camera={{ position: TOP.toArray(), fov: 32 }}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.15 }}
      onPointerMissed={() => onPick(null)}
    >
      <color attach="background" args={['#171512']} />
      <fog attach="fog" args={['#171512', 9, 22]} />
      <Suspense fallback={null}>
        <Studio intensity={1.3} />
        <ambientLight intensity={0.25} />
        <directionalLight position={[-4, 8, 5]} intensity={1.5} color="#ffe6c4" />
        <Room progress={progress} team={team} active={active} onPick={onPick} />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload(MODEL);
