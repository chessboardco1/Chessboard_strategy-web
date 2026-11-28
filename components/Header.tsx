'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { TLink } from '@/components/motion/BoardTransition';
import { useLenis } from '@/components/motion/SmoothScroll';
import { nav, site } from '@/lib/content';

const ease = [0.22, 1, 0.36, 1] as const;

export function Header() {
  const pathname = usePathname();
  const lenis = useLenis();
  const [tone, setTone] = useState<'light' | 'dark'>('light');
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);

  // Read the tone of the section under the header, and compact it once the page has scrolled
  useEffect(() => {
    let frame = 0;
    const check = () => {
      frame = 0;
      const isCompact = window.scrollY > 40;
      setCompact(isCompact);
      const probe = isCompact ? 32 : 44; // middle of the 64 px or 88 px bar
      const el = document
        .elementsFromPoint(window.innerWidth / 2, probe)
        .find((n) => !n.closest('header') && n.closest('[data-tone]'))
        ?.closest('[data-tone]');
      setTone(el?.getAttribute('data-tone') === 'dark' ? 'dark' : 'light');
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(check); };
    check();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [pathname]);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (open) lenis?.stop(); else lenis?.start();
  }, [open, lenis]);

  const onWorkBoard = !compact && (pathname === '/work' || pathname === '/work/');
  const dark = tone === 'dark' || open || onWorkBoard;
  const tinted = compact && !open;
  return (
    <>
      <header
        className={`site-header fixed inset-x-0 top-0 z-50 ${tinted ? (tone === 'dark' ? 'is-tinted tint-dark' : 'is-tinted tint-light') : ''}`}
      >
        <div className={`wrap flex items-center justify-between gap-6 transition-[height,color] duration-500 ease-[var(--ease-move)] ${compact ? 'h-[64px]' : 'h-[88px]'} ${dark ? 'text-chalk' : 'text-ink'}`}>
          <TLink href="/" aria-label={`${site.name} home`} className="relative z-10 flex items-center">
            <img src={dark ? '/images/brand/logo-white.webp' : '/images/brand/logo.webp'} alt={site.name} width={180} height={30} className={`w-auto transition-[height] duration-500 ease-[var(--ease-move)] ${compact ? 'h-[24px]' : 'h-[28px]'}`} />
          </TLink>
          <nav aria-label="Main" className="hidden items-center gap-9 text-[15px] font-medium lg:flex">
            {nav.slice(0, 4).map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <TLink key={item.href} href={item.href} className="group relative flex items-center gap-2 py-2">
                  <span aria-hidden="true" className={`block size-[7px] bg-move transition-transform duration-500 ease-[var(--ease-move)] ${active ? 'scale-100' : 'scale-0 group-hover:scale-100'}`} />
                  <span>{item.label}</span>
                </TLink>
              );
            })}
            <TLink href="/contact" className={`btn-move !h-11 !text-[15px] ${dark ? 'btn-light' : 'btn-dark'}`}>
              <span className="sq" aria-hidden="true" />
              <span className="relative">Get in touch</span>
            </TLink>
          </nav>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
            className="relative z-10 flex h-11 w-11 items-center justify-center lg:hidden"
          >
            <span className="relative block h-3 w-7">
              <span className={`absolute left-0 top-0 h-px w-full bg-current transition-transform duration-500 ${open ? 'translate-y-[6px] rotate-45' : ''}`} />
              <span className={`absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-500 ${open ? '-translate-y-[5px] -rotate-45' : ''}`} />
            </span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu"
            className="fixed inset-0 z-40 flex flex-col justify-end bg-ebony text-chalk"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.8, ease }}
          >
            <nav aria-label="Menu" className="wrap pb-16">
              <ul className="flex flex-col gap-2">
                {nav.map((item, i) => (
                  <li key={item.href} className="overflow-hidden">
                    <motion.div initial={{ y: '110%' }} animate={{ y: '0%' }} exit={{ y: '110%' }} transition={{ duration: 0.9, ease, delay: 0.15 + i * 0.06 }}>
                      <TLink href={item.href} className="display flex items-center gap-4 text-[clamp(48px,12vw,96px)] leading-[1.05]">
                        {pathname.startsWith(item.href) && <span aria-hidden="true" className="block size-[0.18em] bg-move" />}
                        {item.label}
                      </TLink>
                    </motion.div>
                  </li>
                ))}
              </ul>
              <motion.div className="mt-12 flex flex-wrap gap-x-8 gap-y-2 text-chalk-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                <a href={`mailto:${site.email}`}>{site.email}</a>
                <a href={site.phoneHref}>{site.phone}</a>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
