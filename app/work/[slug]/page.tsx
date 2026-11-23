import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Film } from '@/components/work/Film';
import { YourMove } from '@/components/YourMove';
import { TLink } from '@/components/motion/BoardTransition';
import { ClipReveal, FadeUp, RevealLines } from '@/components/motion/Text';
import { services, work } from '@/lib/content';

export function generateStaticParams() {
  return work.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const w = work.find((x) => x.slug === slug);
  if (!w) return {};
  return { title: `${w.client}: ${w.kind}`, description: w.brief, alternates: { canonical: `/work/${w.slug}` }, openGraph: { images: [w.poster] } };
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = work.findIndex((x) => x.slug === slug);
  if (index < 0) notFound();
  const w = work[index];
  const next = work[(index + 1) % work.length];
  const used = services.filter((s) => w.services.includes(s.slug));

  return (
    <>
      <section data-tone="light" className="bg-box">
        <div className="wrap pb-20 pt-[168px] md:pt-[200px]">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[15px] text-ink-3">
            <TLink href="/work" className="hover:text-ink">Work</TLink>
            <span aria-hidden="true" className="block size-1.5 bg-ink-3" />
            <span>{w.client}</span>
            <span aria-hidden="true" className="block size-1.5 bg-ink-3" />
            <span>{w.kind}</span>
          </div>
          <RevealLines as="h1" onLoad delay={0.2} className="display t-xl mt-8 max-w-[16ch] text-ebony">{w.title}</RevealLines>
        </div>
      </section>

      <section data-tone="light" className="bg-box">
        <div className="wrap grid gap-16 section-b lg:grid-cols-12">
          <div className="lg:col-span-5 lg:col-start-1">
            <div className="lg:sticky lg:top-28">
              <ClipReveal className="mx-auto aspect-[9/16] max-h-[78svh] bg-ebony">
                <Film src={w.video} poster={w.poster} label={`${w.client}: ${w.kind}`} className="h-full w-full object-cover" />
              </ClipReveal>
            </div>
          </div>
          <div className="flex flex-col gap-24 lg:col-span-6 lg:col-start-7 lg:pt-24">
            <FadeUp>
              <h2 className="text-[15px] text-ink-3">The brief</h2>
              <p className="display mt-5 text-[clamp(26px,2.6vw,40px)] leading-[1.18] text-ebony">{w.brief}</p>
            </FadeUp>
            <div>
              <h2 className="text-[15px] text-ink-3">The moves</h2>
              <ol className="mt-5">
                {w.moves.map((m, i) => (
                  <FadeUp key={m} as="li" delay={i * 0.06} className="grid grid-cols-[24px_1fr] gap-4 border-t border-ink/10 py-7">
                    <span aria-hidden="true" className="mt-2.5 flex flex-col gap-1">
                      <span className={`block size-2 ${i === w.moves.length - 1 ? 'bg-move' : 'bg-ebony'}`} />
                    </span>
                    <span className="text-[19px] leading-relaxed text-ink">{m}</span>
                  </FadeUp>
                ))}
              </ol>
            </div>
            <FadeUp>
              <h2 className="text-[15px] text-ink-3">The result</h2>
              <p className="display mt-5 text-[clamp(26px,2.6vw,40px)] leading-[1.18] text-ebony">{w.result}</p>
            </FadeUp>
            <FadeUp>
              <h2 className="text-[15px] text-ink-3">Services on this project</h2>
              <ul className="mt-5 flex flex-col gap-2">
                {used.map((s) => (
                  <li key={s.slug}><TLink href={`/services/${s.slug}`} className="link-line text-[18px] font-medium">{s.name.charAt(0).toUpperCase() + s.name.slice(1)}</TLink></li>
                ))}
              </ul>
            </FadeUp>
          </div>
        </div>
      </section>

      <section data-tone="dark" aria-label="Next project" className="bg-ebony text-chalk">
        <TLink href={`/work/${next.slug}`} className="group wrap grid items-end gap-10 py-24 md:grid-cols-12 md:py-32">
          <div className="md:col-span-8">
            <span className="flex items-center gap-3 text-[15px] text-chalk-3">
              <span aria-hidden="true" className="block size-2.5 bg-move transition-transform duration-500 group-hover:translate-x-2" />
              Next project
            </span>
            <span className="display t-xl mt-6 block transition-transform duration-700 ease-[var(--ease-move)] group-hover:translate-x-4">{next.client}</span>
          </div>
          <div className="md:col-span-3 md:col-start-10">
            <div className="aspect-[4/5] overflow-hidden">
              <img src={next.poster} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.4s] ease-[var(--ease-move)] group-hover:scale-105" />
            </div>
          </div>
        </TLink>
      </section>

      <YourMove />
    </>
  );
}
