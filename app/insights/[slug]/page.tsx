import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ChessDiagram } from '@/components/ChessDiagram';
import { ReadingProgress } from '@/components/ReadingProgress';
import { YourMove } from '@/components/YourMove';
import { TLink } from '@/components/motion/BoardTransition';
import { diagrams, insights, legacyPerformanceSlug, readingMinutes, resolveContentSlug, services, site } from '@/lib/content';

export const dynamicParams = false;

export function generateStaticParams() {
  return [...insights.map((p) => ({ slug: p.slug })), { slug: legacyPerformanceSlug }];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = insights.find((x) => x.slug === resolveContentSlug(slug));
  if (!p) return {};
  return { title: p.title, description: p.summary, alternates: { canonical: `/insights/${p.slug}` }, openGraph: { type: 'article' } };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = insights.findIndex((x) => x.slug === resolveContentSlug(slug));
  if (index < 0) notFound();
  const post = insights[index];
  const next = insights[(index + 1) % insights.length];
  const service = services.find((s) => s.insight === post.slug);
  const diagram = diagrams[post.slug];
  const sections = post.body.flatMap((block, i) => 'h2' in block ? [{ id: `section-${i}`, title: block.h2 }] : []);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.summary,
    author: { '@type': 'Organization', name: site.name },
    publisher: { '@type': 'Organization', name: site.name },
    mainEntityOfPage: `${site.url}/insights/${post.slug}`,
  };

  return (
    <>
      <ReadingProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article>
        <header data-tone="light" className="border-b border-[#e6d9f2] bg-[#f8f3ff]">
          <div className="wrap grid items-end gap-10 pb-12 pt-[130px] md:pb-16 md:pt-[168px] lg:grid-cols-[minmax(0,1fr)_minmax(0,15rem)]">
            <div>
              <TLink href="/insights" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[#50327a] hover:underline">
                <span aria-hidden="true">←</span> All insights
              </TLink>
              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-2">
                <span className="rounded-full bg-[#eee5fa] px-3 py-1 font-medium text-[#492976]">{post.category}</span>
                <span>{readingMinutes(post)} min read</span>
              </div>
              <h1 className="display mt-5 max-w-[22ch] text-balance text-[clamp(2.6rem,6.3vw,5.5rem)] leading-[1.02] text-ebony">{post.title}</h1>
              <p className="lede mt-6 max-w-[42rem] text-ink-2">{post.summary}</p>
            </div>
            {diagram && (
              <figure className="m-0 hidden lg:block">
                <ChessDiagram position={diagram.position} className="rounded-xl border border-[#e6d9f2] bg-box p-2" />
                <figcaption className="mt-3 text-sm leading-relaxed text-ink-2">{diagram.caption}</figcaption>
              </figure>
            )}
          </div>
        </header>
        <div data-tone="light" className="bg-box">
          <div className="wrap section-b grid gap-9 pt-9 md:pt-14 lg:grid-cols-[minmax(11rem,1fr)_minmax(0,2.85fr)] lg:gap-16">
            <aside>
              <div className="text-sm text-ink-2 lg:sticky lg:top-28">
                <p>By the {site.name} team</p>
                {sections.length > 0 && (
                  <nav aria-label="In this article" className="mt-5 hidden border-l-2 border-[#ddcbf0] pl-4 lg:block">
                    <p className="mb-2 font-medium text-ebony">In this article</p>
                    <ul className="space-y-1">
                      {sections.map((section) => (
                        <li key={section.id}>
                          <a href={`#${section.id}`} className="block py-1 hover:text-[#50327a] hover:underline">{section.title}</a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                )}
              </div>
            </aside>
            <div className="max-w-[43rem]">
              {post.body.map((b, i) => {
                if ('h2' in b) return <h2 id={`section-${i}`} key={i} className="display mb-4 mt-12 scroll-mt-28 text-balance text-[clamp(1.75rem,3vw,2.4rem)] leading-[1.12] text-ebony first:mt-0">{b.h2}</h2>;
                if ('ul' in b)
                  return (
                    <ul key={i} className="my-6 grid list-disc gap-2.5 rounded-xl bg-[#f8f3ff] py-5 pr-5 pl-10 text-[clamp(1.0625rem,2vw,1.1875rem)] leading-relaxed marker:text-[#633a9b] sm:py-7 sm:pr-7 sm:pl-12">
                      {b.ul.map((li) => (
                        <li key={li}>{li}</li>
                      ))}
                    </ul>
                  );
                return <p key={i} className={`mb-5 text-ink ${i === 0 ? 'text-[clamp(1.2rem,2.6vw,1.5rem)] leading-[1.6]' : 'text-[clamp(1.0625rem,2vw,1.1875rem)] leading-[1.75]'}`}>{b.p}</p>;
              })}
              {service && (
                <div className="mt-10 border-t border-[#e6d9f2] pt-6">
                  <p className="text-sm text-ink-2">Related service</p>
                  <TLink href={`/services/${service.slug}`} className="link-line mt-2 inline-flex items-center gap-3 font-medium text-[#50327a]">
                    {service.name.charAt(0).toUpperCase() + service.name.slice(1)}
                    <span aria-hidden="true">→</span>
                  </TLink>
                </div>
              )}
            </div>
          </div>
        </div>
      </article>
      <section data-tone="light" aria-label="Next article" className="border-t border-[#e6d9f2] bg-[#f8f3ff]">
        <TLink href={`/insights/${next.slug}`} className="group wrap flex items-center justify-between gap-5 py-14 md:py-20">
          <span>
            <span className="mb-3 block text-sm font-medium text-[#50327a]">Read next</span>
            <span className="display block max-w-[26ch] text-balance text-[clamp(1.7rem,4vw,3.25rem)] leading-[1.1] text-ebony">{next.title}</span>
          </span>
          <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-full bg-[#e9d9ff] text-xl text-[#50327a] transition-transform group-hover:-rotate-30 md:size-14">→</span>
        </TLink>
      </section>
      <YourMove />
    </>
  );
}
