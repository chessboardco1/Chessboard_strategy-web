'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { TLink } from '@/components/motion/BoardTransition';

declare global {
  interface Window { gtag?: (...args: unknown[]) => void }
}

const KEY = 'cbs-consent';

/** Analytics stays off (Consent Mode "denied") until the visitor accepts. */
export function Consent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let saved: string | null = null;
    try { saved = localStorage.getItem(KEY); } catch {}
    if (saved === 'granted') window.gtag?.('consent', 'update', { analytics_storage: 'granted' });
    else if (!saved) setShow(true);
  }, []);

  const choose = (value: 'granted' | 'denied') => {
    try { localStorage.setItem(KEY, value); } catch {}
    window.gtag?.('consent', 'update', { analytics_storage: value });
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="dialog"
          aria-label="Cookie preferences"
          className="fixed bottom-5 left-5 right-5 z-[60] max-w-[420px] bg-ebony p-6 text-chalk sm:right-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 1.2 }}
        >
          <p className="text-[15px] leading-relaxed text-chalk-2">
            We use analytics cookies to see which pages help people. Nothing is shared for advertising. <TLink href="/privacy" className="link-line text-chalk">Privacy policy</TLink>
          </p>
          <div className="mt-5 flex gap-3">
            <button type="button" onClick={() => choose('granted')} className="h-11 bg-box px-5 text-[15px] font-medium text-ebony transition-colors hover:bg-move">Allow analytics</button>
            <button type="button" onClick={() => choose('denied')} className="h-11 px-5 text-[15px] font-medium text-chalk hover:text-move">No thanks</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
