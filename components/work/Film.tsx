'use client';

import { useEffect, useRef, useState } from 'react';

type FilmProps = { src: string; poster?: string; label?: string; className?: string; startDelay?: number };

/** Attach the source only when the loop is visible and autoplay is appropriate. */
export function Film({ src, poster, label, className, startDelay = 0 }: FilmProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playingSrc, setPlayingSrc] = useState<string | null>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || !('IntersectionObserver' in window)) return;

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as Navigator & { connection?: EventTarget & { saveData?: boolean } }).connection;
    const threshold = 0.15;
    let visible = false;
    let timer: number | undefined;

    const start = () => {
      if (!video.hasAttribute('src')) video.src = src;
      void video.play().catch(() => {});
    };

    const update = () => {
      window.clearTimeout(timer);
      if (motion.matches || connection?.saveData) {
        video.pause();
        setPlayingSrc(null);
      } else if (!visible || document.hidden) {
        video.pause();
      } else if (startDelay && !video.hasAttribute('src')) {
        timer = window.setTimeout(start, startDelay);
      } else {
        start();
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.intersectionRatio >= threshold;
      update();
    }, { threshold });

    observer.observe(video);
    motion.addEventListener('change', update);
    connection?.addEventListener('change', update);
    document.addEventListener('visibilitychange', update);
    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
      motion.removeEventListener('change', update);
      connection?.removeEventListener('change', update);
      document.removeEventListener('visibilitychange', update);
      if (!video.hasAttribute('src')) return;
      video.pause();
      video.removeAttribute('src');
      video.load();
    };
  }, [src, startDelay]);

  return (
    <div className={`relative ${className ?? ''}`}>
      {poster && <img src={poster} alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />}
      <video
        key={src}
        ref={ref}
        muted
        loop
        playsInline
        preload="none"
        aria-label={label}
        aria-hidden={label ? undefined : true}
        onPlaying={() => setPlayingSrc(src)}
        onError={() => setPlayingSrc(null)}
        className={`absolute inset-0 size-full object-cover transition-opacity duration-300 ${playingSrc === src ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
}
