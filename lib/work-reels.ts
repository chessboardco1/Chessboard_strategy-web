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

// Case pages are statically exported, so directory discovery runs during the build.
export async function getWorkReels(work: Work): Promise<WorkReel[]> {
  const lead = { src: work.video, poster: work.poster, label: work.kind };
  const folder = work.reelFolder ?? work.slug;
  const directory = join(process.cwd(), 'public', 'media', folder);
  const entries = await readdir(directory, { withFileTypes: true }).catch((error: NodeJS.ErrnoException) => {
    if (error.code === 'ENOENT') return [];
    throw error;
  });
  const files = entries.filter((entry) => entry.isFile()).map((entry) => entry.name).sort(filenameOrder.compare);
  const posters = new Map<string, string>();
  const videos: string[] = [];

  for (const name of files) {
    const extension = extname(name).toLowerCase();
    const stem = name.slice(0, -extension.length).toLowerCase();
    if (posterExtensions.has(extension)) posters.set(stem, name);
    if (videoExtensions.has(extension)) videos.push(name);
  }

  const url = (file: string) => `/media/${encodeURIComponent(folder)}/${encodeURIComponent(file)}`;
  const extra = videos.filter((file) => url(file) !== lead.src).map((file, index) => {
    const poster = posters.get(file.slice(0, -extname(file).length).toLowerCase());
    return { src: url(file), poster: poster ? url(poster) : undefined, label: `Reel ${index + 2}` };
  });

  return [lead, ...extra];
}
