// Compresses work films, extracts poster frames, and copies logos and fonts into public/ and app/fonts.
// Source: _assets-source/ next to package.json (not committed), or set ASSET_ROOT.
//   site/   original films, client logos, brand logos and favicon from the previous site
//   fonts/  Hertloom and Helvena from Envato
// Usage: npm run assets:media
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, copyFileSync, readdirSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import ffmpeg from 'ffmpeg-static';
import sharp from 'sharp';

const ROOT = process.env.ASSET_ROOT ?? path.resolve('_assets-source');
const SITE = path.join(ROOT, 'site');
const FONTS = path.join(ROOT, 'fonts');
const TMP = mkdtempSync(path.join(tmpdir(), 'cbs-media-'));
for (const dir of ['public/media', 'public/clients', 'public/brand', 'app/fonts']) mkdirSync(dir, { recursive: true });

const films = {
  'kiran-heart-transplant': 'kiran-heart-transplant.mp4',
  'gagme-tyla': 'gagme-tyla-final2.mp4',
  'topboy-event': 'topboy-event.mp4',
  '1990-fast-cut': '1990-fast-cut-final.mp4',
};

for (const [slug, file] of Object.entries(films)) {
  const src = path.join(SITE, file);
  const out = `public/media/${slug}.mp4`;
  const frame = path.join(TMP, `${slug}.png`);
  execFileSync(ffmpeg, ['-y', '-i', src, '-vf', "scale=-2:'min(1280,ih)'", '-c:v', 'libx264', '-preset', 'slow', '-crf', '28', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', out], { stdio: 'pipe' });
  execFileSync(ffmpeg, ['-y', '-ss', '2', '-i', src, '-frames:v', '1', '-vf', "scale='min(1600,iw)':-2", frame], { stdio: 'pipe' });
  await sharp(frame).webp({ quality: 78 }).toFile(`public/media/${slug}.webp`);
  console.log(slug, (statSync(src).size / 1e6).toFixed(1), 'MB ->', (statSync(out).size / 1e6).toFixed(1), 'MB');
}

const clients = ['1990-black-logo', 'b-him-logo', 'frameboxx-logo', 'kc-fixit-logo', 'kiran-hospital-logo', 'kiran-solar-logo', 'macwin-logo', 'minicub-s', 'netcarat-logo', 'sajori-logo', 'the-grind-logo', 'topby-pizza-logo', 'z-eggss-logo'];
for (const c of clients) {
  await sharp(path.join(SITE, 'client-logos', `${c}.png`)).resize({ width: 400, withoutEnlargement: true }).webp({ quality: 88 }).toFile(`public/clients/${c}.webp`);
}
for (const l of ['logo', 'logo_white']) {
  await sharp(path.join(SITE, `${l}.png`)).resize({ width: 960 }).png({ compressionLevel: 9 }).toFile(`public/brand/${l}.png`);
}
copyFileSync(path.join(SITE, 'favicon.svg'), 'app/icon.svg');

copyFileSync(path.join(FONTS, 'hertloom/Web-TT/Hertloom-Regular.woff2'), 'app/fonts/Hertloom-Regular.woff2');
for (const w of ['Regular', 'Medium']) {
  copyFileSync(path.join(FONTS, `helvena/Helvena Font File/WOFF2/Helvena-${w}.woff2`), `app/fonts/Helvena-${w}.woff2`);
}
console.log('media done:', readdirSync('public/media').join(', '));
