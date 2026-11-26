'use client';

import { useEffect, useRef, useState } from 'react';

/** A muted loop that starts loading and playing when it enters the viewport. */
export function Film({ src, poster, label, className }: { src: string; poster?: string; label?: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playingSrc, setPlayingSrc] = useState<string | null>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (!video.hasAttribute('src')) video.src = src;
        video.play().catch(() => {});
      } else video.pause();
    }, { threshold: 0.01 });

    observer.observe(video);
    return () => {
      observer.disconnect();
      if (!video.hasAttribute('src')) return;
      video.pause();
      video.removeAttribute('src');
      video.load();
    };
  }, [src]);

  return (
    <div className={`relative ${className ?? ''}`}>
      {poster && <img src={poster} alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />}
      <video
        key={src}
        ref={ref}
        autoPlay
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
