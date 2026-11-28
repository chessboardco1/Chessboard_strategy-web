import type { Metadata } from 'next';
import { RevealLines } from '@/components/motion/Text';
import { site } from '@/lib/content';
import styles from './Contact.module.css';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Reach Chessboard Strategy in Surat by email, WhatsApp, Instagram or Facebook.',
  alternates: { canonical: '/contact' },
};

const [mailbox, domain] = site.email.split('@');
const channels = [
  {
    id: 'email',
    label: 'Email',
    detail: <>{mailbox}@<wbr />{domain}</>,
    href: `mailto:${site.email}`,
    external: false,
    icon: <><rect x="3" y="5.5" width="18" height="13" rx="2" /><path d="m4 7 8 6 8-6" /></>,
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    detail: site.phone,
    href: site.whatsapp,
    external: true,
    icon: <>
      <path d="M20.5 11.8a8.5 8.5 0 0 1-12.6 7.5l-4.4 1.2 1.2-4.3a8.5 8.5 0 1 1 15.8-4.4Z" />
      <path fill="currentColor" stroke="none" d="M8.5 7.4c-.6 0-1.3.8-1.3 1.8 0 2.8 3.5 6.5 7 7.2 1.2.2 2.3-.5 2.4-1.5 0-.2-.1-.4-.4-.5l-2-1c-.2-.1-.4-.1-.6.1l-.7.8c-.2.2-.4.1-.6 0a8.1 8.1 0 0 1-3-2.9c-.1-.2-.1-.4.1-.6l.6-.7c.1-.1.1-.3 0-.5l-.9-1.9c-.1-.2-.3-.3-.6-.3Z" />
    </>,
  },
  {
    id: 'instagram',
    label: 'Instagram',
    detail: '@chessboard.strategy',
    href: site.instagram,
    external: true,
    icon: <><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="3.6" /><circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" /></>,
  },
  {
    id: 'facebook',
    label: 'Facebook',
    detail: site.name,
    href: site.facebook,
    external: true,
    icon: <path fill="currentColor" stroke="none" d="M14.6 21v-8h2.7l.4-3h-3.1V8.3c0-1 .3-1.6 1.5-1.6H18V4.1c-.4-.1-1.4-.2-2.4-.2-2.5 0-4.2 1.5-4.2 4.1v2H8.5v3h2.9v8Z" />,
  },
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
          <ul aria-label="Contact channels" className={styles.channels}>
            {channels.map(({ id, label, detail, href, external, icon }) => (
              <li key={id}>
                <a
                  href={href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  className={styles.channel}
                  data-channel={id}
                >
                  <span aria-hidden="true" className={styles.icon}>
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" focusable="false">
                      {icon}
                    </svg>
                  </span>
                  <span className={styles.copy}>
                    <span className={`display ${styles.label}`}>{label}</span>
                    <span className={styles.detail}>{detail}</span>
                  </span>
                  <span aria-hidden="true" className={styles.arrow}>↗</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-8 border-t border-chalk/15 pt-5">
            <h2 className="text-[15px] text-chalk-3">Studio address</h2>
            <address className="mt-2 not-italic text-chalk-2">{site.address.join(', ')}</address>
          </div>
        </div>
      </div>
    </section>
  );
}
