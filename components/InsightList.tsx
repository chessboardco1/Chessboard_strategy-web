'use client';

import { motion } from 'motion/react';
import { TLink } from '@/components/motion/BoardTransition';
import { readingMinutes, type Insight } from '@/lib/content';

/** Editorial list of articles: title on the left, category and reading time on the right. */
export function InsightList({ posts }: { posts: Insight[] }) {
  return (
    <ul className="flex flex-col">
      {posts.map((post, i) => (
        <motion.li
          key={post.slug}
          className="border-t border-ink/10"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: i * 0.05 }}
        >
          <TLink href={`/insights/${post.slug}`} className="group grid gap-3 py-9 md:grid-cols-12 md:items-baseline md:gap-8">
            <span className="text-[15px] text-ink-3 md:col-span-2">{post.category}</span>
            <span className="md:col-span-7">
              <span className="display block text-[clamp(26px,2.6vw,40px)] leading-[1.1] text-ebony transition-colors duration-300 group-hover:text-move">{post.title}</span>
              <span className="mt-3 block max-w-[40rem] text-ink-2">{post.summary}</span>
            </span>
            <span className="flex items-center gap-3 text-[15px] text-ink-3 md:col-span-3 md:justify-end">
              {readingMinutes(post)} min read
              <span aria-hidden="true" className="block size-2 scale-0 bg-move transition-transform duration-500 ease-[var(--ease-move)] group-hover:scale-100" />
            </span>
          </TLink>
        </motion.li>
      ))}
    </ul>
  );
}
