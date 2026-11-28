'use client';

import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import type { WorkReel } from '@/lib/work-reels';
import styles from './CaseReels.module.css';

export function CaseReels({ client, reels }: { client: string; reels: WorkReel[] }) {
  const player = useRef<HTMLVideoElement>(null);
  const [current, setCurrent] = useState(0);
  const reel = reels[current];

  useEffect(() => {
    const video = player.current;
    if (!video) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const threshold = 0.2;
    let visible = false;
    let started = false;
    let resumeOnReturn = false;
    const markStarted = () => { started = true; };
    const update = () => {
      if (!visible || document.hidden) {
        if (!video.paused) {
          resumeOnReturn = true;
          video.pause();
        }
        return;
      }
      if (resumeOnReturn || (!started && !reduced.matches && !connection?.saveData)) {
        started = true;
        resumeOnReturn = false;
        void video.play().catch(() => {});
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.intersectionRatio >= threshold;
      update();
    }, { threshold });
    observer.observe(video);
    video.addEventListener('play', markStarted);
    document.addEventListener('visibilitychange', update);

    return () => {
      observer.disconnect();
      video.removeEventListener('play', markStarted);
      document.removeEventListener('visibilitychange', update);
    };
  }, [reel.src]);

  function playReel(index: number) {
    // Mount the new player while the browser still recognizes the click as user input.
    if (index !== current) flushSync(() => setCurrent(index));
    void player.current?.play().catch(() => {});
  }

  return (
    <section aria-labelledby="case-reels-heading" className={styles.gallery}>
      <div className={styles.header}>
        <h2 id="case-reels-heading" className="display">Project reels</h2>
        {reels.length > 1 && <span className={styles.count} aria-live="polite">Reel {current + 1} of {reels.length}</span>}
      </div>

      <div className={styles.stage}>
        {reel.poster && <img src={reel.poster} alt="" loading="lazy" decoding="async" className={styles.backdrop} />}
        <video
          key={reel.src}
          ref={player}
          id="case-reel-player"
          src={reel.src}
          poster={reel.poster}
          aria-label={`${client}, ${reel.label}`}
          controls
          muted
          loop
          playsInline
          preload="none"
        />
      </div>

      {reels.length > 1 && (
        <ul aria-label="Choose a reel" className={styles.choices} data-lenis-prevent-horizontal>
          {reels.map((item, index) => (
            <li key={item.src}>
              <button
                type="button"
                aria-controls="case-reel-player"
                aria-current={index === current ? 'true' : undefined}
                onClick={() => playReel(index)}
              >
                <span className={styles.thumbnail} aria-hidden="true">
                  {item.poster ? <img src={item.poster} alt="" loading="lazy" decoding="async" /> : <span className={styles.play} />}
                </span>
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
