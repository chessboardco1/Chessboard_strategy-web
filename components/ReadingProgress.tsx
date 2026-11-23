'use client';

import { motion, useScroll, useSpring } from 'motion/react';

/** A thin purple line along the top of the page that fills as you read. */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });
  return <motion.div aria-hidden="true" className="fixed inset-x-0 top-0 z-[55] h-[3px] origin-left bg-move" style={{ scaleX }} />;
}
