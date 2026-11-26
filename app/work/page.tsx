import type { Metadata } from 'next';
import { WorkDock } from '@/components/work/WorkDock';
import { Clients } from '@/components/Clients';
import { YourMove } from '@/components/YourMove';
import { TLink } from '@/components/motion/BoardTransition';
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
      <section id="case-studies" data-tone="light" aria-labelledby="work-title" className="bg-box">
        <div className="wrap section-y">
          <h1 id="work-title" className="display t-l text-ebony">Moves we have made</h1>
          <p className="mt-3 text-ink-2">
            {work.length} case studies
            <span className="hidden [@media(hover:hover)]:inline"> · Hover a logo on the board to preview</span>
            <span className="[@media(hover:hover)]:hidden"> · Tap a logo on the board to preview</span>
          </p>
          <ul className="mt-10 grid border-t border-ink/15 md:grid-cols-2 md:gap-x-12">
            {work.map(({ slug, client, kind }) => (
              <li key={slug} className="border-b border-ink/15">
                <TLink href={`/work/${slug}`} prefetch={false} className="flex items-center justify-between gap-4 px-2 py-4 transition-colors hover:bg-box-2 focus-visible:bg-box-2">
                  <span>
                    <span className="block text-lg font-medium text-ebony">{client}</span>
                    <span className="block text-sm text-ink-2">{kind}</span>
                  </span>
                  <span aria-hidden="true" className="text-xl text-ink-2">↗</span>
                </TLink>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <Clients title="And the brands behind them" />
      <YourMove line="Have a launch, a campaign or a story that deserves better than a template? Tell us about it" />
    </>
  );
}
