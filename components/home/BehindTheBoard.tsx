import { Film } from '@/components/work/Film';

const clips = [
  { file: 'office-portrait', name: 'Behind the scenes: office' },
  { file: 'samrudhhi-portrait', name: 'Behind the scenes: Samrudhhi' },
  { file: 'topboy-portrait', name: 'Behind the scenes: Topboy' },
];

/** Three square frames of studio film, one per chess square, shown plainly before the Growth board. */
export function BehindTheBoard() {
  return (
    <section aria-label="Behind the scenes" className="bg-box py-16 md:py-24">
      <div className="wrap grid grid-cols-3 gap-2 sm:gap-4">
        {clips.map((clip) => (
          <div key={clip.file} className="relative aspect-square overflow-hidden bg-ebony">
            <Film src={`/media/BTS/${clip.file}.mp4`} poster={`/media/BTS/${clip.file}.webp`} label={clip.name} className="size-full" />
          </div>
        ))}
      </div>
    </section>
  );
}
