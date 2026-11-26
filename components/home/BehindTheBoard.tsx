import { Film } from '@/components/work/Film';

const clips = [
  { src: '/media/BTS/office-portrait.mp4', name: 'Behind the scenes: office' },
  { src: '/media/BTS/samrudhhi-portrait.mp4', name: 'Behind the scenes: Samrudhhi' },
  { src: '/media/BTS/topboy-portrait.mp4', name: 'Behind the scenes: Topboy' },
];

/** Three square frames of studio film, one per chess square, shown plainly before the Growth board. */
export function BehindTheBoard() {
  return (
    <section aria-label="Behind the scenes" className="bg-box py-16 md:py-24">
      <div className="wrap grid grid-cols-3 gap-2 sm:gap-4">
        {clips.map((clip) => (
          <div key={clip.src} className="relative aspect-square overflow-hidden bg-ebony">
            <Film src={clip.src} label={clip.name} className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
}
