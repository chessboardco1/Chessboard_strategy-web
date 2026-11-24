import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ReadingProgress } from '@/components/ReadingProgress';
import { YourMove } from '@/components/YourMove';
import { TLink } from '@/components/motion/BoardTransition';
import { FadeUp, RevealLines } from '@/components/motion/Text';
import { insights, readingMinutes, services, site } from '@/lib/content';

export const dynamicParams = false;

export function generateStaticParams() {
  return insights.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = insights.find((x) => x.slug === slug);
  if (!p) return {};
  return { title: p.title, description: p.summary, alternates: { canonical: `/insights/${p.slug}` }, openGraph: { type: 'article' } };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = insights.findIndex((x) => x.slug === slug);
  if (index < 0) notFound();
  const post = insights[index];
  const next = insights[(index + 1) % insights.length];
  const service = services.find((s) => s.insight === post.slug);
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
        <header data-tone="light" className="bg-box">
          <div className="wrap pb-16 pt-[168px] md:pt-[200px]">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[15px] text-ink-3">
              <TLink href="/insights" className="hover:text-ink">Insights</TLink>
              <span aria-hidden="true" className="block size-1.5 bg-ink-3" />
              <span>{post.category}</span>
              <span aria-hidden="true" className="block size-1.5 bg-ink-3" />
              <span>{readingMinutes(post)} min read</span>
            </div>
            <RevealLines as="h1" onLoad delay={0.2} className="display t-xl mt-8 max-w-[18ch] text-ebony">{post.title}</RevealLines>
            <FadeUp delay={0.5}>
              <p className="lede mt-8 max-w-[38rem] text-ink-2">{post.summary}</p>
            </FadeUp>
          </div>
        </header>
        <div data-tone="light" className="bg-box">
          <div className="wrap grid gap-12 section-b lg:grid-cols-12">
            <aside className="hidden lg:col-span-3 lg:block">
              <div className="sticky top-32 text-[15px] text-ink-3">
                <p>Written by the {site.name} team</p>
                {service && (
                  <p className="mt-6">
                    Related service
                    <TLink href={`/services/${service.slug}`} className="link-line mt-2 block w-fit font-medium text-ink">{service.name.charAt(0).toUpperCase() + service.name.slice(1)}</TLink>
                  </p>
                )}
              </div>
            </aside>
            <div className="max-w-[44rem] border-t border-ink/10 pt-12 lg:col-span-7 lg:col-start-5">
              {post.body.map((b, i) => {
                if ('h2' in b) return <h2 key={i} className="display mb-5 mt-16 text-[clamp(28px,2.6vw,38px)] leading-[1.12] text-ebony first:mt-0">{b.h2}</h2>;
                if ('ul' in b)
                  return (
                    <ul key={i} className="my-8 flex flex-col gap-4">
                      {b.ul.map((li) => (
                        <li key={li} className="grid grid-cols-[22px_1fr] text-[19px] leading-relaxed">
                          <span aria-hidden="true" className="mt-[0.62em] block size-2 bg-ebony" />
                          {li}
                        </li>
                      ))}
                    </ul>
                  );
                return <p key={i} className={`mb-6 text-[19px] leading-[1.75] text-ink ${i === 0 ? 'text-[22px] leading-[1.6]' : ''}`}>{b.p}</p>;
              })}
            </div>
          </div>
        </div>
      </article>
      <section data-tone="light" aria-label="Next article" className="bg-box-2/60">
        <TLink href={`/insights/${next.slug}`} className="group wrap flex flex-col gap-4 py-24 md:py-32">
          <span className="flex items-center gap-3 text-[15px] text-ink-3">
            <span aria-hidden="true" className="block size-2.5 bg-move transition-transform duration-500 group-hover:translate-x-2" />
            Read next
          </span>
          <span className="display t-l max-w-[22ch] text-ebony transition-transform duration-700 ease-[var(--ease-move)] group-hover:translate-x-4">{next.title}</span>
        </TLink>
      </section>
      <YourMove />
    </>
  );
}
