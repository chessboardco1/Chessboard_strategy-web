'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, useReducedMotion } from 'motion/react';
import { ActionLink } from '@/components/ActionLink';
import { TLink } from '@/components/motion/BoardTransition';
import { useLenis } from '@/components/motion/SmoothScroll';
import { nav, site } from '@/lib/content';

const ease = [0.22, 1, 0.36, 1] as const;

export function Header() {
  const pathname = usePathname().replace(/\/$/, '') || '/';
  const lenis = useLenis();
  const reduced = useReducedMotion();
  const menu = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
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
        .find((n) => !n.closest('.site-header') && n.closest('[data-tone]'))
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
    if (!open) return;
    lenis?.stop();
    return () => lenis?.start();
  }, [open, lenis]);

  useEffect(() => {
    if (!open) return;
    const links = menu.current?.querySelectorAll<HTMLAnchorElement>('a[href]');
    const first = links?.[0];
    const last = links?.[links.length - 1];
    first?.focus({ preventScroll: true });

    const desktop = window.matchMedia('(min-width: 64rem)');
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
        toggle.current?.focus();
      }
      if (event.key !== 'Tab') return;
      const focused = document.activeElement;
      if (!menu.current?.contains(focused)) {
        event.preventDefault();
        (event.shiftKey ? last : first)?.focus();
      } else if (event.shiftKey ? focused === first : focused === last) {
        event.preventDefault();
        toggle.current?.focus();
      }
    };
    desktop.addEventListener('change', closeOnDesktop);
    document.addEventListener('keydown', handleKey);
    return () => {
      desktop.removeEventListener('change', closeOnDesktop);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  const onWorkBoard = !compact && pathname === '/work';
  const dark = tone === 'dark' || open || onWorkBoard;
  const tinted = compact && !open;
  const linkStatus = (href: string) => pathname === href ? 'page' : pathname.startsWith(`${href}/`) ? 'location' : undefined;

  return (
    <>
      <header
        data-menu-open={open || undefined}
        className={`site-header fixed inset-x-0 top-0 ${open ? 'z-[70]' : 'z-50'} ${tinted ? (tone === 'dark' ? 'is-tinted tint-dark' : 'is-tinted tint-light') : ''}`}
      >
        <div className={`wrap flex items-center justify-between gap-3 transition-[height,color] duration-500 ease-[var(--ease-move)] sm:gap-6 ${compact ? 'h-[64px]' : 'h-[88px]'} ${dark ? 'text-chalk' : 'text-ink'}`}>
          <TLink href="/" aria-label={`${site.name} home`} className="relative z-10 flex items-center">
            <img src={dark ? '/images/brand/logo-white.webp' : '/images/brand/logo.webp'} alt={site.name} width={180} height={30} className={`w-auto max-w-[min(40vw,180px)] object-contain transition-[height] duration-500 ease-[var(--ease-move)] ${compact ? 'h-[24px]' : 'h-[28px]'}`} />
          </TLink>
          <nav aria-label="Main" className="hidden items-center gap-9 text-[15px] font-medium lg:flex">
            {nav.filter((item) => item.href !== '/contact').map((item) => {
              const active = linkStatus(item.href);
              return (
                <TLink key={item.href} href={item.href} aria-current={active} className="group flex min-h-11 items-center gap-2">
                  <span aria-hidden="true" className={`size-[7px] bg-move transition-transform duration-500 ease-[var(--ease-move)] ${active ? 'scale-100' : 'scale-0 group-hover:scale-100 group-focus-visible:scale-100'}`} />
                  {item.label}
                </TLink>
              );
            })}
            <ActionLink href="/contact" compact tone={dark ? 'light' : 'dark'} aria-current={linkStatus('/contact')}>
              Get in touch
            </ActionLink>
          </nav>
          <button
            ref={toggle}
            type="button"
            aria-expanded={open}
            aria-controls={open ? 'site-menu' : undefined}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
            className="relative z-10 flex size-11 items-center justify-center lg:hidden"
          >
            <span aria-hidden="true" className="relative block h-3 w-7">
              <span className={`absolute left-0 top-0 h-px w-full bg-current transition-transform duration-500 ${open ? 'translate-y-[5.5px] rotate-45' : ''}`} />
              <span className={`absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-500 ${open ? '-translate-y-[5.5px] -rotate-45' : ''}`} />
            </span>
          </button>
        </div>
      </header>

      {open && (
        <motion.div
          ref={menu}
          id="site-menu"
          data-lenis-prevent
          className="fixed inset-0 z-[65] flex flex-col overflow-y-auto overscroll-contain bg-ebony text-chalk lg:hidden"
          initial={reduced ? false : { clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: 'inset(0 0 0% 0)' }}
          transition={{ duration: 0.6, ease }}
        >
          <nav aria-label="Main" className="wrap mt-auto pb-12 pt-28">
            <ul className="flex flex-col gap-2">
              {nav.map((item, index) => (
                <li key={item.href}>
                  <motion.div
                    initial={reduced ? false : { y: '45%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.48, ease, delay: 0.08 + index * 0.045 }}
                  >
                    <TLink
                      href={item.href}
                      aria-current={linkStatus(item.href)}
                      onClick={() => { setOpen(false); toggle.current?.focus({ preventScroll: true }); }}
                      className="display flex items-center gap-4 text-[clamp(40px,12vw,96px)] leading-[1.05]"
                    >
                      {linkStatus(item.href) && <span aria-hidden="true" className="size-[0.18em] bg-move" />}
                      {item.label}
                    </TLink>
                  </motion.div>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-sm text-chalk-2">
              <a href={`mailto:${site.email}`} className="break-all hover:text-chalk">{site.email}</a>
              <a href={site.phoneHref} className="hover:text-chalk">{site.phone}</a>
            </div>
          </nav>
        </motion.div>
      )}
    </>
  );
}
