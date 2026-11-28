'use client';

import { useEffect, useState, type RefObject } from 'react';

/** True while the element is on screen, so off-screen canvases stop rendering. */
export function useInView(ref: RefObject<Element | null>, margin = '200px') {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: margin });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [ref, margin]);
  return inView;
}

let webglSupport: boolean | null = null;

function detectWebGL() {
  if (webglSupport !== null) return webglSupport;
  try {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2') || canvas.getContext('webgl');
    webglSupport = !!context;
    context?.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    webglSupport = false;
  }
  return webglSupport;
}

export function useCanRender3D() {
  const [supported, setSupported] = useState<boolean | null>(null);
  useEffect(() => setSupported(detectWebGL()), []);
  return supported;
}
