import { Film } from '@/components/work/Film';

const clips = [
  { file: 'office-portrait', name: 'Behind the scenes: office' },
  { file: 'samruddhi-portrait', name: 'Behind the scenes: Samruddhi' },
  { file: 'topboy-portrait', name: 'Behind the scenes: Topboy' },
];

/** Three square frames of studio film, one per chess square, shown plainly before the Growth board. */
export function BehindTheBoard() {
  return (
    <section aria-label="Behind the scenes" className="bg-box py-16 md:py-24">
      <div className="wrap grid grid-cols-3 gap-2 sm:gap-4">
        {clips.map((clip) => (
          <div key={clip.file} className="relative aspect-square overflow-hidden bg-ebony">
            <Film src={`/videos/behind-the-scenes/${clip.file}.mp4`} poster={`/images/posters/behind-the-scenes/${clip.file}.webp`} label={clip.name} className="size-full" />
          </div>
        ))}
      </div>
    </section>
  );
}
