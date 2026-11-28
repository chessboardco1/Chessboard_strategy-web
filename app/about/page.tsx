import type { Metadata } from 'next';
import { PieceStage } from '@/components/PieceStage';
import { Clients } from '@/components/Clients';
import { YourMove } from '@/components/YourMove';
import { FadeUp, RevealLines, ScrubWords } from '@/components/motion/Text';
import { founder, process, site } from '@/lib/content';

export const metadata: Metadata = {
  title: 'About',
  description: 'Chessboard Strategy is a strategy-first growth studio in Surat, founded by Ankesh Prasad, working with brands across India and abroad.',
  alternates: { canonical: '/about' },
};

const principles = [
  { title: 'Strategy before activity', text: 'We start by analysing your industry, audience and competition to map the winning moves, before anything is posted, spent or built.' },
  { title: 'Decisions backed by data', text: 'Every action is guided by research and analytics, so insight turns into growth you can measure and explain.' },
  { title: 'Built for the long game', text: 'We build systems for consistent lead flow and steady momentum, not one-off spikes that fade after the campaign ends.' },
];

export default function AboutPage() {
  return (
    <>
      <section data-tone="dark" className="overflow-hidden bg-ebony text-chalk">
        <div className="wrap grid min-h-[100svh] items-center gap-10 pb-16 pt-[140px] lg:grid-cols-12">
          <div className="relative z-10 lg:col-span-7">
            <RevealLines as="h1" onLoad delay={0.2} className="display t-xl max-w-[12ch]">Your strategy partner, not another agency</RevealLines>
            <FadeUp delay={0.5}>
              <p className="lede mt-8 max-w-[34rem] text-chalk-2">
                Chessboard Strategy is a growth studio in Surat. We help businesses connect strategy, performance marketing, websites and sales follow-up so more of the right people become customers.
              </p>
            </FadeUp>
          </div>
          <div className="relative h-[50svh] lg:col-span-5 lg:h-[80svh]">
            <PieceStage type="king" tone="boxwood" className="absolute inset-0" />
          </div>
        </div>
      </section>

      <section data-tone="light" aria-label="Why chess" className="bg-box">
        <div className="wrap section-y">
          <p className="mb-10 text-[15px] text-ink-3">Why chess</p>
          <ScrubWords className="display max-w-[24ch] text-[clamp(32px,4.4vw,68px)] leading-[1.1] text-ebony" from="#d4d4d4">
            Chess rewards the player who thinks three moves ahead, protects the king and wastes nothing. That is how we treat a brand’s growth. Every move has a reason, and every piece has a job.
          </ScrubWords>
        </div>
      </section>

      <section data-tone="light" aria-labelledby="principles-title" className="bg-box">
        <div className="wrap section-b">
          <RevealLines id="principles-title" className="display t-l mb-16 text-ebony">What makes us different</RevealLines>
          <ul className="grid gap-x-12 md:grid-cols-12">
            {principles.map((p, i) => (
              <FadeUp key={p.title} as="li" delay={i * 0.08} className={`border-t border-ink/10 py-10 md:col-span-4 ${i === 1 ? 'md:mt-24' : i === 2 ? 'md:mt-48' : ''}`}>
                <span aria-hidden="true" className={`block size-2.5 ${i === 0 ? 'bg-move' : 'bg-ebony'}`} />
                <h3 className="display t-m mt-6 text-ebony">{p.title}</h3>
                <p className="mt-4 text-ink-2">{p.text}</p>
              </FadeUp>
            ))}
          </ul>
        </div>
      </section>

      <section data-tone="dark" aria-labelledby="founder-title" className="bg-ebony-2 text-chalk">
        <div className="wrap grid items-center gap-16 section-y lg:grid-cols-12">
          <FadeUp className="lg:col-span-5">
            <div className="relative flex aspect-[4/5] items-center justify-center bg-ebony">
              <span className="display text-[clamp(120px,14vw,220px)] leading-none text-chalk/10">AP</span>
              <span className="absolute bottom-6 left-6 text-[14px] text-chalk-3">Portrait to come</span>
            </div>
          </FadeUp>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="text-[15px] text-chalk-3">About the founder</p>
            <RevealLines id="founder-title" className="display t-l mt-4">{founder.name}</RevealLines>
            <p className="mt-3 font-medium text-chalk-2">{founder.role}</p>
            <div className="mt-10 space-y-5 text-[clamp(18px,1.4vw,21px)] leading-relaxed text-chalk/90">
              {founder.bio.map((p) => (
                <FadeUp key={p}><p>{p}</p></FadeUp>
              ))}
            </div>
            <FadeUp>
              <blockquote className="display mt-14 text-[clamp(24px,2.4vw,34px)] leading-[1.2]">
                <span aria-hidden="true" className="mb-6 block size-3 bg-move" />
                Most growth problems are not marketing problems. They are leaks in the system nobody has looked at yet.
              </blockquote>
            </FadeUp>
          </div>
        </div>
      </section>

      <section data-tone="light" aria-labelledby="process-title" className="bg-box">
        <div className="wrap section-y">
          <RevealLines id="process-title" className="display t-l max-w-[14ch] text-ebony">How every engagement runs</RevealLines>
          <ol className="mt-16 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            {process.map((step, i) => (
              <FadeUp key={step.title} as="li" delay={i * 0.08}>
                <span aria-hidden="true" className="flex gap-1.5">
                  {process.map((_, j) => (
                    <span key={j} className={`block size-2 ${j === i ? 'bg-move' : j < i ? 'bg-ebony' : 'bg-ink/15'}`} />
                  ))}
                </span>
                <h3 className="display mt-6 text-[clamp(26px,2.4vw,34px)] leading-[1.1] text-ebony">{step.title}</h3>
                <p className="mt-3 text-ink-2">{step.text}</p>
              </FadeUp>
            ))}
          </ol>
        </div>
      </section>

      <section data-tone="light" aria-labelledby="studio-title" className="bg-box-2/60">
        <div className="wrap grid gap-12 py-28 md:grid-cols-12 md:py-36">
          <div className="md:col-span-6">
            <RevealLines id="studio-title" className="display t-l text-ebony">The studio</RevealLines>
            <p className="lede mt-6 max-w-[30rem] text-ink-2">Based in Vesu, Surat. Serving brands across India and abroad, in person or online.</p>
          </div>
          <FadeUp className="md:col-span-5 md:col-start-8">
            <address className="display text-[clamp(26px,2.4vw,36px)] not-italic leading-[1.25] text-ebony">
              {site.address.map((l) => (
                <span key={l} className="block">{l}</span>
              ))}
            </address>
            <a href="https://maps.google.com/?q=SNS+Atria+Vesu+Surat" target="_blank" rel="noopener noreferrer" className="link-line mt-8 inline-block font-medium">Open in Google Maps</a>
          </FadeUp>
        </div>
      </section>

      <Clients />
      <YourMove />
    </>
  );
}
