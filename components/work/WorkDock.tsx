'use client';

import { useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent } from 'react';
import { TLink } from '@/components/motion/BoardTransition';
import { Film } from '@/components/work/Film';
import { WorkLogo } from '@/components/work/WorkLogo';
import { prefersReducedMotion } from '@/lib/gsap';
import type { Work } from '@/lib/content';

/** How many times larger the square under the pointer grows, and how far (in squares) the swell reaches. */
const MAG = 2.6;
const SPREAD = 0.9;
const LIGHT = '#1f1f1f';
const DARK = '#141414';
const HEADER_HEIGHT = 88;

type Spot = { col: number; row: number };
type Plan = { s: number; cols: number; rows: number; left: number; top: number; spots: Spot[] };

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

function random(seed: number) {
  let s = (seed % 2147483646) + 1;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

/**
 * Square size, board size and a random square for every work. Squares stay square: the board is cut at the
 * edges instead of stretched. The size shrinks until every work fits on a fully visible square, with room to spare.
 */
function layout(width: number, height: number, count: number, seed: number): Plan {
  const measure = (s: number) => {
    const cols = Math.ceil(width / s);
    const rows = Math.ceil(height / s);
    const left = (width - cols * s) / 2;
    const top = (height - rows * s) / 2;
    // a square counts as visible when no more than 15% of it is cut off
    const visible = (n: number, start: number, limit: number) =>
      Array.from({ length: n }, (_, i) => i).filter((i) => start + i * s >= -s * 0.15 && start + (i + 1) * s <= limit + s * 0.15);
    // Draw the board behind the fixed header and keep clickable tiles clear of it.
    const visRows = visible(rows, top, height).filter((row) => top + row * s >= HEADER_HEIGHT);
    return { s, cols, rows, left, top, visCols: visible(cols, left, width), visRows };
  };

  const largest = Math.floor(Math.min(260, Math.max(64, Math.min(width, height) / 2.4)));
  let chosen: ReturnType<typeof measure> | undefined;
  for (const need of [Math.max(count * 2.2, count + 4), count]) {
    for (let s = largest; s >= 28 && !chosen; s -= 2) {
      const m = measure(s);
      if (m.visCols.length * m.visRows.length >= need) chosen = m;
    }
    if (chosen) break;
  }
  const g = chosen ?? measure(28);

  const rand = random(seed);
  const cells: Spot[] = [];
  for (const row of g.visRows) for (const col of g.visCols) cells.push({ col, row });
  for (let i = cells.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [cells[i], cells[j]] = [cells[j], cells[i]];
  }

  // first pass keeps works off side-by-side squares so each one has room to swell; the second fills any remainder
  const taken = new Set<string>();
  const key = (c: number, r: number) => `${c}:${r}`;
  const spots: Spot[] = [];
  const take = (c: Spot) => {
    taken.add(key(c.col, c.row));
    spots.push(c);
  };
  for (const c of cells) {
    if (spots.length >= count) break;
    const crowded = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dc, dr]) => taken.has(key(c.col + dc, c.row + dr)));
    if (!crowded) take(c);
  }
  for (const c of cells) {
    if (spots.length >= count) break;
    if (!taken.has(key(c.col, c.row))) take(c);
  }

  return { s: g.s, cols: g.cols, rows: g.rows, left: g.left, top: g.top, spots };
}

function erf(x: number) {
  const t = 1 / (1 + 0.3275911 * Math.abs(x));
  const y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
  return x >= 0 ? y : -y;
}

/**
 * Track sizes for one axis of the board, like the macOS Dock: squares near the pointer (p, in squares) swell
 * `mag` times and the rest give up the room. The pointer and the board's edges never move, so the square
 * under the pointer stays under it.
 */
function tracks(n: number, s: number, p: number, mag: number) {
  if (mag <= 1.0005) return `repeat(${n}, ${s}px)`;
  const k = (mag - 1) * SPREAD * Math.sqrt(Math.PI / 2);
  const F = (u: number) => u + k * erf((u - p) / (SPREAD * Math.SQRT2));
  const F0 = F(0);
  const Fp = F(p);
  const Fn = F(n);
  const px = p * s;
  const total = n * s;
  const at = (u: number) => (u <= p ? px - ((Fp - F(u)) / (Fp - F0)) * px : px + ((F(u) - Fp) / (Fn - Fp)) * (total - px));
  const out: string[] = [];
  let prev = 0;
  for (let i = 1; i <= n; i++) {
    const edge = i === n ? total : at(i);
    out.push(`${(edge - prev).toFixed(2)}px`);
    prev = edge;
  }
  return out.join(' ');
}

type TileHandlers = {
  onPointerEnter: (e: ReactPointerEvent<HTMLAnchorElement>) => void;
  onPointerLeave: (e: ReactPointerEvent<HTMLAnchorElement>) => void;
  onClick: (e: ReactMouseEvent<HTMLAnchorElement>) => void;
  onFocus: () => void;
  onBlur: () => void;
};

function Tile({ w, spot, plan, active, armed, handlers }: { w: Work; spot: Spot; plan: Plan; active: boolean; armed: boolean; handlers: TileHandlers }) {
  const left = spot.col === 0 ? -plan.left : 0;
  const right = spot.col === plan.cols - 1 ? -plan.left : 0;
  const bottom = spot.row === plan.rows - 1 ? -plan.top : 0;

  return (
    <TLink
      href={`/work/${w.slug}`}
      prefetch={false}
      data-work
      aria-label={w.title === w.client ? `${w.client}, ${w.kind}` : `${w.client}, ${w.kind}: ${w.title}`}
      style={{ gridColumn: spot.col + 1, gridRow: spot.row + 1, paddingLeft: left, paddingRight: right, paddingBottom: bottom }}
      className="relative z-[2] block overflow-hidden bg-box-2 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-move"
      {...handlers}
    >
      <WorkLogo client={w.client} projectLogo={w.logo} />
      {active && (
        <div className="pointer-events-none absolute inset-0">
          <Film src={w.video} className="size-full" />
        </div>
      )}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${active ? 'opacity-100' : 'opacity-0'}`}
        style={{ background: 'linear-gradient(to top, rgb(11 11 11 / 0.85), rgb(11 11 11 / 0) 55%)' }}
      />
      <span aria-hidden="true" className={`pointer-events-none absolute inset-0 ring-2 ring-inset ring-move transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-0'}`} />
      <span aria-hidden="true" className="absolute top-0 block size-2.5 bg-move" style={{ left }} />
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute p-[7%] text-chalk transition-[opacity,transform] duration-500 ease-[var(--ease-move)] ${active ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}
        style={{ left, right, bottom }}
      >
        <span className="block truncate text-[12px] text-chalk-2">{armed ? 'Tap again to open' : w.kind}</span>
        <span className="display mt-1 block truncate text-[clamp(16px,1.6vw,26px)] leading-[1.05]">{w.client}</span>
      </span>
    </TLink>
  );
}

/** The work page board: every case on a random square of a full-screen board, magnified like a dock on hover. */
export function WorkDock({ items }: { items: Work[] }) {
  const area = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const spot = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const [seed] = useState(() => Math.floor(Math.random() * 2147483646));
  const [active, setActive] = useState<number | null>(null);
  const [armed, setArmed] = useState<number | null>(null);

  const plan = useMemo(() => (size ? layout(size.w, size.h, items.length, seed) : null), [size, items.length, seed]);
  const planRef = useRef<Plan | null>(null);
  const reduced = useRef(false);
  const pointerType = useRef('mouse');
  const pressing = useRef(false);
  const m = useRef({ x: 0, y: 0, tx: 0, ty: 0, amt: 0, target: 0, raf: 0, last: 0 });

  useEffect(() => {
    reduced.current = prefersReducedMotion();
  }, []);

  useEffect(() => {
    const el = area.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize((s) => (s && Math.abs(s.w - width) < 1 && Math.abs(s.h - height) < 1 ? s : { w: width, h: height }));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const draw = () => {
    const p = planRef.current;
    const g = grid.current;
    if (!p || !g) return;
    const st = m.current;
    const mag = 1 + (MAG - 1) * st.amt;
    g.style.gridTemplateColumns = tracks(p.cols, p.s, st.x, mag);
    g.style.gridTemplateRows = tracks(p.rows, p.s, st.y, mag);
  };

  const kick = () => {
    const st = m.current;
    if (st.raf) return;
    st.last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.05, (now - st.last) / 1000);
      st.last = now;
      const follow = 1 - Math.exp(-dt * 14);
      st.x += (st.tx - st.x) * follow;
      st.y += (st.ty - st.y) * follow;
      st.amt += (st.target - st.amt) * (1 - Math.exp(-dt * 9));
      const settled = Math.abs(st.tx - st.x) < 0.001 && Math.abs(st.ty - st.y) < 0.001 && Math.abs(st.target - st.amt) < 0.002;
      if (settled) {
        st.x = st.tx;
        st.y = st.ty;
        st.amt = st.target;
      }
      draw();
      st.raf = settled ? 0 : requestAnimationFrame(step);
    };
    st.raf = requestAnimationFrame(step);
  };

  // a new layout starts flat, centred, with no swell
  useEffect(() => {
    planRef.current = plan;
    const st = m.current;
    cancelAnimationFrame(st.raf);
    st.raf = 0;
    if (plan) {
      st.x = st.tx = plan.cols / 2;
      st.y = st.ty = plan.rows / 2;
      st.amt = st.target = 0;
    }
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan]);

  useEffect(() => () => cancelAnimationFrame(m.current.raf), []);

  /** Swell the board around a point given in squares from the board's top-left corner. */
  const focusAt = (x: number, y: number) => {
    const p = planRef.current;
    if (!p) return;
    const st = m.current;
    st.tx = clamp(x, 0.001, p.cols - 0.001);
    st.ty = clamp(y, 0.001, p.rows - 0.001);
    if (st.amt < 0.02) {
      st.x = st.tx;
      st.y = st.ty;
    }
    st.target = reduced.current ? 0 : 1;
    kick();
  };

  const release = () => {
    m.current.target = 0;
    kick();
    if (spot.current) spot.current.style.opacity = '0';
  };

  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const p = planRef.current;
    const g = grid.current;
    if (!p || !g) return;
    const r = g.getBoundingClientRect();
    focusAt((e.clientX - r.left) / p.s, (e.clientY - r.top) / p.s);
    if (spot.current) {
      spot.current.style.opacity = '1';
      spot.current.style.setProperty('--mx', `${e.clientX - r.left}px`);
      spot.current.style.setProperty('--my', `${e.clientY - r.top}px`);
    }
  };

  const onAreaDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    pointerType.current = e.pointerType;
    pressing.current = true;
    // a tap on an empty square puts the board back
    if (e.pointerType === 'touch' && !(e.target as Element).closest('[data-work]')) {
      setArmed(null);
      setActive(null);
      release();
    } else onMove(e);
  };

  const onAreaLeave = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return;
    setActive(null);
    release();
  };

  const handlersFor = (i: number, s: Spot): TileHandlers => ({
    onPointerEnter: (e) => {
      if (e.pointerType !== 'touch') setActive(i);
    },
    onPointerLeave: (e) => {
      if (e.pointerType !== 'touch') setActive((a) => (a === i ? null : a));
    },
    // on touch the first tap previews the work and the second opens it
    onClick: (e) => {
      if (e.detail > 0 && pointerType.current === 'touch' && armed !== i) {
        e.preventDefault();
        setArmed(i);
        setActive(i);
        focusAt(s.col + 0.5, s.row + 0.5);
      }
    },
    onFocus: () => {
      if (!pressing.current) {
        setActive(i);
        focusAt(s.col + 0.5, s.row + 0.5);
      }
    },
    onBlur: () => {
      setActive((a) => (a === i ? null : a));
      if (!pressing.current) release();
    },
  });

  useEffect(() => {
    const up = () => (pressing.current = false);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    return () => {
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
  }, []);

  const squares = useMemo(() => {
    if (!plan) return [];
    const out: Spot[] = [];
    for (let row = 0; row < plan.rows; row++) for (let col = 0; col < plan.cols; col++) out.push({ col, row });
    return out;
  }, [plan]);

  const shown = plan ? items.slice(0, plan.spots.length) : [];

  return (
    <section data-tone="dark" aria-label="Work chessboard" className="work-board h-svh bg-ebony text-chalk">
      <div
        ref={area}
        className="relative h-full touch-pan-y overflow-hidden"
        onPointerMove={(e) => e.pointerType !== 'touch' && onMove(e)}
        onPointerDown={onAreaDown}
        onPointerLeave={onAreaLeave}
      >
        {plan && (
          <div
            ref={grid}
            className="absolute grid"
            style={{
              left: plan.left,
              top: plan.top,
              width: plan.cols * plan.s,
              height: plan.rows * plan.s,
              gridTemplateColumns: `repeat(${plan.cols}, ${plan.s}px)`,
              gridTemplateRows: `repeat(${plan.rows}, ${plan.s}px)`,
            }}
          >
            {squares.map(({ col, row }) => (
              <div key={`${col}:${row}`} aria-hidden="true" style={{ gridColumn: col + 1, gridRow: row + 1, background: (col + row) % 2 ? DARK : LIGHT }} />
            ))}
            <div
              ref={spot}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-[1] opacity-0 transition-opacity duration-500"
              style={{ background: 'radial-gradient(circle 320px at var(--mx, 50%) var(--my, 50%), rgb(153 102 255 / 0.16), transparent)' }}
            />
            {shown.map((w, i) => (
              <Tile key={w.slug} w={w} spot={plan.spots[i]} plan={plan} active={active === i} armed={armed === i} handlers={handlersFor(i, plan.spots[i])} />
            ))}
          </div>
        )}
      </div>

    </section>
  );
}
