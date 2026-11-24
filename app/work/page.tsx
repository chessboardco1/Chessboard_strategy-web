import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { WorkGrid } from '@/components/work/WorkGrid';
import { Clients } from '@/components/Clients';
import { YourMove } from '@/components/YourMove';
import { work } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Work',
  description: 'Films, campaigns and launches made by Chessboard Strategy for brands across healthcare, food, retail and education.',
  alternates: { canonical: '/work' },
};

export default function WorkPage() {
  return (
    <>
      <PageHero title="Moves we have made" lede="Films, campaigns and launches, each one planned as part of a bigger game for the brand behind it" />
      <section data-tone="light" className="bg-box section-b">
        <div className="wrap">
          <WorkGrid items={work} />
        </div>
      </section>
      <Clients title="And the brands behind them" />
      <YourMove line="Have a launch, a campaign or a story that deserves better than a template? Tell us about it" />
    </>
  );
}
