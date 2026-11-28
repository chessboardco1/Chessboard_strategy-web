import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import ffmpeg from 'ffmpeg-static';
import sharp from 'sharp';

const source = path.join(process.env.ASSET_ROOT ?? '_assets-source', 'site');
const sourceVideos = path.join(source, 'videos');
const sourceImages = path.join(source, 'images');
const publicVideos = 'public/videos';
const publicImages = 'public/images';
const filmFormats = new Set(['.mp4', '.mov', '.webm']);
const imageFormats = ['.webp', '.png', '.jpg', '.jpeg', '.avif'];

if (!ffmpeg || !existsSync(ffmpeg)) throw new Error('FFmpeg is required to build media.');
if (!existsSync(sourceVideos)) throw new Error(`Missing media sources in ${sourceVideos}. See docs/ASSETS.md.`);

function runFFmpeg(args) {
  return execFileSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-nostdin', '-y', '-filter_threads', '2', ...args], { maxBuffer: 16 * 1024 * 1024 });
}

function canRemux(input) {
  if (path.extname(input).toLowerCase() !== '.mp4') return false;
  const { stderr } = spawnSync(ffmpeg, ['-hide_banner', '-i', input], { encoding: 'utf8' });
  const video = stderr?.match(/Stream .*?Video: (.*)/)?.[1];
  const audio = stderr?.match(/Stream .*?Audio: (.*)/)?.[1];
  return /^h264 .*\byuv420p\b/.test(video ?? '') && (!audio || audio.startsWith('aac '));
}

function writeVideo(input, output, { filter, crf, rate, audio, duration }) {
  mkdirSync(path.dirname(output), { recursive: true });
  const temp = `${output}.${process.pid}.tmp.mp4`;
  const audioArgs = audio ? ['-map', '0:a:0?', '-c:a', 'aac', '-b:a', '96k'] : ['-an'];
  const durationArgs = duration ? ['-t', String(duration)] : [];

  try {
    runFFmpeg([
      '-i', input, '-map', '0:v:0', ...audioArgs, ...durationArgs, '-vf', filter,
      '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'fast', '-threads', '2',
      '-crf', String(crf), '-maxrate', `${rate}k`, '-bufsize', `${rate * 2}k`, '-movflags', '+faststart', temp,
    ]);
    // Keep a compact H.264 source at its original quality when encoding saves little.
    if (audio && statSync(temp).size >= statSync(input).size * 0.9 && canRemux(input)) {
      runFFmpeg(['-i', input, '-map', '0:v:0', '-map', '0:a:0?', '-c', 'copy', '-movflags', '+faststart', temp]);
    }
    renameSync(temp, output);
  } finally {
    rmSync(temp, { force: true });
  }
}

function fitVideo(size) {
  return `scale=w='min(iw,${size})':h='min(ih,${size})':force_original_aspect_ratio=decrease:force_divisible_by=2,setsar=1`;
}

async function writeWebP(input, output, size, quality) {
  const data = await sharp(input).resize({ width: size, height: size, fit: 'inside', withoutEnlargement: true })
    .webp({ quality }).toBuffer({ resolveWithObject: true });
  mkdirSync(path.dirname(output), { recursive: true });
  const keepWebP = typeof input === 'string' && path.extname(input) === '.webp'
    && statSync(input).size <= data.info.size;
  const original = keepWebP ? await sharp(input).metadata() : null;
  if (original && original.width <= size && original.height <= size) {
    writeFileSync(output, readFileSync(input));
    return;
  }
  writeFileSync(output, data.data);
}

async function buildFilms(folder, work) {
  const directory = path.join(sourceVideos, folder);

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const extension = path.extname(entry.name).toLowerCase();
    if (!entry.isFile() || !filmFormats.has(extension)) continue;

    const stem = path.parse(entry.name).name.toLowerCase();
    const input = path.join(directory, entry.name);
    const output = path.join(publicVideos, folder, `${stem}.mp4`);
    const size = work ? 1280 : stem === 'office-landscape' ? 960 : 720;
    writeVideo(input, output, {
      filter: work ? fitVideo(size) : `fps=24,${fitVideo(size)}`,
      crf: work ? 28 : 29,
      rate: work ? 650 : 400,
      audio: work,
    });

    const posterBase = path.join(sourceImages, 'posters', folder, stem);
    const poster = imageFormats.map((format) => posterBase + format).find((file) => existsSync(file));
    const posterSize = work ? 960 : size;
    const frame = poster ?? runFFmpeg(['-i', input, '-frames:v', '1', '-vf', fitVideo(posterSize), '-f', 'image2pipe', '-vcodec', 'png', 'pipe:1']);
    await writeWebP(frame, path.join(publicImages, 'posters', folder, `${stem}.webp`), posterSize, 76);

    if (work && stem === 'film') {
      const preview = path.join(publicVideos, 'previews', `${path.basename(folder)}.mp4`);
      writeVideo(input, preview, {
        filter: "fps=20,crop='min(iw,ih)':'min(iw,ih)'," + fitVideo(384),
        crf: 28,
        rate: 260,
        audio: false,
        duration: 6,
      });
    }

    console.log(`${output} (${Math.round(statSync(output).size / 1024)} KiB)`);
  }
}

for (const project of readdirSync(path.join(sourceVideos, 'work'), { withFileTypes: true })) {
  if (project.isDirectory()) await buildFilms(path.join('work', project.name), true);
}
await buildFilms('behind-the-scenes', false);

for (const group of ['brand', 'clients']) {
  const directory = path.join(sourceImages, group);
  if (!existsSync(directory)) continue;
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const { name, ext } = path.parse(entry.name);
    if (!entry.isFile() || !imageFormats.includes(ext.toLowerCase())) continue;
    const size = name === 'knights-preview' ? 768 : group === 'brand' ? 480 : 400;
    await writeWebP(path.join(directory, entry.name), path.join(publicImages, group, `${name.toLowerCase()}.webp`), size, 90);
  }
}
