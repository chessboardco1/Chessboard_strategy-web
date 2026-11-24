import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { InsightList } from '@/components/InsightList';
import { YourMove } from '@/components/YourMove';
import { insights } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Insights',
  description: 'Notes from Chessboard Strategy on marketing strategy, performance advertising, social media, websites and revenue systems.',
  alternates: { canonical: '/insights' },
};

export default function InsightsPage() {
  return (
    <>
      <PageHero title="Notes from the board" lede="Short, practical thinking on strategy, advertising, content, websites and the systems that connect them" />
      <section data-tone="light" className="bg-box section-b">
        <div className="wrap">
          <InsightList posts={insights} />
        </div>
      </section>
      <YourMove line="Reading is the first move. Talking it through for your business is the second" />
    </>
  );
}
