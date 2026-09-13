import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const SESSION_KEY = "shreyaa-intro-seen";

export function IntroLoader() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hasSeenIntro = window.sessionStorage.getItem(SESSION_KEY) === "true";
    if (hasSeenIntro) return;

    setVisible(true);
    window.sessionStorage.setItem(SESSION_KEY, "true");

    const timeout = window.setTimeout(() => {
      setVisible(false);
    }, 1200);

    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="intro-loader"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-[color:var(--background)]"
          aria-hidden
        >
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-7xl tracking-tight text-ink md:text-8xl"
          >
            S<span className="text-coral">.</span>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
