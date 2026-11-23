import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const alt = 'Chessboard Strategy: growth, planned like a game of chess';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OG() {
  const font = await readFile(path.join(process.cwd(), 'app/fonts/Hertloom-Regular.ttf'));
  const squares = Array.from({ length: 64 }, (_, i) => i);
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: '#12110f', color: '#efe9de', padding: 72, fontFamily: 'Hertloom' }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
          <div style={{ fontSize: 30, color: '#aaa398' }}>Chessboard Strategy</div>
          <div style={{ fontSize: 92, lineHeight: 1, maxWidth: 640 }}>Growth, planned like a game of chess</div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', width: 384, height: 384, alignSelf: 'center' }}>
          {squares.map((i) => {
            const r = Math.floor(i / 8);
            const c = i % 8;
            const bg = r === 2 && c === 5 ? '#9966ff' : (r + c) % 2 === 0 ? '#2a2723' : '#1c1a17';
            return <div key={i} style={{ width: 48, height: 48, background: bg }} />;
          })}
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: 'Hertloom', data: font, weight: 400, style: 'normal' }] },
  );
}
