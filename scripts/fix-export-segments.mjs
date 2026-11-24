import { readdir, rename } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

// Next.js writes nested segment payloads on Windows, but the router requests dotted filenames.
// https://github.com/vercel/next.js/issues/85374
if (process.platform === 'win32') {
  const output = 'out';
  for (const entry of await readdir(output, { recursive: true, withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.txt')) continue;

    const directories = relative(output, entry.parentPath).split(sep);
    const segmentRoot = directories.findIndex((name) => name.startsWith('__next.'));
    if (segmentRoot === -1) continue;

    const route = join(output, ...directories.slice(0, segmentRoot));
    const filename = [...directories.slice(segmentRoot), entry.name].join('.');
    await rename(join(entry.parentPath, entry.name), join(route, filename));
  }
}
