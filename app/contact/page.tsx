import type { Metadata } from 'next';
import { RevealLines } from '@/components/motion/Text';
import { site } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Reach Chessboard Strategy in Surat by email, WhatsApp, Instagram or Facebook.',
  alternates: { canonical: '/contact' },
};

const [mailbox, domain] = site.email.split('@');
const channels = [
  { label: 'Email', detail: <>{mailbox}@<wbr />{domain}</>, href: `mailto:${site.email}`, external: false },
  { label: 'WhatsApp', detail: site.phone, href: site.whatsapp, external: true },
  { label: 'Instagram', detail: '@chessboard.strategy', href: site.instagram, external: true },
  { label: 'Facebook', detail: site.name, href: site.facebook, external: true },
];

export default function ContactPage() {
  return (
    <section data-tone="dark" aria-labelledby="contact-title" className="bg-ebony text-chalk">
      <div className="wrap grid gap-12 section-b pt-[120px] md:pt-[168px] lg:grid-cols-12 lg:gap-16">
        <div className="min-w-0 lg:col-span-5">
          <RevealLines id="contact-title" as="h1" onLoad className="display t-l max-w-[12ch]">Start with a conversation</RevealLines>
          <p className="lede mt-6 max-w-[24rem] text-chalk-2">Tell us about your business and what you’d like to work on.</p>
        </div>

        <div className="min-w-0 lg:col-span-6 lg:col-start-7">
          <ul aria-label="Contact channels" className="divide-y divide-chalk/15 border-y border-chalk/15">
            {channels.map(({ label, detail, href, external }) => (
              <li key={label}>
                <a
                  href={href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-2 py-4 transition-colors hover:bg-chalk/5 focus-visible:bg-chalk/5 sm:px-4 sm:py-5"
                >
                  <span className="min-w-0">
                    <span className="display block text-[clamp(24px,3vw,36px)] leading-tight">{label}</span>
                    <span className="mt-1 block text-[15px] text-chalk-2 [overflow-wrap:anywhere]">{detail}</span>
                  </span>
                  <span aria-hidden="true" className="grid size-10 place-items-center border border-chalk/20 text-lg transition-colors group-hover:border-chalk group-focus-visible:border-chalk">↗</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <h2 className="text-[15px] text-chalk-3">Studio address</h2>
            <address className="mt-2 not-italic text-chalk-2">{site.address.join(', ')}</address>
          </div>
        </div>
      </div>
    </section>
  );
}
