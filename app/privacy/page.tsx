import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { site } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Privacy policy',
  description: 'How Chessboard Strategy collects, uses and protects information shared through this website.',
  alternates: { canonical: '/privacy' },
};

// MOCK: a plain-language starting point. Have it reviewed before launch (see docs/MOCK-CONTENT.md).
const sections = [
  { h: 'Who we are', p: [`${site.name} is a strategy and marketing studio based at ${site.address.join(', ')}. You can reach us at ${site.email} about anything in this policy.`] },
  { h: 'What we collect', p: ['If you contact us by email, WhatsApp, Instagram or Facebook, we receive the information you share through that channel.', 'If you allow analytics, Google Analytics records how pages are used, such as which pages are visited and for how long. It does not tell us who you are.'] },
  { h: 'How we use it', p: ['We use enquiry details only to reply to you and to prepare for a conversation about your business. We do not sell or share them for advertising.', 'Analytics data helps us understand which pages are useful so we can improve the site.'] },
  { h: 'Cookies', p: ['Analytics cookies are only set after you choose “Allow analytics” in the banner. If you choose “No thanks”, analytics stays off. You can change your choice at any time by clearing this site’s data in your browser.'] },
  { h: 'How long we keep it', p: ['Enquiries are kept for as long as needed to respond and to follow up on a working relationship, and no longer than 24 months without contact. Analytics data is kept for 14 months.'] },
  { h: 'Your rights', p: ['You can ask us to show, correct or delete the information we hold about you by writing to us. We will respond within 30 days.'] },
  { h: 'Changes', p: ['If this policy changes, the updated version will be published on this page.'] },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero title="Privacy policy" lede="What we collect through this website, why, and the choices you have" />
      <section data-tone="light" className="bg-box section-b">
        <div className="wrap grid lg:grid-cols-12">
          <div className="min-w-0 max-w-[44rem] break-words lg:col-span-7 lg:col-start-5">
            {sections.map((s) => (
              <div key={s.h} className="border-t border-ink/10 py-10">
                <h2 className="display text-[clamp(26px,2.4vw,34px)] text-ebony">{s.h}</h2>
                {s.p.map((p) => (
                  <p key={p} className="mt-4 text-[18px] leading-relaxed text-ink">{p}</p>
                ))}
              </div>
            ))}
            <p className="mt-6 text-[15px] text-ink-3">Last updated November 2026</p>
          </div>
        </div>
      </section>
    </>
  );
}
