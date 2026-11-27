'use client';

import { useEffect, useRef, useState } from 'react';
import { TLink } from '@/components/motion/BoardTransition';
import { Film } from '@/components/work/Film';
import type { Work } from '@/lib/content';
import styles from './WorkReel.module.css';

type Project = Pick<Work, 'slug' | 'client' | 'kind' | 'poster' | 'video'>;

export function WorkReel({ projects }: { projects: Project[] }) {
  const board = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const scroller = board.current;
    if (!scroller) return;

    function update() {
      if (!scroller) return;
      const start = scroller.scrollLeft < 1;
      const end = scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 1;
      setEdges((previous) => previous.start === start && previous.end === end ? previous : { start, end });
    }

    const observer = new ResizeObserver(update);
    observer.observe(scroller);
    scroller.addEventListener('scroll', update, { passive: true });
    return () => {
      observer.disconnect();
      scroller.removeEventListener('scroll', update);
    };
  }, []);

  function move(direction: number) {
    const scroller = board.current;
    const square = scroller?.querySelector('li')?.offsetWidth;
    if (!scroller || !square) return;

    const columns = Math.max(1, Math.floor(scroller.clientWidth / square) - 1);
    scroller.scrollBy({ left: direction * columns * square });
  }

  return (
    <section id="work" data-tone="light" aria-labelledby="work-title" className={styles.section}>
      <div className={`wrap ${styles.heading}`}>
        <h2 id="work-title" className="display t-l text-ebony">Selected work</h2>
        <TLink href="/work" className="link-line shrink-0 font-medium">All projects</TLink>
      </div>

      <div
        id="selected-work-board"
        ref={board}
        role="region"
        aria-label="Project chessboard"
        tabIndex={0}
        data-lenis-prevent-horizontal
        className={styles.board}
      >
        <ul className={styles.track}>
          {projects.map((project) => (
            <li key={project.slug} className={styles.column}>
              <TLink href={`/work/${project.slug}`} prefetch={false} className={styles.project}>
                <div className={styles.image} aria-hidden="true">
                  <img src={project.poster} alt="" loading="lazy" decoding="async" />
                  <div className={styles.preview}>
                    <Film src={project.video} className="size-full" />
                  </div>
                </div>
                <div className={styles.caption}>
                  <span aria-hidden="true" className={styles.mark} />
                  <span className={styles.kind}>{project.kind}</span>
                  <span className={`display ${styles.client}`}>{project.client}</span>
                </div>
              </TLink>
            </li>
          ))}
        </ul>
      </div>

      <div className={`wrap ${styles.footer}`}>
        <p>{projects.length} case studies</p>
        <div className={styles.controls}>
          <button type="button" aria-controls="selected-work-board" disabled={edges.start} onClick={() => move(-1)}>
            Previous<span className="sr-only"> projects</span>
          </button>
          <button type="button" aria-controls="selected-work-board" disabled={edges.end} onClick={() => move(1)}>
            Next<span className="sr-only"> projects</span>
          </button>
        </div>
      </div>
    </section>
  );
}
