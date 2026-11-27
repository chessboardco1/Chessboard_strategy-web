'use client';

import { useRef, useState } from 'react';
import type { WorkReel } from '@/lib/work-reels';
import styles from './CaseReels.module.css';

export function CaseReels({ client, reels }: { client: string; reels: WorkReel[] }) {
  const player = useRef<HTMLVideoElement>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const current = selected ?? 0;
  const reel = reels[current];

  function playReel(index: number) {
    if (index === current) {
      player.current?.play().catch(() => {});
      return;
    }

    setSelected(index);
  }

  return (
    <section aria-labelledby="case-reels-heading" className={styles.gallery}>
      <div className={styles.header}>
        <h2 id="case-reels-heading" className="display">Project reels</h2>
        <span>{reels.length} {reels.length === 1 ? 'reel' : 'reels'}</span>
      </div>

      <div className={styles.body} data-playlist={reels.length > 1}>
        <div className={styles.stage}>
          <video
            key={reel.src}
            ref={player}
            id="case-reel-player"
            src={reel.src}
            poster={reel.poster}
            aria-label={`${client}, ${reel.label}`}
            controls
            playsInline
            autoPlay={selected !== null}
            preload={reel.poster ? 'none' : 'metadata'}
          />
        </div>

        {reels.length > 1 && (
          <ul aria-label="Choose a reel" className={styles.choices} data-lenis-prevent>
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
      </div>
    </section>
  );
}
