'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

/**
 * Full-screen farewell overlay shown while logging out.
 *
 * - Sets the warm psych message from `farewellMessages` (passed via prop).
 * - Auto-navigates to `/` after ~1.2s so the user lands cleanly.
 * - Strict safety timer at 1.5s guarantees the timer can never strand the user
 *   on a locked screen (fallback even if the SW/redirect hiccups).
 */
export function LogoutFarewell({ message }: { message: string | null }) {
  const [visible, setVisible] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (!message || started.current) return;
    started.current = true;
    setVisible(true);

    const soft = setTimeout(() => {
      window.location.replace('/');
    }, 1200);
    const hard = setTimeout(() => {
      window.location.replace('/');
    }, 1500);

    return () => {
      clearTimeout(soft);
      clearTimeout(hard);
    };
  }, [message]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center gap-6 bg-[var(--bg-main)]"
          style={{ background: 'radial-gradient(1200px 600px at 50% 20%, var(--glow-color), var(--bg-main) 70%)' }}
          aria-live="polite"
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 220, damping: 18 }}
            className="flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ backgroundColor: 'var(--primary-light)' }}
          >
            <span className="text-3xl">👋</span>
          </motion.div>
          <motion.p
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="max-w-sm px-6 text-center text-base font-bold leading-relaxed"
            style={{ color: 'var(--text-main)' }}
          >
            {message}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default LogoutFarewell;
