import { statSync } from 'node:fs';
import { Document, NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS, EXTTextureWebP } from '@gltf-transform/extensions';
import { copyToDocument, dequantize, getBounds, meshopt, prune, simplify, unpartition } from '@gltf-transform/functions';
import { MeshoptDecoder, MeshoptEncoder, MeshoptSimplifier } from 'meshoptimizer';
import sharp from 'sharp';
import { Matrix4 } from 'three';

// Reuses the committed board and piece library, so the licensed source files aren't needed.
await Promise.all([MeshoptDecoder.ready, MeshoptEncoder.ready, MeshoptSimplifier.ready]);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'meshopt.decoder': MeshoptDecoder,
  'meshopt.encoder': MeshoptEncoder,
});
const [set, pieces] = await Promise.all([
  io.read('public/models/set.glb'),
  io.read('public/models/pieces-v2.glb'),
]);

await set.transform(dequantize());
await pieces.transform(
  dequantize(),
  simplify({ simplifier: MeshoptSimplifier, ratio: 0.08, error: 0.003 }),
);

const setRoot = set.getRoot().listNodes().find((node) => node.getName() === 'set');
const sourceBoard = setRoot?.listChildren().find((node) => node.getName() === 'board');
if (!sourceBoard) throw new Error('The full set must contain a board under the set node.');
const { min, max } = getBounds(sourceBoard);
const scale = 4 / Math.max(max[0] - min[0], max[2] - min[2]);
const centerX = (max[0] + min[0]) / 2;
const centerZ = (max[2] + min[2]) / 2;
const normalize = new Matrix4().makeScale(scale, scale, scale).setPosition(-centerX * scale, -max[1] * scale, -centerZ * scale);

const spots = setRoot.listChildren().filter((node) => /^(white|black)-/.test(node.getName())).map((node) => {
  const [color, type, file] = node.getName().split('-');
  const bounds = getBounds(node);
  return {
    color, type, file: Number(file),
    x: ((bounds.min[0] + bounds.max[0]) / 2 - centerX) * scale,
    z: ((bounds.min[2] + bounds.max[2]) / 2 - centerZ) * scale,
  };
});
const firstRank = spots.filter(({ color, type }) => color === 'white' && (type === 'rook' || type === 'knight'))
  .sort((a, b) => a.x - b.x);
if (firstRank.length < 2) throw new Error('The full set must contain the original piece positions.');
const squareSize = firstRank[1].x - firstRank[0].x;

const output = new Document();
output.createExtension(EXTTextureWebP).setRequired(true);
const scene = output.createScene('growth-board');
const board = copyToDocument(output, set, [sourceBoard]).get(sourceBoard);
board.setMatrix(normalize.multiply(new Matrix4().fromArray(sourceBoard.getWorldMatrix())).toArray());
scene.addChild(board);
scene.setExtras({ spots, squareSize, boardBottom: (min[1] - max[1]) * scale });

const material = board.getMesh().listPrimitives()[0].getMaterial();
const texture = material.getBaseColorTexture();
texture.setImage(await sharp(texture.getImage()).resize(512, 512, { fit: 'inside' }).webp({ quality: 82 }).toBuffer());

const library = output.createNode('piece-library');
scene.addChild(library);
const templates = pieces.getRoot().listScenes()[0].listChildren();
const copied = copyToDocument(output, pieces, templates);
for (const template of templates) library.addChild(copied.get(template));

await output.transform(unpartition(), prune(), meshopt({ encoder: MeshoptEncoder, level: 'high' }));
const file = 'public/models/growth-board.glb';
await io.write(file, output);
console.log(`${file} (${Math.round(statSync(file).size / 1024)} KiB)`);
