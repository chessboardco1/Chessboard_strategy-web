import { TLink } from '@/components/motion/BoardTransition';
import { nav, services, site } from '@/lib/content';

export function Footer() {
  const social = [
    { label: 'Instagram', href: site.instagram },
    { label: 'Facebook', href: site.facebook },
    { label: 'WhatsApp', href: site.whatsapp },
    ...(site.linkedin ? [{ label: 'LinkedIn', href: site.linkedin }] : []),
  ];
  return (
    <footer data-tone="dark" className="bg-ebony text-chalk">
      <div className="wrap pb-10 pt-24">
        <div className="grid gap-x-10 gap-y-14 border-t border-chalk/10 pt-14 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <img src="/brand/logo_white.png" alt={site.name} width={180} height={30} className="h-[28px] w-auto" />
            <address className="mt-8 not-italic leading-relaxed text-chalk-2">
              {site.address.map((l) => (
                <span key={l} className="block">{l}</span>
              ))}
            </address>
          </div>
          <div className="lg:col-span-3">
            <h2 className="mb-5 text-[15px] text-chalk-3">Services</h2>
            <ul className="space-y-2.5 text-[15px]">
              {services.map((s) => (
                <li key={s.slug}><TLink href={`/services/${s.slug}`} className="hover:text-move">{s.name}</TLink></li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-2">
            <h2 className="mb-5 text-[15px] text-chalk-3">Studio</h2>
            <ul className="space-y-2.5 text-[15px]">
              {nav.map((n) => (
                <li key={n.href}><TLink href={n.href} className="hover:text-move">{n.label}</TLink></li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-3">
            <h2 className="mb-5 text-[15px] text-chalk-3">Talk to us</h2>
            <ul className="space-y-2.5 text-[15px]">
              <li><a href={`mailto:${site.email}`} className="[overflow-wrap:anywhere] hover:text-move">{site.email}</a></li>
              <li><a href={site.phoneHref} className="hover:text-move">{site.phone}</a></li>
              {social.map((s) => (
                <li key={s.label}><a href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-move">{s.label}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-20 flex flex-wrap items-center justify-between gap-4 text-[14px] text-chalk-3">
          <span>© {new Date().getFullYear()} {site.name}</span>
          <TLink href="/privacy" className="hover:text-chalk">Privacy policy</TLink>
        </div>
      </div>
    </footer>
  );
}
