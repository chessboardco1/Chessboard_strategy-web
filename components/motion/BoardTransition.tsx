'use client';

import Link, { type LinkProps } from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useRef, type AnchorHTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';

type Navigate = (href: string, origin?: { x: number; y: number }) => void;
const TransitionContext = createContext<Navigate | null>(null);

export function BoardTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const gridRef = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const waiting = useRef(false);
  const revealTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const wave = useRef<gsap.core.Tween | undefined>(undefined);
  const stagger = useRef({ grid: [0, 0] as [number, number], from: 0, amount: 0.22 });

  const reveal = useCallback(() => {
    const grid = gridRef.current;
    if (!grid || !waiting.current) return;
    waiting.current = false;
    clearTimeout(revealTimer.current);
    wave.current = gsap.to(Array.from(grid.children), {
      scale: 0,
      duration: 0.36,
      ease: 'power3.inOut',
      stagger: stagger.current,
      onComplete: () => {
        grid.style.visibility = 'hidden';
        grid.replaceChildren();
        busy.current = false;
      },
    });
  }, []);

  const navigate: Navigate = useCallback(
    (href, origin) => {
      if (busy.current) return;
      const grid = gridRef.current;
      const target = new URL(href, window.location.href);
      if (!grid || target.pathname === window.location.pathname || prefersReducedMotion()) {
        router.push(href);
        return;
      }

      busy.current = true;
      const width = grid.clientWidth;
      const height = grid.clientHeight;
      const size = Math.max(1, Math.ceil(Math.min(width, height) / (width < 640 ? 6 : 8)));
      const columns = Math.ceil(width / size);
      const rows = Math.ceil(height / size);
      const col = origin ? gsap.utils.clamp(0, columns - 1, Math.floor(origin.x / size)) : columns - 1;
      const row = origin ? gsap.utils.clamp(0, rows - 1, Math.floor(origin.y / size)) : 0;
      const from = row * columns + col;
      stagger.current = { grid: [rows, columns], from, amount: width < 640 ? 0.17 : 0.22 };

      grid.style.gridTemplateColumns = `repeat(${columns}, ${size}px)`;
      grid.style.gridAutoRows = `${size}px`;
      const list = Array.from({ length: rows * columns }, (_, i) => {
        const tile = document.createElement('div');
        tile.style.backgroundColor = i === from
          ? 'var(--color-move)'
          : (Math.floor(i / columns) + i % columns) % 2 ? 'var(--color-ebony-2)' : 'var(--color-ebony)';
        return tile;
      });
      grid.replaceChildren(...list);
      grid.style.visibility = 'visible';
      wave.current = gsap.fromTo(
        list,
        { scale: 0 },
        {
          scale: 1.005,
          duration: 0.34,
          ease: 'power3.inOut',
          stagger: stagger.current,
          onComplete: () => {
            waiting.current = true;
            revealTimer.current = setTimeout(reveal, 1800);
            router.push(href);
          },
        },
      );
    },
    [reveal, router],
  );

  useEffect(() => {
    reveal();
  }, [pathname, reveal]);

  useEffect(() => () => {
    clearTimeout(revealTimer.current);
    wave.current?.kill();
  }, []);

  return (
    <TransitionContext.Provider value={navigate}>
      {children}
      <div
        ref={gridRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[100] grid content-start overflow-hidden"
        style={{ visibility: 'hidden' }}
      />
    </TransitionContext.Provider>
  );
}

type TLinkProps = LinkProps & AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode };

/** Internal link that plays the board transition. External and hash links behave normally. */
export function TLink({ href, onClick, children, ...rest }: TLinkProps) {
  const navigate = useContext(TransitionContext);
  const url = typeof href === 'string' ? href : ((href as { pathname?: string }).pathname ?? '/');
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || !navigate) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (url.startsWith('#') || /^(https?:|mailto:|tel:)/.test(url)) return;
    e.preventDefault();
    navigate(url, e.detail ? { x: e.clientX, y: e.clientY } : undefined);
  };
  return (
    <Link href={href} onClick={handle} {...rest}>
      {children}
    </Link>
  );
}
