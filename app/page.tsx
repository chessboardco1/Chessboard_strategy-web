import { Hero } from '@/components/home/Hero';
import { Growth } from '@/components/home/Growth';
import { WorkReel } from '@/components/home/WorkReel';
import { ServiceRows } from '@/components/ServiceRows';
import { Clients } from '@/components/Clients';
import { HomeNotes } from '@/components/home/HomeNotes';
import { TeamBoard } from '@/components/home/TeamBoard';
import { YourMove } from '@/components/YourMove';
import { TLink } from '@/components/motion/BoardTransition';
import { FadeUp, RevealLines, ScrubWords } from '@/components/motion/Text';
import { insights, process } from '@/lib/content';

export default function Home() {
  return (
    <>
      <Hero />

      <section data-tone="dark" aria-label="Approach" className="bg-ebony text-chalk">
        <div className="wrap py-36 md:py-56">
          <ScrubWords className="display max-w-[22ch] text-[clamp(36px,5vw,80px)] leading-[1.08]" from="#3a362f">
            Growth is not luck. It is planning, precision and powerful execution. We help brands build clear strategy, stronger systems and growth they can measure.
          </ScrubWords>
        </div>
      </section>

      <Growth />

      <WorkReel />

      <section data-tone="dark" aria-labelledby="services-title" className="bg-ebony text-chalk">
        <div className="wrap section-y">
          <div className="mb-16 flex flex-wrap items-end justify-between gap-8">
            <RevealLines id="services-title" className="display t-xl">What we do</RevealLines>
            <TLink href="/services" className="link-line font-medium">How each service works</TLink>
          </div>
          <ServiceRows />
        </div>
      </section>

      <section data-tone="light" aria-labelledby="process-title" className="bg-box">
        <div className="wrap grid gap-16 section-y lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <RevealLines id="process-title" className="display t-l max-w-[10ch] text-ebony">How every game is played</RevealLines>
              <p className="lede mt-6 max-w-[26rem] text-ink-2">Four phases, the same every time, so you always know where the work stands</p>
            </div>
          </div>
          <ol className="flex flex-col gap-20 lg:col-span-6 lg:col-start-7">
            {process.map((step, i) => (
              <FadeUp key={step.title} as="li">
                <span aria-hidden="true" className="flex gap-1.5">
                  {process.map((_, j) => (
                    <span key={j} className={`block size-2 ${j === i ? 'bg-move' : j < i ? 'bg-ebony' : 'bg-ink/15'}`} />
                  ))}
                </span>
                <h3 className="display t-m mt-6 text-ebony">{step.title}</h3>
                <p className="mt-4 max-w-[32rem] text-[18px] text-ink-2">{step.text}</p>
              </FadeUp>
            ))}
          </ol>
        </div>
      </section>

      <Clients />

      <TeamBoard />

      <section data-tone="light" aria-labelledby="insights-title" className="bg-box">
        <div className="wrap section-y">
          <div className="mb-14 flex flex-wrap items-end justify-between gap-8">
            <RevealLines id="insights-title" className="display t-l text-ebony">Notes from the board</RevealLines>
            <TLink href="/insights" className="link-line font-medium">All insights</TLink>
          </div>
          <HomeNotes posts={insights.slice(0, 3)} />
        </div>
      </section>

      <YourMove />
    </>
  );
}
