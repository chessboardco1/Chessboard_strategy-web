import { ActionLink } from '@/components/ActionLink';
import { PieceStage } from '@/components/PieceStage';
import { TLink } from '@/components/motion/BoardTransition';

export default function NotFound() {
  return (
    <section data-tone="dark" className="bg-ebony text-chalk">
      <div className="wrap grid min-h-[100svh] items-center gap-10 pb-16 pt-[140px] lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="text-[15px] text-chalk-3">Error 404</p>
          <h1 className="display t-hero mt-6">Illegal move</h1>
          <p className="lede mt-8 max-w-[30rem] text-chalk-2">Even a knight cannot reach this square. The page may have moved, or the link was mistyped.</p>
          <div className="mt-10 flex flex-wrap items-center gap-8">
            <ActionLink href="/" tone="light">Back to the board</ActionLink>
            <TLink href="/contact" className="link-line font-medium">Tell us what you were looking for</TLink>
          </div>
        </div>
        <div className="relative h-[48svh] lg:col-span-5 lg:h-[72svh]">
          <PieceStage type="knight" tone="boxwood" className="absolute inset-0" />
        </div>
      </div>
    </section>
  );
}
