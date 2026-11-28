import type { Metadata } from 'next';
import { InsightList } from '@/components/InsightList';
import { YourMove } from '@/components/YourMove';
import { insights } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Insights',
  description: 'Practical articles from Chessboard Strategy on strategy, performance marketing, social media, websites and sales.',
  alternates: { canonical: '/insights' },
};

export default function InsightsPage() {
  return (
    <>
      <section data-tone="light" aria-labelledby="insights-heading" className="bg-box section-b">
        <div className="wrap pt-[136px] md:pt-[176px]">
          <div className="mb-10 border-b border-ink/10 pb-8 md:mb-14 md:pb-12">
            <h1 id="insights-heading" className="display t-xl text-ebony">Notes from the board</h1>
            <p className="lede mt-5 max-w-[38rem] text-ink-2">Practical articles on planning campaigns, improving your website and turning interest into sales.</p>
          </div>
          <InsightList posts={insights} />
        </div>
      </section>
      <YourMove line="Tell us what you’re working on and we’ll help you decide where to start." />
    </>
  );
}
