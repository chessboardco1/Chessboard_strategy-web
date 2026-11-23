// Builds public/models/knights.glb (hero) and public/models/set.glb (board scene) from the Envato sources.
// set.glb holds the board plus one node per original piece (name `white-king-3`); the board scene hides
// those and stands the site's own library pieces on their squares.
// Source: _assets-source/3d next to package.json (not committed), or set ASSET_SRC.
// Usage: npm run assets:models
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, prune, weld, textureCompress, meshopt } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
import sharp from 'sharp';
import obj2gltf from 'obj2gltf';

const SRC = process.env.ASSET_SRC ?? path.resolve('_assets-source/3d');
const OUT = path.resolve('public/models');
const TMP = mkdtempSync(path.join(tmpdir(), 'cbs-models-'));
mkdirSync(OUT, { recursive: true });
const FBX2GLTF = path.resolve('node_modules/fbx2gltf/bin/Windows_NT/FBX2glTF.exe');

await MeshoptEncoder.ready;
const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });

async function finish(doc, file, size = 1024) {
  await doc.transform(
    dedup(),
    weld(),
    prune(),
    textureCompress({ encoder: sharp, targetFormat: 'webp', resize: [size, size], quality: 82 }),
    meshopt({ encoder: MeshoptEncoder, level: 'medium' }),
  );
  await io.write(path.join(OUT, file), doc);
  console.log('wrote', file);
}

function fromFbx(name, file) {
  const dest = path.join(TMP, name);
  execFileSync(FBX2GLTF, ['--binary', '--input', file, '--output', dest], { stdio: 'pipe' });
  return io.read(`${dest}.glb`);
}

// 1. Hero knights
await finish(await fromFbx('knights', `${SRC}/knights-black-wood/[FBX] Chess_Horse/Chess_Horse.fbx`), 'knights.glb', 1024);

// 2. Full set: split the merged white/black figure meshes into one node per piece
const setBin = await obj2gltf(`${SRC}/board-full-set/Chess_2/Chess_2.obj`, { binary: true });
const doc = await io.readBinary(new Uint8Array(setBin));
await doc.transform(weld());
const root = doc.getRoot();
const scene = root.listScenes()[0];
const buffer = root.listBuffers()[0];

function splitBySquare(node, color) {
  const prim = node.getMesh().listPrimitives()[0];
  const pos = prim.getAttribute('POSITION');
  const idx = prim.getIndices();
  const attrs = prim.listSemantics().map((s) => [s, prim.getAttribute(s)]);
  const tri = idx.getCount() / 3;
  const v = [0, 0, 0];
  let min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < pos.getCount(); i++) {
    pos.getElement(i, v);
    for (let k = 0; k < 3; k++) { min[k] = Math.min(min[k], v[k]); max[k] = Math.max(max[k], v[k]); }
  }
  const ext = max.map((m, k) => m - min[k]);
  // files run along the longer horizontal axis, ranks along the shorter one
  // this OBJ export is Z-up: files run along X, ranks along Y
  const fileAxis = 0;
  const rankAxis = 1;
  const UP = 2;
  // connected components over shared vertices
  const parent = new Int32Array(pos.getCount()).map((_, i) => i);
  const find = (x) => { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; };
  for (let t = 0; t < tri * 3; t += 3) {
    const r0 = find(idx.getScalar(t));
    parent[find(idx.getScalar(t + 1))] = r0;
    parent[find(idx.getScalar(t + 2))] = r0;
  }
  const comps = new Map();
  const a = [0, 0, 0];
  for (let t = 0; t < tri * 3; t += 3) {
    const i0 = idx.getScalar(t);
    const root = find(i0);
    if (!comps.has(root)) comps.set(root, { list: [], lo: [Infinity, Infinity, Infinity], hi: [-Infinity, -Infinity, -Infinity] });
    const cmp = comps.get(root);
    for (let k = 0; k < 3; k++) {
      const vi = idx.getScalar(t + k);
      cmp.list.push(vi);
      pos.getElement(vi, a);
      for (let d = 0; d < 3; d++) { cmp.lo[d] = Math.min(cmp.lo[d], a[d]); cmp.hi[d] = Math.max(cmp.hi[d], a[d]); }
    }
  }
  // merge components that stand on the same spot (a piece may be several shells)
  const sq = ext[fileAxis] / 8;
  const coord = (p, axis) => (p.lo[axis] + p.hi[axis]) / 2;
  const rankMid = (min[rankAxis] + max[rankAxis]) / 2;
  const info = [];
  for (const r of [0, 1]) {
    const row = [...comps.values()]
      .filter((p) => (coord(p, rankAxis) < rankMid ? 0 : 1) === r)
      .sort((x, y) => coord(x, fileAxis) - coord(y, fileAxis));
    const clusters = [];
    for (const cmp of row) {
      const c = coord(cmp, fileAxis);
      const last = clusters[clusters.length - 1];
      if (last && Math.abs(c - last.mean) < sq * 0.5) {
        last.parts.push(cmp);
        last.mean = last.parts.reduce((s, q) => s + coord(q, fileAxis), 0) / last.parts.length;
      } else clusters.push({ mean: c, parts: [cmp] });
    }
    if (clusters.length !== 8) console.warn(`${color} rank ${r}: expected 8 pieces, found ${clusters.length}`);
    clusters.forEach((cl, f) => {
      const lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
      const list = [];
      for (const p of cl.parts) { list.push(...p.list); for (let d = 0; d < 3; d++) { lo[d] = Math.min(lo[d], p.lo[d]); hi[d] = Math.max(hi[d], p.hi[d]); } }
      info.push({ r, f, list, height: hi[UP] - lo[UP], centre: [(lo[0] + hi[0]) / 2, (lo[1] + hi[1]) / 2, lo[UP]] });
    });
  }
  // the rank whose pieces are taller on average is the back rank
  const avg = (r) => { const g = info.filter((i) => i.r === r); return g.reduce((s, i) => s + i.height, 0) / g.length; };
  const backRank = avg(0) > avg(1) ? 0 : 1;
  const back = info.filter((i) => i.r === backRank);
  const sorted = [...back].sort((x, y) => y.height - x.height);
  const king = sorted[0], queen = sorted[1];
  for (const i of info) {
    if (i.r !== backRank) { i.type = 'pawn'; continue; }
    if (i === king) i.type = 'king';
    else if (i === queen) i.type = 'queen';
    else if (i.f === 0 || i.f === 7) i.type = 'rook';
    else if (i.f === 1 || i.f === 6) i.type = 'knight';
    else i.type = 'bishop';
  }
  // one node per piece, re-centred on its base. (Empty marker nodes would not survive prune().)
  const material = prim.getMaterial();
  for (const i of info) {
    const remap = new Map();
    const order = [];
    for (const vi of i.list) if (!remap.has(vi)) { remap.set(vi, order.length); order.push(vi); }
    const newPrim = doc.createPrimitive().setMaterial(material);
    for (const [sem, acc] of attrs) {
      const size = acc.getElementSize();
      const arr = new Float32Array(order.length * size);
      const el = new Array(size);
      order.forEach((vi, n) => {
        acc.getElement(vi, el);
        if (sem === 'POSITION') { el[0] -= i.centre[0]; el[1] -= i.centre[1]; el[2] -= i.centre[2]; }
        arr.set(el, n * size);
      });
      newPrim.setAttribute(sem, doc.createAccessor().setType(acc.getType()).setArray(arr).setBuffer(buffer));
    }
    newPrim.setIndices(doc.createAccessor().setType('SCALAR').setArray(new Uint32Array(i.list.map((vi) => remap.get(vi)))).setBuffer(buffer));
    const name = `${color}-${i.type}-${i.f}`;
    setRoot.addChild(doc.createNode(name).setMesh(doc.createMesh(name).addPrimitive(newPrim)).setTranslation(i.centre));
  }
  node.dispose();
  console.log(color, 'pieces:', info.map((i) => `${i.type}@${i.f}`).join(' '), 'square=', sq.toFixed(3));
}

// Z-up source → Y-up glTF: one root node rotated -90° about X holds everything
const setRoot = doc.createNode('set').setRotation([-Math.SQRT1_2, 0, 0, Math.SQRT1_2]);
scene.addChild(setRoot);
for (const node of [...root.listNodes()]) {
  const n = node.getName();
  if (n.includes('figures_white')) splitBySquare(node, 'white');
  else if (n.includes('figures_black')) splitBySquare(node, 'black');
  else if (n.includes('game_desk')) { node.setName('board'); scene.removeChild(node); setRoot.addChild(node); }
}
await finish(doc, 'set.glb', 1024);
