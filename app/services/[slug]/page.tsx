import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PieceStage } from '@/components/PieceStage';
import { WorkGrid } from '@/components/work/WorkGrid';
import { YourMove } from '@/components/YourMove';
import { TLink } from '@/components/motion/BoardTransition';
import { FadeUp, RevealLines, ScrubWords } from '@/components/motion/Text';
import { insights, pieces, services, work } from '@/lib/content';

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = services.find((x) => x.slug === slug);
  if (!s) return {};
  return { title: s.name.charAt(0).toUpperCase() + s.name.slice(1), description: s.intro, alternates: { canonical: `/services/${s.slug}` } };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = services.findIndex((x) => x.slug === slug);
  if (index < 0) notFound();
  const s = services[index];
  const next = services[(index + 1) % services.length];
  const piece = pieces.find((p) => p.type === s.piece)!;
  const related = work.filter((w) => w.services.includes(s.slug));
  const article = insights.find((i) => i.slug === s.insight);

  return (
    <>
      <section data-tone="dark" className="relative overflow-hidden bg-ebony text-chalk">
        <div className="wrap grid min-h-[100svh] items-center gap-10 pb-16 pt-[140px] lg:grid-cols-12">
          <div className="relative z-10 lg:col-span-7">
            <TLink href="/services" className="text-[15px] text-chalk-3 hover:text-chalk">Services</TLink>
            <RevealLines as="h1" onLoad delay={0.2} className="display t-xl mt-6 max-w-[13ch]">
              {s.name.charAt(0).toUpperCase() + s.name.slice(1)}
            </RevealLines>
            <FadeUp delay={0.5}>
              <p className="lede mt-8 max-w-[34rem] text-chalk-2">{s.intro}</p>
            </FadeUp>
          </div>
          <div className="relative h-[52svh] lg:col-span-5 lg:h-[78svh]">
            <PieceStage type={s.piece} tone="boxwood" className="absolute inset-0" />
            <p className="absolute bottom-0 left-0 text-[15px] text-chalk-3">
              {piece.name}: {piece.title.toLowerCase()}
            </p>
          </div>
        </div>
      </section>

      <section data-tone="light" aria-label="The problem" className="bg-box">
        <div className="wrap section-y">
          <p className="mb-10 text-[15px] text-ink-3">The problem we solve</p>
          <ScrubWords className="display max-w-[26ch] text-[clamp(32px,4.2vw,64px)] leading-[1.1] text-ebony" from="#cfc5b4">
            {s.problem}
          </ScrubWords>
        </div>
      </section>

      <section data-tone="light" aria-labelledby="structure-title" className="bg-box">
        <div className="wrap grid gap-16 section-b lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <RevealLines id="structure-title" className="display t-l max-w-[10ch] text-ebony">What we put in place</RevealLines>
            </div>
          </div>
          <ul className="lg:col-span-6 lg:col-start-7">
            {s.structure.map((item, i) => (
              <FadeUp key={item} as="li" delay={i * 0.05} className="flex items-baseline gap-6 border-t border-ink/10 py-8">
                <span aria-hidden="true" className="block size-2.5 shrink-0 translate-y-[-3px] bg-ebony" />
                <span className="display text-[clamp(24px,2.4vw,36px)] leading-[1.15] text-ebony">{item}</span>
              </FadeUp>
            ))}
          </ul>
        </div>
      </section>

      <section data-tone="dark" aria-labelledby="outcome-title" className="bg-ebony-2 text-chalk">
        <div className="wrap grid gap-12 section-y lg:grid-cols-12">
          <h2 id="outcome-title" className="text-[15px] text-chalk-3 lg:col-span-3">What you get</h2>
          <RevealLines as="p" className="display t-l lg:col-span-9">{s.outcome}</RevealLines>
        </div>
      </section>

      {related.length > 0 && (
        <section data-tone="light" aria-labelledby="related-title" className="bg-box">
          <div className="wrap section-y">
            <RevealLines id="related-title" className="display t-l mb-14 text-ebony">Played on real boards</RevealLines>
            <WorkGrid items={related} compact />
          </div>
        </section>
      )}

      {article && (
        <section data-tone="light" aria-label="Further reading" className="bg-box">
          <div className="wrap pb-28">
            <TLink href={`/insights/${article.slug}`} className="group grid gap-4 border-t border-ink/10 pt-10 md:grid-cols-12">
              <span className="text-[15px] text-ink-3 md:col-span-3">Further reading</span>
              <span className="display text-[clamp(26px,2.8vw,42px)] leading-[1.1] text-ebony transition-colors group-hover:text-move md:col-span-9">{article.title}</span>
            </TLink>
          </div>
        </section>
      )}

      <section data-tone="light" aria-label="Next service" className="bg-box-2/60">
        <TLink href={`/services/${next.slug}`} className="group wrap flex flex-col gap-4 py-24 md:py-32">
          <span className="flex items-center gap-3 text-[15px] text-ink-3">
            <span aria-hidden="true" className="block size-2.5 bg-move transition-transform duration-500 group-hover:translate-x-2" />
            Next move
          </span>
          <span className="display t-xl text-ebony transition-transform duration-700 ease-[var(--ease-move)] group-hover:translate-x-4">
            {next.name.charAt(0).toUpperCase() + next.name.slice(1)}
          </span>
        </TLink>
      </section>

      <YourMove />
    </>
  );
}
