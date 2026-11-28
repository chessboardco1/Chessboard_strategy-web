import { TLink } from '@/components/motion/BoardTransition';
import { readingMinutes, type Insight } from '@/lib/content';
import styles from './InsightList.module.css';

function InsightCard({ post }: { post: Insight }) {
  const titleId = `insight-title-${post.slug}`;
  const summaryId = `insight-summary-${post.slug}`;
  return (
    <li className={styles.item}>
      <TLink
        href={`/insights/${post.slug}`}
        className={styles.card}
        aria-labelledby={titleId}
        aria-describedby={summaryId}
      >
        <div className={styles.copy}>
          <div className={styles.meta}>
            <span className={styles.category}>{post.category}</span>
            <span>{readingMinutes(post)} min read</span>
          </div>
          <h2 id={titleId} className={`display ${styles.title}`}>{post.title}</h2>
          <p id={summaryId} className={styles.summary}>{post.summary}</p>
        </div>
        <div aria-hidden="true" className={styles.action}>
          <span>Read article</span>
          <span className={styles.arrow}>→</span>
        </div>
      </TLink>
    </li>
  );
}

export function InsightList({ posts }: { posts: Insight[] }) {
  return (
    <ul className={styles.list}>
      {posts.map((post) => (
        <InsightCard key={post.slug} post={post} />
      ))}
    </ul>
  );
}
