import { clients } from '@/lib/content';

/** The brand panel under a Work preview and on the next-project link. */
export function WorkLogo({ client, projectLogo }: { client: string; projectLogo?: string }) {
  const brand = clients.find(({ name }) => name === client);
  const logo = projectLogo ?? brand?.logo;

  return (
    <div aria-hidden="true" className="grid size-full place-items-center bg-box-2 text-ink">
      {logo ? (
        <img src={logo} alt="" loading="lazy" decoding="async" className={`max-w-[72%] object-contain ${brand?.logoScale ? 'max-h-[88%]' : 'max-h-[56%]'}`} />
      ) : (
        <span className="display px-2 text-center text-sm leading-tight sm:text-xl">{client}</span>
      )}
    </div>
  );
}
