'use client';

import * as THREE from 'three';
import { useGLTF, useTexture } from '@react-three/drei';
import { useMemo } from 'react';
import type { PieceType } from '@/lib/content';

// One library of pieces for every scene, so the whole site shows a single matching set.
// Geometry comes from /models/pieces-v2.glb: height 1, base at y = 0, already smoothed and merged
// into one primitive per piece at build time (scripts/build-pieces.mjs), so the browser does no geometry work.
const MODEL = '/models/pieces-v2.glb';
const GRAIN = '/models/boxwood-grain-v2.webp';

/** Relative heights in board squares, after a tournament Staunton set. */
export const PIECE_HEIGHT: Record<PieceType, number> = {
  king: 1.62,
  queen: 1.44,
  bishop: 1.2,
  knight: 1.06,
  rook: 0.96,
  pawn: 0.8,
};

const cache = new Map<PieceType, THREE.BufferGeometry>();

/** Copy the meshopt-quantised attributes into plain floats and bake in the node transform that undoes the quantisation. */
function toFloatGeometry(src: THREE.BufferGeometry, matrix: THREE.Matrix4) {
  const g = new THREE.BufferGeometry();
  for (const name of ['position', 'normal', 'uv'] as const) {
    const a = src.getAttribute(name) as THREE.BufferAttribute | undefined;
    if (!a) continue;
    const out = new Float32Array(a.count * a.itemSize);
    // getX/getY/getZ undo normalised integer storage; getComponent would not
    const read = [a.getX, a.getY, a.getZ, a.getW];
    for (let i = 0; i < a.count; i++) for (let k = 0; k < a.itemSize; k++) out[i * a.itemSize + k] = read[k].call(a, i);
    g.setAttribute(name, new THREE.BufferAttribute(out, a.itemSize));
  }
  if (!g.getAttribute('uv')) g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(g.getAttribute('position').count * 2), 2));
  if (src.index) g.setIndex(Array.from(src.index.array));
  g.applyMatrix4(matrix);
  return g;
}

export function usePieceGeometries(): Record<PieceType, THREE.BufferGeometry> {
  const { scene } = useGLTF(MODEL);
  return useMemo(() => {
    scene.updateMatrixWorld(true);
    const result = {} as Record<PieceType, THREE.BufferGeometry>;
    (Object.keys(PIECE_HEIGHT) as PieceType[]).forEach((type) => {
      if (!cache.has(type)) {
        let mesh: THREE.Mesh | undefined;
        scene.getObjectByName(type)?.traverse((o) => { if (!mesh && (o as THREE.Mesh).isMesh) mesh = o as THREE.Mesh; });
        if (!mesh) return;
        const g = toFloatGeometry(mesh.geometry, mesh.matrixWorld);
        if (!g.getAttribute('normal')) g.computeVertexNormals();
        g.computeBoundingBox();
        cache.set(type, g);
      }
      result[type] = cache.get(type)!;
    });
    return result;
  }, [scene]);
}

/** Lacquered ebony and grained boxwood, shared by every piece on the site. */
export function usePieceMaterials() {
  const grain = useTexture(GRAIN);
  return useMemo(() => {
    grain.colorSpace = THREE.SRGBColorSpace;
    grain.wrapS = grain.wrapT = THREE.RepeatWrapping;
    grain.anisotropy = 8;
    const ebony = new THREE.MeshPhysicalMaterial({
      color: '#0a0908',
      roughness: 0.3,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.04,
      specularIntensity: 0.6,
    });
    const boxwood = new THREE.MeshPhysicalMaterial({
      color: '#ffe2b2',
      map: grain,
      envMapIntensity: 1.4,
      roughness: 0.34,
      metalness: 0,
      clearcoat: 0.7,
      clearcoatRoughness: 0.12,
      sheen: 0.25,
      sheenColor: new THREE.Color('#fff2d6'),
    });
    return { ebony, boxwood };
  }, [grain]);
}

useGLTF.preload(MODEL);
useTexture.preload(GRAIN);


