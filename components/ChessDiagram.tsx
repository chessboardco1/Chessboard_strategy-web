import type { PieceType } from '@/lib/content';

/**
 * A flat chess diagram drawn in SVG. Pieces are simple shapes made in code, so every note can have
 * its own position without a photo. When `play` is true the listed moves slide to their squares
 * and both squares of each move turn purple; when it turns false they slide back.
 */

const LETTER: Record<string, PieceType> = { k: 'king', q: 'queen', r: 'rook', b: 'bishop', n: 'knight', p: 'pawn' };

// Each shape is drawn in a 100-unit square. Everything is filled with one colour and outlined.
const SHAPES: Record<PieceType, string> = {
  pawn: 'M38 76 L43 48 L36 48 L36 42 L41 42 A12 12 0 1 1 59 42 L64 42 L64 48 L57 48 L62 76 Z',
  rook: 'M34 76 L37 42 L31 42 L31 22 L39 22 L39 28 L46 28 L46 22 L54 22 L54 28 L61 28 L61 22 L69 22 L69 42 L63 42 L66 76 Z',
  bishop: 'M38 76 L44 56 L37 56 L37 51 L43 51 C32 46 34 32 50 21 C66 32 68 46 57 51 L63 51 L63 56 L56 56 L62 76 Z M50 9 A5 5 0 1 0 50.01 9 Z',
  knight: 'M33 76 L37 60 L29 54 C26 50 27 46 31 44 L43 34 L44 22 L51 29 C64 30 71 42 69 56 L67 76 Z',
  queen: 'M36 76 L42 48 L33 48 L27 24 L39 37 L44 19 L50 34 L56 19 L61 37 L73 24 L67 48 L58 48 L64 76 Z',
  king: 'M36 76 L42 47 L35 47 C30 36 36 28 47 31 L47 24 L42 24 L42 18 L47 18 L47 12 L53 12 L53 18 L58 18 L58 24 L53 24 L53 31 C64 28 70 36 65 47 L58 47 L64 76 Z',
};

type Placed = { id: string; type: PieceType; white: boolean; at: string };

const file = (sq: string) => sq.charCodeAt(0) - 97;
const rank = (sq: string) => Number(sq[1]);
const xy = (sq: string) => ({ x: file(sq), y: 8 - rank(sq) });

function parsePosition(position: string): Placed[] {
  return position
    .trim()
    .split(/\s+/)
    .map((tok, i) => ({ id: `${tok}-${i}`, type: LETTER[tok[0].toLowerCase()], white: tok[0] === tok[0].toUpperCase(), at: tok.slice(1) }));
}

export function ChessDiagram({
  position,
  moves = [],
  play = false,
  tone = 'light',
  highlight,
  className = '',
  title,
}: {
  position: string;
  moves?: [string, string][];
  play?: boolean;
  tone?: 'light' | 'dark';
  /** squares to mark purple regardless of play, e.g. the selected team member */
  highlight?: string[];
  className?: string;
  /** accessible description; omit to hide the diagram from assistive tech */
  title?: string;
}) {
  const pieces = parsePosition(position);
  const light = tone === 'light' ? '#e5ddcf' : '#2a2723';
  const dark = tone === 'light' ? '#c9bba3' : '#1c1a17';
  const marked = new Set([...(highlight ?? []), ...(play ? moves.flat() : [])]);
  const ease = 'cubic-bezier(0.22, 1, 0.36, 1)';

  return (
    <svg
      viewBox="0 0 8 8"
      className={`block aspect-square w-full ${className}`}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      shapeRendering="geometricPrecision"
    >
      {Array.from({ length: 64 }, (_, i) => {
        const x = i % 8;
        const y = Math.floor(i / 8);
        const sq = String.fromCharCode(97 + x) + (8 - y);
        return (
          <g key={sq}>
            <rect x={x} y={y} width={1} height={1} fill={(x + y) % 2 ? dark : light} />
            <rect
              x={x}
              y={y}
              width={1}
              height={1}
              fill="#9966ff"
              style={{ opacity: marked.has(sq) ? 1 : 0, transition: `opacity 0.5s ${ease} ${play ? '0.25s' : '0s'}` }}
            />
          </g>
        );
      })}
      {pieces.map((p) => {
        const to = play ? moves.find(([from]) => from === p.at)?.[1] : undefined;
        const { x, y } = xy(to ?? p.at);
        return (
          <g key={p.id} style={{ transform: `translate(${x}px, ${y}px)`, transition: `transform 0.75s ${ease}` }}>
            <path
              d={SHAPES[p.type]}
              transform="translate(-0.075 -0.075) scale(0.0115)"
              fill={p.white ? '#f8f3ea' : '#12110f'}
              stroke={p.white ? '#12110f' : tone === 'dark' ? '#8a847a' : '#12110f'}
              strokeWidth={p.white ? 3.2 : 2}
              strokeLinejoin="round"
            />
          </g>
        );
      })}
    </svg>
  );
}
