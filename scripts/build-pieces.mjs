// Builds public/models/pieces-v2.glb: one clean, upright mesh per piece type, base at y = 0,
// centred, height 1, already smoothed (the browser does no geometry work). King, queen, rook and bishop
// come from the "Detailed wooden chess" series; the knight from the hero knight model; the pawn from the full set.
// Usage: npm run assets:pieces
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { Document, NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, prune, weld, meshopt, transformPrimitive, copyToDocument, unpartition } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
import obj2gltf from 'obj2gltf';
import * as THREE from 'three';
import { LoopSubdivision } from 'three-subdivide';
import { mergeGeometries, mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const SRC = process.env.ASSET_SRC ?? path.resolve('_assets-source/3d');
const TMP = mkdtempSync(path.join(tmpdir(), 'cbs-pieces-'));
await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });

const findObj = (dir) => {
  const sub = readdirSync(dir).find((d) => d.startsWith('[OBJ]'));
  const folder = path.join(dir, sub);
  return path.join(folder, readdirSync(folder).find((f) => f.endsWith('.obj')));
};

async function loadObj(file) {
  const bin = await obj2gltf(file, { binary: true, separateTextures: false });
  return io.readBinary(new Uint8Array(bin));
}

/** Pick the largest mesh primitive whose node name matches, and return it as a standalone document. */
function primitivesOf(doc, match = () => true) {
  const out = [];
  for (const node of doc.getRoot().listNodes()) {
    const mesh = node.getMesh();
    if (!mesh || !match(node.getName())) continue;
    for (const p of mesh.listPrimitives()) out.push({ node, p });
  }
  return out;
}

function bounds(prims) {
  const lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity], v = [0, 0, 0];
  for (const { p } of prims) {
    const pos = p.getAttribute('POSITION');
    for (let i = 0; i < pos.getCount(); i++) { pos.getElement(i, v); for (let k = 0; k < 3; k++) { lo[k] = Math.min(lo[k], v[k]); hi[k] = Math.max(hi[k], v[k]); } }
  }
  return { lo, hi, ext: hi.map((h, k) => h - lo[k]) };
}

const out = new Document();
out.createBuffer();
const scene = out.createScene('pieces');
const mat = out.createMaterial('piece').setRoughnessFactor(0.4);

async function addPiece(name, doc, match) {
  await doc.transform(weld());
  const prims = primitivesOf(doc, match);
  // make the tallest axis "up" (y)
  let b = bounds(prims);
  const up = b.ext.indexOf(Math.max(...b.ext));
  let rot = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  if (up === 2) rot = [1, 0, 0, 0, 0, 0, -1, 0, 0, 1, 0, 0, 0, 0, 0, 1]; // z-up â†’ y-up
  if (up === 0) rot = [0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]; // x-up â†’ y-up
  for (const { p } of prims) transformPrimitive(p, rot);
  b = bounds(prims);
  const s = 1 / b.ext[1];
  const cx = (b.lo[0] + b.hi[0]) / 2, cz = (b.lo[2] + b.hi[2]) / 2;
  const m = [s, 0, 0, 0, 0, s, 0, 0, 0, 0, s, 0, -cx * s, -b.lo[1] * s, -cz * s, 1];
  for (const { p } of prims) transformPrimitive(p, m);
  const mesh = out.createMesh(name);
  for (const { p } of prims) {
    const map = copyToDocument(out, doc, [p]);
    const np = map.get(p);
    np.setMaterial(mat);
    for (const sem of np.listSemantics()) if (!['POSITION', 'NORMAL', 'TEXCOORD_0'].includes(sem)) np.setAttribute(sem, null);
    mesh.addPrimitive(np);
  }
  scene.addChild(out.createNode(name).setMesh(mesh));
  const verts = prims.reduce((n, { p }) => n + p.getAttribute('POSITION').getCount(), 0);
  console.log(name.padEnd(7), 'verts', verts, 'up-axis was', 'xyz'[up]);
}

await addPiece('king', await loadObj(findObj(`${SRC}/detailed-wooden-chess-king-piece`)));
await addPiece('queen', await loadObj(findObj(`${SRC}/classic-wood-chess-queen`)));
await addPiece('rook', await loadObj(findObj(`${SRC}/wooden-chess-rook-piece`)));
await addPiece('bishop', await loadObj(findObj(`${SRC}/detailed-wooden-chess-bishop`)));

const FBX2GLTF = path.resolve('node_modules/fbx2gltf/bin/Windows_NT/FBX2glTF.exe');
execFileSync(FBX2GLTF, ['--binary', '--input', `${SRC}/knights-black-wood/[FBX] Chess_Horse/Chess_Horse.fbx`, '--output', path.join(TMP, 'knights')], { stdio: 'pipe' });
await addPiece('knight', await io.read(path.join(TMP, 'knights.glb')), (n) => /white/i.test(n));

// the pawn: take one pawn from the full set (it is merged with all white figures, so cut it by position)
const setDoc = await loadObj(`${SRC}/board-full-set/Chess_2/Chess_2.obj`);
await setDoc.transform(weld());
const whiteNode = setDoc.getRoot().listNodes().find((n) => n.getName().includes('figures_white'));
const wp = whiteNode.getMesh().listPrimitives()[0];
const pos = wp.getAttribute('POSITION'), idx = wp.getIndices();
const keep = [];
const a = [0, 0, 0];
for (let t = 0; t < idx.getCount(); t += 3) {
  // pawn on the e-file: x â‰ˆ 1.75, rank y â‰ˆ -8.6 in this export
  let inside = true;
  for (let k = 0; k < 3; k++) { pos.getElement(idx.getScalar(t + k), a); if (Math.abs(a[0] - 1.75) > 1.6 || Math.abs(a[1] + 8.6) > 1.6) inside = false; }
  if (inside) keep.push(idx.getScalar(t), idx.getScalar(t + 1), idx.getScalar(t + 2));
}
wp.setIndices(setDoc.createAccessor().setType('SCALAR').setArray(new Uint32Array(keep)).setBuffer(setDoc.getRoot().listBuffers()[0]));
await setDoc.transform(prune());
await addPiece('pawn', setDoc, (n) => n.includes('figures_white'));

// Bake smoothing in: one Loop subdivision pass rounds the low-poly lathe profiles of the four
// series pieces. Done here rather than in the browser, where it blocked the main thread for seconds.
// Every piece ends up as a single primitive the site can use as-is.
const SMOOTHING = { king: 1, queen: 1, rook: 1, bishop: 1, knight: 0, pawn: 0 };
const outBuffer = out.getRoot().listBuffers()[0];
for (const mesh of out.getRoot().listMeshes()) {
  const passes = SMOOTHING[mesh.getName()] ?? 0;
  const parts = [];
  for (const p of mesh.listPrimitives()) {
    const pos = p.getAttribute('POSITION');
    const nrm = p.getAttribute('NORMAL');
    const uv = p.getAttribute('TEXCOORD_0');
    let g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(Float32Array.from(pos.getArray()), 3));
    if (nrm) g.setAttribute('normal', new THREE.BufferAttribute(Float32Array.from(nrm.getArray()), 3));
    g.setAttribute('uv', new THREE.BufferAttribute(uv ? Float32Array.from(uv.getArray()) : new Float32Array(pos.getCount() * 2), 2));
    const idx = p.getIndices();
    if (idx) g.setIndex(Array.from(idx.getArray()));
    if (passes > 0) g = LoopSubdivision.modify(g, passes, { split: true, uvSmooth: false, preserveEdges: false, flatOnly: false });
    if (!g.getAttribute('normal')) g.computeVertexNormals();
    parts.push(g.index ? g.toNonIndexed() : g);
    mesh.removePrimitive(p);
    p.dispose();
  }
  const merged = mergeVertices(parts.length === 1 ? parts[0] : mergeGeometries(parts, false), 1e-5);
  const acc = (type, array) => out.createAccessor().setType(type).setArray(array).setBuffer(outBuffer);
  mesh.addPrimitive(
    out.createPrimitive()
      .setMaterial(mat)
      .setAttribute('POSITION', acc('VEC3', new Float32Array(merged.getAttribute('position').array)))
      .setAttribute('NORMAL', acc('VEC3', new Float32Array(merged.getAttribute('normal').array)))
      .setAttribute('TEXCOORD_0', acc('VEC2', new Float32Array(merged.getAttribute('uv').array)))
      .setIndices(acc('SCALAR', new Uint32Array(merged.index.array))),
  );
  console.log(mesh.getName().padEnd(7), 'baked verts', merged.getAttribute('position').count, 'tris', merged.index.count / 3, `(${passes} subdivision pass)`);
}

await out.transform(
  unpartition(),
  dedup(),
  weld(),
  prune(),
  // 'high' adds meshopt's normal and position filters: much smaller, visually the same at this scale
  meshopt({ encoder: MeshoptEncoder, level: 'high' }),
);
// versioned name: /models is served with immutable cache headers
await io.write('public/models/pieces-v2.glb', out);
console.log('wrote public/models/pieces-v2.glb');

// Grain map for boxwood: the series' mahogany texture, turned grey and lifted so it tints pale in code
const { default: sharp } = await import('sharp');
// two passes: sharp would otherwise apply linear() before normalise()
const grey = await sharp(`${SRC}/detailed-wooden-chess-king-piece/Extras/Wood_001.png`).resize(1024).grayscale().normalise().removeAlpha().toBuffer();
await sharp(grey).linear(0.2, 206).webp({ quality: 80 }).toFile('public/models/boxwood-grain-v2.webp');
console.log('wrote public/models/boxwood-grain-v2.webp');

