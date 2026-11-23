import { FadeUp, RevealLines } from '@/components/motion/Text';

export function PageHero({ title, lede }: { title: string; lede?: string }) {
  return (
    <section data-tone="light" className="bg-box text-ink">
      <div className="wrap grid gap-12 pb-20 pt-[168px] md:pb-28 md:pt-[200px] lg:grid-cols-12">
        <div className="lg:col-span-11">
          <RevealLines as="h1" onLoad delay={0.2} className="display t-xl max-w-[16ch] text-ebony">
            {title}
          </RevealLines>
          {lede && (
            <FadeUp delay={0.5}>
              <p className="lede mt-8 max-w-[38rem] text-ink-2">{lede}</p>
            </FadeUp>
          )}
        </div>
      </div>
    </section>
  );
}
