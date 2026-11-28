import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { ServicesExplorer } from '@/components/ServicesExplorer';
import { YourMove } from '@/components/YourMove';
import { ScrubWords } from '@/components/motion/Text';

export const metadata: Metadata = {
  title: 'Services',
  description: 'Strategic marketing planning, growth consulting, performance marketing, social media, websites and sales optimisation, run as one connected system.',
  alternates: { canonical: '/services' },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        title="Seven services, played as one system"
        lede="Each service stands on its own. Together they cover the whole board, from the plan to the follow-up call"
      />
      <section data-tone="light" className="bg-box section-b">
        <div className="wrap">
          <ServicesExplorer />
        </div>
      </section>
      <section data-tone="dark" aria-label="How the services connect" className="bg-ebony text-chalk">
        <div className="wrap py-36 md:py-52">
          <ScrubWords className="display max-w-[24ch] text-[clamp(34px,4.6vw,72px)] leading-[1.08]" from="#4d4d4d">
            A campaign without a plan is noise. A plan without follow-up is a document. We connect the two, so the money you spend keeps working after the click.
          </ScrubWords>
        </div>
      </section>
      <YourMove />
    </>
  );
}
