'use client';

import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, useGLTF } from '@react-three/drei';
import { Suspense, useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import { Studio, clamp01, damp, easeInOut, easeOut } from './shared';
import { PIECE_HEIGHT, usePieceGeometries, usePieceMaterials } from './pieces';
import type { PieceType } from '@/lib/content';

type Progress = MutableRefObject<number>;
const MOVE = new THREE.Color('#9966ff');

type Entering = { mesh: THREE.Mesh; baseY: number; square: THREE.Mesh };

const MODEL = '/models/set.glb';

/**
 * The board comes from the full set model; every piece on it is rebuilt from the site's own
 * piece library (one matching tournament set), placed on the squares the original pieces stood on.
 */
function BoardSet({ progress, order, onReady }: { progress: Progress; order: PieceType[]; onReady?: () => void }) {
  const { scene } = useGLTF(MODEL);
  const frames = useRef(0);
  const geometries = usePieceGeometries();
  const materials = usePieceMaterials();
  const { camera, size } = useThree();
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

    // scale so the board is 4 units wide, centred, its top at y = 0
    root.updateMatrixWorld(true);
    const bbox = new THREE.Box3().setFromObject(board ?? root);
    const s = 4 / Math.max(bbox.getSize(new THREE.Vector3()).x, bbox.getSize(new THREE.Vector3()).z);
    root.scale.setScalar(s);
    root.updateMatrixWorld(true);
    bbox.setFromObject(board ?? root);
    const c = bbox.getCenter(new THREE.Vector3());
    root.position.set(-c.x, -bbox.max.y, -c.z);
    root.updateMatrixWorld(true);
    const boardBox = new THREE.Box3().setFromObject(board ?? root);
    const top = boardBox.max.y;

    // where each original piece stood, in world space; the originals themselves are hidden
    const originals = set.children.filter((n) => /^(white|black)-/.test(n.name));
    const spots = originals.map((n) => {
      const [color, type, file] = n.name.split('-');
      const centre = new THREE.Box3().setFromObject(n).getCenter(new THREE.Vector3());
      n.visible = false;
      return { color, type: type as PieceType, file: Number(file), x: centre.x, z: centre.z };
    });
    const rooks = spots.filter((p) => p.color === 'white' && (p.type === 'rook' || p.type === 'knight')).sort((a, b) => a.x - b.x);
    const sq = rooks.length > 1 ? Math.abs(rooks[1].x - rooks[0].x) : 0.5;

    const army = new THREE.Group();
    const squares = new THREE.Group();
    const pick = (t: PieceType) => spots.find((p) => p.color === 'white' && p.type === t && (p.file === 4 || p.file === 3)) ?? spots.find((p) => p.color === 'white' && p.type === t);
    const story = order.map(pick);
    const entering: Entering[] = [];

    for (const p of spots) {
      const inStory = p.color === 'white' && story.includes(p);
      // only the six white pieces of the story enter; the rest of white stays off the board
      if (p.color === 'white' && !inStory) continue;
      const mesh = new THREE.Mesh(geometries[p.type], p.color === 'white' ? materials.boxwood : materials.ebony);
      mesh.castShadow = true;
      mesh.scale.setScalar(PIECE_HEIGHT[p.type] * sq);
      mesh.position.set(p.x, top, p.z);
      // pieces face the opponent: white looks toward -z, black toward +z
      mesh.rotation.y = p.color === 'white' ? Math.PI : 0;
      army.add(mesh);
      if (inStory) {
        const square = new THREE.Mesh(
          new THREE.PlaneGeometry(sq * 0.94, sq * 0.94),
          new THREE.MeshBasicMaterial({ color: MOVE, transparent: true, opacity: 0, depthWrite: false, toneMapped: false }),
        );
        square.rotation.x = -Math.PI / 2;
        square.position.set(p.x, top + 0.004, p.z);
        squares.add(square);
        entering[order.indexOf(p.type)] = { mesh, baseY: top, square };
      }
    }
    return { root, army, squares, entering: entering.filter(Boolean), boardBottom: boardBox.min.y };
  }, [scene, geometries, materials, order]);

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

  useFrame((_, dt) => {
    // tell the page once a complete frame is on screen, so it can fade the scene in
    frames.current += 1;
    if (frames.current === 2) onReady?.();
    const p = progress.current;
    const n = built.entering.length;
    const steps = p * (n + 0.6);
    built.entering.forEach((e, i) => {
      const t = i === 0 ? 1 : clamp01(steps - i);
      const placed = easeOut(clamp01(t * 1.6));
      e.mesh.visible = t > 0;
      e.mesh.position.y = e.baseY + (1 - placed) * 1.6;
      const current = Math.min(Math.floor(steps), n - 1) === i && t > 0;
      const mat = e.square.material as THREE.MeshBasicMaterial;
      mat.opacity = damp(mat.opacity, current ? 0.92 : 0, 6, dt);
    });
    const cp = path.getPointAt(easeInOut(clamp01(p)));
    camera.position.lerp(cp, 1 - Math.exp(-dt * 5));
    look.current.lerp(new THREE.Vector3(0, 0.25 * (1 - p), 0.4 * (1 - p)), 1 - Math.exp(-dt * 5));
    camera.lookAt(look.current);
  });

  return (
    <>
      <primitive object={built.root} />
      <primitive object={built.army} />
      <primitive object={built.squares} />
      <mesh rotation-x={-Math.PI / 2} position={[0, built.boardBottom - 0.001, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#14120f" roughness={0.9} />
      </mesh>
      <ContactShadows position={[0, built.boardBottom + 0.002, 0]} resolution={256} opacity={0.9} scale={7} blur={2} far={1.2} color="#000000" />
    </>
  );
}

export default function BoardScene({ progress, order, active = true, onReady }: { progress: Progress; order: PieceType[]; active?: boolean; onReady?: () => void }) {
  const maxDpr = typeof window !== 'undefined' && window.innerWidth < 768 ? 1.5 : 1.75;
  return (
    <Canvas
      frameloop={active ? 'always' : 'demand'}
      dpr={[1, maxDpr]}
      camera={{ position: [5.2, 1.3, 6.4], fov: 32 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
    >
      <fog attach="fog" args={['#12110f', 9, 20]} />
      <Suspense fallback={null}>
        <Studio intensity={1.4} />
        <ambientLight intensity={0.2} />
        <directionalLight position={[-4, 8, 5]} intensity={1.6} color="#ffe6c4" />
        <BoardSet progress={progress} order={order} onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload(MODEL);
