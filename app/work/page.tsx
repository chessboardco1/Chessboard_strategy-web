import type { Metadata } from 'next';
import { WorkDock } from '@/components/work/WorkDock';
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
      <WorkDock items={work} />
      <Clients title="And the brands behind them" />
      <YourMove line="Have a launch, a campaign or a story that deserves better than a template? Tell us about it" />
    </>
  );
}
