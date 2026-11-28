import { readdir } from 'node:fs/promises';
import { extname, join } from 'node:path';
import type { Work } from './content';

export type WorkReel = {
  src: string;
  poster?: string;
  label: string;
};

const videoExtensions = new Set(['.mp4', '.webm']);
const posterExtensions = new Set(['.webp', '.jpg', '.jpeg', '.png', '.avif']);
const filenameOrder = new Intl.Collator('en', { numeric: true });

async function getFiles(...folders: string[]) {
  const directory = join(process.cwd(), 'public', ...folders);
  const entries = await readdir(directory, { withFileTypes: true }).catch((error: NodeJS.ErrnoException) => {
    if (error.code === 'ENOENT') return [];
    throw error;
  });
  return entries.filter((entry) => entry.isFile()).map((entry) => entry.name).sort(filenameOrder.compare);
}

// Case pages are statically exported, so directory discovery runs during the build.
export async function getWorkReels(work: Work): Promise<WorkReel[]> {
  const lead = { src: work.video, poster: work.poster, label: work.kind };
  const [videoFiles, posterFiles] = await Promise.all([
    getFiles('videos', 'work', work.slug),
    getFiles('images', 'posters', 'work', work.slug),
  ]);
  const posters = new Map<string, string>();

  for (const name of posterFiles) {
    const extension = extname(name).toLowerCase();
    if (posterExtensions.has(extension)) posters.set(name.slice(0, -extension.length).toLowerCase(), name);
  }

  const folder = encodeURIComponent(work.slug);
  const videoUrl = (file: string) => `/videos/work/${folder}/${encodeURIComponent(file)}`;
  const extra = videoFiles
    .filter((file) => videoExtensions.has(extname(file).toLowerCase()) && videoUrl(file) !== lead.src)
    .map((file, index) => {
      const poster = posters.get(file.slice(0, -extname(file).length).toLowerCase());
      return {
        src: videoUrl(file),
        poster: poster ? `/images/posters/work/${folder}/${encodeURIComponent(poster)}` : undefined,
        label: `Reel ${index + 2}`,
      };
    });

  return [lead, ...extra];
}
